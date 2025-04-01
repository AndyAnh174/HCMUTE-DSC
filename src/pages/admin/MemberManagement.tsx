import { useState, useEffect, useCallback, useMemo, memo } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message, Avatar, Divider, Upload, Input as AntInput, Space } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined, DownloadOutlined, PushpinOutlined, PushpinFilled } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import type { RcFile } from 'antd/es/upload/interface';
import { config } from '../../config/env';
import debounce from 'lodash.debounce';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';

const { confirm } = Modal;
const { Search } = AntInput;
const { Option } = Select;

interface Member {
  id: number;
  name: string;
  role: string;
  avatar: string;
  team: string;
  department: string;
  year?: string;
  joinYear: string;
  status: 'active' | 'inactive';
  skills: string[];
  links: {
    facebook: string;
    github: string;
    email: string;
  };
  isPinned?: boolean;
}

interface ExportModalProps {
  visible: boolean;
  onCancel: () => void;
  onExport: (filters: ExportFilters) => void;
  loading: boolean;
  totalMembers: number;
}

interface ExportFilters {
  team?: string;
  status?: string;
  year?: string;
  joinYear?: string;
  fields: string[];
  fileType: 'xlsx' | 'csv';
}

const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${config.apiUrl}${path}`;
};

const FilterControls = memo(({
  searchText,
  filterTeam,
  filterYear,
  filterStatus,
  onSearchChange,
  onTeamChange,
  onYearChange,
  onStatusChange
}: {
  searchText: string;
  filterTeam: string;
  filterYear: string;
  filterStatus: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onTeamChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onStatusChange: (value: string) => void;
}) => (
  <Space className="mb-4">
    <Search
      placeholder="Tìm kiếm theo tên, vai trò..."
      allowClear
      style={{ width: 300 }}
      value={searchText}
      onChange={onSearchChange}
    />
    
    <Select 
      placeholder="Lọc theo team"
      allowClear
      style={{ width: 200 }}
      value={filterTeam}
      onChange={onTeamChange}
    >
      <Option value="lead">Lead Team</Option>
      <Option value="academic">Học thuật</Option>
      <Option value="event">Sự kiện</Option>
      <Option value="media">Truyền thông</Option>
    </Select>

    <Select
      placeholder="Lọc theo năm"
      allowClear
      style={{ width: 200 }}
      value={filterYear}
      onChange={onYearChange}
    >
      <Option value="2030-2031">2030-2031</Option>
      <Option value="2029-2030">2029-2030</Option>
      <Option value="2028-2029">2028-2029</Option>
      <Option value="2027-2028">2027-2028</Option>
      <Option value="2026-2027">2026-2027</Option>
      <Option value="2025-2026">2025-2026</Option>
      <Option value="2024-2025">2024-2025</Option>
      <Option value="2023-2024">2023-2024</Option>
      <Option value="2022-2023">2022-2023</Option>
      <Option value="2021-2022">2021-2022</Option>
      <Option value="2020-2021">2020-2021</Option>
    </Select>

    <Select
      placeholder="Trạng thái"
      allowClear
      style={{ width: 200 }}
      value={filterStatus}
      onChange={onStatusChange}
    >
      <Option value="active">Còn hoạt động</Option>
      <Option value="inactive">Hết hoạt động</Option>
    </Select>
  </Space>
));

const ExportModal = memo(({ visible, onCancel, onExport, loading }: ExportModalProps) => {
  const [form] = Form.useForm();

  const handleExport = () => {
    form.validateFields().then(values => {
      onExport(values);
    });
  };

  return (
    <Modal
      title="Xuất danh sách thành viên"
      open={visible}
      onCancel={onCancel}
      onOk={handleExport}
      confirmLoading={loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          fields: ['name', 'role', 'department', 'team', 'joinYear', 'status'],
          fileType: 'xlsx'
        }}
      >
        <Form.Item
          name="team"
          label="Lọc theo team"
        >
          <Select allowClear>
            <Option value="lead">Lead Team</Option>
            <Option value="academic">Học thuật</Option>
            <Option value="event">Sự kiện</Option>
            <Option value="media">Truyền thông</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Lọc theo trạng thái"
        >
          <Select allowClear>
            <Option value="active">Còn hoạt động</Option>
            <Option value="inactive">Hết hoạt động</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="year"
          label="Lọc theo năm nhiệm kỳ"
        >
          <Select allowClear>
            <Option value="2030-2031">2030-2031</Option>
            <Option value="2029-2030">2029-2030</Option>
            <Option value="2028-2029">2028-2029</Option>
            <Option value="2027-2028">2027-2028</Option>
            <Option value="2026-2027">2026-2027</Option>
            <Option value="2025-2026">2025-2026</Option>
            <Option value="2024-2025">2024-2025</Option>
            <Option value="2023-2024">2023-2024</Option>
            <Option value="2022-2023">2022-2023</Option>
            <Option value="2021-2022">2021-2022</Option>
            <Option value="2020-2021">2020-2021</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="joinYear"
          label="Lọc theo năm tham gia"
        >
          <Select allowClear>
            {Array.from({ length: 5 }, (_, i) => {
              const year = new Date().getFullYear() - i;
              return (
                <Option key={year} value={year.toString()}>
                  {year}
                </Option>
              );
            })}
          </Select>
        </Form.Item>

        <Form.Item
          name="fields"
          label="Chọn các trường xuất"
          rules={[{ required: true, message: 'Vui lòng chọn ít nhất một trường' }]}
        >
          <Select
            mode="multiple"
            placeholder="Chọn các trường cần xuất"
          >
            <Option value="name">Tên thành viên</Option>
            <Option value="role">Vai trò</Option>
            <Option value="department">Phòng ban</Option>
            <Option value="team">Team</Option>
            <Option value="year">Năm nhiệm kỳ</Option>
            <Option value="joinYear">Năm tham gia</Option>
            <Option value="status">Trạng thái</Option>
            <Option value="skills">Kỹ năng</Option>
            <Option value="email">Email</Option>
            <Option value="facebook">Facebook</Option>
            <Option value="github">Github</Option>
          </Select>
        </Form.Item>

        <div className="grid grid-cols-2 gap-4">
          <Form.Item
            name="fileType"
            label="Định dạng file"
            rules={[{ required: true, message: 'Vui lòng chọn định dạng file' }]}
          >
            <Select>
              <Option value="xlsx">Excel (XLSX)</Option>
              <Option value="csv">CSV</Option>
            </Select>
          </Form.Item>

        </div>
      </Form>
    </Modal>
  );
});

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>();
  const [searchText, setSearchText] = useState('');
  const [debouncedSearchText, setDebouncedSearchText] = useState('');
  const [filterTeam, setFilterTeam] = useState<string>('');
  const [filterYear, setFilterYear] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [exportModalVisible, setExportModalVisible] = useState(false);
  const [exportLoading, setExportLoading] = useState(false);
  const [pinLoading, setPinLoading] = useState<number | null>(null);

  const pinnedMember = members.find(member => member.isPinned);
  const otherMembers = members.filter(member => !member.isPinned);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/members/`);
      const data = await response.json();
      
      if (response.ok) {
        setMembers(data.data || []);
        if (!data.data || data.data.length === 0) {
          message.info('Chưa có thành viên nào');
        }
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra khi tải danh sách thành viên');
      }
    } catch (error) {
      console.error('Error fetching members:', error);
      message.error(error instanceof Error ? error.message : 'Không thể kết nối đến server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchMembers();
      } catch (error) {
        console.error('Error fetching members:', error);
        message.error('Không thể tải danh sách thành viên');
      }
    };
    
    fetchData();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const baseUrl = `${config.apiUrl}/members/`;
      const url = editingMember 
        ? `${baseUrl}${editingMember.id}`
        : baseUrl;
      
      const method = editingMember ? 'PUT' : 'POST';
      
      const skills = typeof values.skills === 'string' 
        ? values.skills.split(',').map((s: string) => s.trim())
        : values.skills;
      
      const memberData = {
        name: values.name,
        role: values.role,
        avatar: values.avatar.startsWith('/') ? values.avatar : `${values.avatar}`,
        team: values.team.toLowerCase(),
        department: values.department,
        year: values.year || null,
        joinYear: values.joinYear,
        status: values.status,
        skills: skills,
        links: {
          facebook: values.facebook || 'https://facebook.com',
          github: values.github || 'https://github.com',
          email: values.email
        }
      };

      console.log('Sending data:', memberData);
      console.log('Request URL:', url);
      console.log('Request method:', method);

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        mode: 'cors',
        body: JSON.stringify(memberData)
      });

      console.log('Response status:', response.status);

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }

      message.success(data.message || (editingMember ? 'Cập nhật thành công' : 'Thêm thành viên thành công'));
      setModalVisible(false);
      form.resetFields();
      await fetchMembers();

    } catch (error) {
      console.error('Error submitting form:', error);
      message.error(error instanceof Error ? error.message : 'Không thể kết nối đến server');
    }
  };

  const handleDelete = async (id: number) => {
    confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa thành viên này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          setLoading(true);
          const response = await fetch(`${config.apiUrl}/members/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            mode: 'cors'
          });

          const data = await response.json();
          console.log('Delete response:', data);

          if (response.ok) {
            message.success(data.message || 'Xóa thành viên thành công');
            await fetchMembers();
          } else {
            throw new Error(data.message || 'Có lỗi xảy ra khi xóa thành viên');
          }
        } catch (error) {
          console.error('Error deleting member:', error);
          message.error(error instanceof Error ? error.message : 'Không thể kết nối đến server');
        } finally {
          setLoading(false);
        }
      },
      onCancel() {
        console.log('Cancel delete');
      },
    });
  };

  const showEditModal = (member: Member) => {
    setEditingMember(member);
    form.setFieldsValue({
      ...member,
      skills: member.skills.join(', '),
      facebook: member.links.facebook,
      github: member.links.github,
      email: member.links.email
    });
    setModalVisible(true);
  };

  const showAddModal = () => {
    setEditingMember(null);
    form.resetFields();
    setModalVisible(true);
  };

  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('Chỉ có thể upload file JPG/PNG!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;
    
    if (!token) {
      message.error('Bạn cần đăng nhập lại');
      onError({ error: 'No token available' });
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('name', form.getFieldValue('name') || 'member');

    try {
      const response = await fetch(`${config.apiUrl}/members/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Upload failed');
      }

      const data = await response.json();
      onSuccess(data);
      form.setFieldsValue({ avatar: data.data.url });
      setImageUrl(data.data.url);
    } catch (error: any) {
      console.error('Upload error:', error);
      message.error('Không thể upload ảnh: ' + (error.message || 'Unknown error'));
      onError({ error: error.message });
    }
  };

  const handlePinMember = async (id: number) => {
    try {
      setPinLoading(id);
      const response = await fetch(`${config.apiUrl}/members/pin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Ghim thành viên làm leader thành công');
        await fetchMembers();
      } else {
        throw new Error(data.message || 'Không thể ghim thành viên');
      }
    } catch (error) {
      console.error('Error pinning member:', error);
      message.error(error instanceof Error ? error.message : 'Không thể kết nối đến server');
    } finally {
      setPinLoading(null);
    }
  };

  const handleUnpinMember = async (id: number) => {
    try {
      setPinLoading(id);
      const response = await fetch(`${config.apiUrl}/members/unpin/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Bỏ ghim thành viên thành công');
        await fetchMembers();
      } else {
        throw new Error(data.message || 'Không thể bỏ ghim thành viên');
      }
    } catch (error) {
      console.error('Error unpinning member:', error);
      message.error(error instanceof Error ? error.message : 'Không thể kết nối đến server');
    } finally {
      setPinLoading(null);
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string, record: Member) => (
        <Avatar src={getImageUrl(avatar)} alt={record.name} size={40} />
      )
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: 'Phòng ban',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Team',
      dataIndex: 'team',
      key: 'team',
      render: (team: string) => {
        const color = {
          lead: 'red',
          academic: 'green',
          event: 'gold',
          media: 'purple'
        }[team];
        return <Tag color={color}>{team}</Tag>;
      }
    },
    {
      title: 'Năm',
      dataIndex: 'year',
      key: 'year',
    },
    {
      title: 'Năm tham gia',
      dataIndex: 'joinYear',
      key: 'joinYear',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const color = status === 'active' ? 'green' : 'red';
        const text = status === 'active' ? 'Còn hoạt động' : 'Hết hoạt động';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Member) => (
        <div className="space-x-2">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
          {record.isPinned ? (
            <Button 
              type="text" 
              icon={<PushpinFilled style={{ color: '#1890ff' }} />}
              onClick={() => handleUnpinMember(record.id)}
              loading={pinLoading === record.id}
            />
          ) : (
            <Button 
              type="text" 
              icon={<PushpinOutlined />}
              onClick={() => handlePinMember(record.id)}
              loading={pinLoading === record.id}
            />
          )}
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            loading={loading}
          />
        </div>
      )
    }
  ];

  const debouncedSetSearch = useMemo(
    () => debounce((text: string) => {
      setDebouncedSearchText(text);
    }, 300),
    []
  );

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSetSearch(value);
  }, [debouncedSetSearch]);

  useEffect(() => {
    return () => {
      debouncedSetSearch.cancel();
    };
  }, [debouncedSetSearch]);

  const getFilteredMembers = useMemo(() => {
    return otherMembers.filter(member => {
      const matchSearch = member.name.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
                         member.role.toLowerCase().includes(debouncedSearchText.toLowerCase()) ||
                         member.department.toLowerCase().includes(debouncedSearchText.toLowerCase());
      
      const matchTeam = !filterTeam || member.team === filterTeam;
      const matchYear = !filterYear || member.year === filterYear;
      const matchStatus = !filterStatus || member.status === filterStatus;

      return matchSearch && matchTeam && matchYear && matchStatus;
    });
  }, [otherMembers, debouncedSearchText, filterTeam, filterYear, filterStatus]);

  const handleTeamChange = useCallback((value: string) => {
    setFilterTeam(value);
  }, []);

  const handleYearChange = useCallback((value: string) => {
    setFilterYear(value);
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setFilterStatus(value);
  }, []);

  const filterControlsProps = useMemo(() => ({
    searchText,
    filterTeam,
    filterYear,
    filterStatus,
    onSearchChange: handleSearchChange,
    onTeamChange: handleTeamChange,
    onYearChange: handleYearChange,
    onStatusChange: handleStatusChange
  }), [
    searchText, 
    filterTeam, 
    filterYear, 
    filterStatus,
    handleSearchChange, 
    handleTeamChange, 
    handleYearChange,
    handleStatusChange
  ]);

  const handleExport = async (filters: ExportFilters) => {
    try {
      setExportLoading(true);

      const filteredData = members.filter(member => {
        const matchTeam = !filters.team || member.team === filters.team;
        const matchStatus = !filters.status || member.status === filters.status;
        const matchYear = !filters.year || member.year === filters.year;
        const matchJoinYear = !filters.joinYear || member.joinYear === filters.joinYear;
        return matchTeam && matchStatus && matchYear && matchJoinYear;
      });

      const exportData = filteredData.map(member => {
        const row: any = {};
        filters.fields.forEach(field => {
          if (field === 'skills') {
            row[field] = member.skills.join(', ');
          } else if (field === 'facebook' || field === 'github' || field === 'email') {
            row[field] = member.links[field];
          } else {
            row[field] = member[field as keyof Member];
          }
        });
        return row;
      });

      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.json_to_sheet(exportData);

      XLSX.utils.book_append_sheet(wb, ws, 'Members');

      if (filters.fileType === 'csv') {
        const csv = XLSX.utils.sheet_to_csv(ws);
        const data = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        FileSaver.saveAs(data, `DSC_Members_${new Date().toISOString().slice(0,10)}.csv`);
      } else {
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { 
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
        });
        FileSaver.saveAs(data, `DSC_Members_${new Date().toISOString().slice(0,10)}.xlsx`);
      }

      message.success('Xuất file thành công');
      setExportModalVisible(false);
    } catch (error) {
      console.error('Export error:', error);
      message.error('Có lỗi xảy ra khi xuất file');
    } finally {
      setExportLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Leader Card */}
      {pinnedMember && (
        <Card 
          title="Leader hiện tại (đã ghim)"
          className="bg-gradient-to-br from-primary/5 to-primary/10"
          extra={
            <Button 
              icon={<PushpinFilled />}
              onClick={() => handleUnpinMember(pinnedMember.id)}
              loading={pinLoading === pinnedMember.id}
            >
              Bỏ ghim
            </Button>
          }
        >
          <div className="flex items-center gap-6">
            <Avatar src={getImageUrl(pinnedMember.avatar)} size={100} />
            <div>
              <h3 className="text-xl font-semibold">{pinnedMember.name}</h3>
              <p className="text-primary">{pinnedMember.role}</p>
              <p className="text-gray-500">{pinnedMember.department}</p>
              <p className="text-gray-500">Tham gia từ: {pinnedMember.joinYear}</p>
              <div className="mt-2 space-y-2">
                <div>
                  {pinnedMember.skills.map((skill, index) => (
                    <Tag key={index} className="mr-1">{skill}</Tag>
                  ))}
                </div>
                <div>
                  <Tag 
                    color={pinnedMember.status === 'active' ? 'green' : 'red'}
                  >
                    {pinnedMember.status === 'active' ? 'Còn hoạt động' : 'Hết hoạt động'}
                  </Tag>
                </div>
              </div>
            </div>
            <div className="ml-auto">
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => showEditModal(pinnedMember)}
              >
                Chỉnh sửa
              </Button>
            </div>
          </div>
        </Card>
      )}

      <Card
        title="Quản lý thành viên"
        extra={
          <Space>
            <Button 
              icon={<DownloadOutlined />} 
              onClick={() => setExportModalVisible(true)}
            >
              Xuất Excel
            </Button>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={showAddModal}
            >
              Thêm thành viên
            </Button>
          </Space>
        }
      >
        <FilterControls {...filterControlsProps} />
        
        <Table 
          columns={columns} 
          dataSource={getFilteredMembers}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingMember ? 'Chỉnh sửa thành viên' : 'Thêm thành viên mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={form.submit}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            team: 'academic',
            department: 'Học thuật',
            status: 'active',
            skills: [],
            links: {
              facebook: 'https://facebook.com',
              github: 'https://github.com',
              email: ''
            }
          }}
        >
          <Form.Item
            name="name"
            label="Tên thành viên"
            rules={[{ required: true, message: 'Vui lòng nhập tên thành viên' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="Leader HCMUTE Developer Student Club">Leader HCMUTE Developer Student Club</Option>
              <Option value="Leader Ban Học thuật">Leader Ban Học thuật</Option>
              <Option value="Leader Ban Sự kiện">Leader Ban Sự kiện</Option>
              <Option value="Leader Ban Truyền thông">Leader Ban Truyền thông</Option>
              <Option value="Technical Mentor">Technical Mentor</Option>
              <Option value="Technical Mentee">Technical Mentee</Option>
              <Option value="Event Coordinator">Event Coordinator</Option>
              <Option value="Content Creator">Content Creator</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Avatar"
            name="avatar"
            rules={[{ required: true, message: 'Vui lòng upload avatar' }]}
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              customRequest={handleUpload}
              beforeUpload={beforeUpload}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                <div>
                  {loading ? <LoadingOutlined /> : <PlusOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="team"
              label="Team"
              rules={[{ required: true, message: 'Vui lòng chọn team' }]}
            >
              <Select>
                <Option value="lead">Lead Team</Option>
                <Option value="academic">Học thuật</Option>
                <Option value="event">Sự kiện</Option>
                <Option value="media">Truyền thông</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="department"
              label="Phòng ban"
              rules={[{ required: true, message: 'Vui lòng chọn phòng ban' }]}
            >
              <Select>
                <Option value="Lead Team">Lead Team</Option>
                <Option value="Học thuật">Học thuật</Option>
                <Option value="Sự kiện">Sự kiện</Option>
                <Option value="Truyền thông">Truyền thông</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item
            name="year"
            label="Năm"
          >
            <Select allowClear>
              <Option value="2030-2031">2030-2031</Option>
              <Option value="2029-2030">2029-2030</Option>
              <Option value="2028-2029">2028-2029</Option>
              <Option value="2027-2028">2027-2028</Option>
              <Option value="2026-2027">2026-2027</Option>
              <Option value="2025-2026">2025-2026</Option> 
              <Option value="2024-2025">2024-2025</Option>
              <Option value="2023-2024">2023-2024</Option>
              <Option value="2022-2023">2022-2023</Option>
              <Option value="2021-2022">2021-2022</Option>
              <Option value="2020-2021">2020-2021</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="joinYear"
            label="Năm tham gia"
            rules={[{ required: true, message: 'Vui lòng chọn năm tham gia' }]}
          >
            <Select>
              {Array.from({ length: 16 }, (_, i) => {
                const year = new Date().getFullYear() + i;
                return (
                  <Option key={year} value={year.toString()}>
                    {year}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
          >
            <Select>
              <Option value="active">Còn hoạt động</Option>
              <Option value="inactive">Hết hoạt động</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="skills"
            label="Kỹ năng"
            rules={[{ required: true, message: 'Vui lòng nhập các kỹ năng' }]}
            extra="Nhập các kỹ năng, phân cách bằng dấu phẩy"
          >
            <Input.TextArea placeholder="Ví dụ: Leadership, Project Management, Strategic Planning" />
          </Form.Item>

          <Divider>Liên kết</Divider>

          <div className="grid grid-cols-3 gap-4">
            <Form.Item
              name="facebook"
              label="Facebook URL"
              rules={[{ required: true, message: 'Vui lòng nhập URL Facebook' }]}
            >
              <Input placeholder="https://facebook.com/username" />
            </Form.Item>

            <Form.Item
              name="github"
              label="Github URL"
              rules={[{ required: true, message: 'Vui lòng nhập URL Github' }]}
            >
              <Input placeholder="https://github.com/username" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' }
              ]}
            >
              <Input placeholder="example@ute-dsc.edu.vn" />
            </Form.Item>
          </div>
        </Form>
      </Modal>

      <ExportModal
        visible={exportModalVisible}
        onCancel={() => setExportModalVisible(false)}
        onExport={handleExport}
        loading={exportLoading}
        totalMembers={members.length}
      />
    </div>
  );
};

export default MemberManagement; 
