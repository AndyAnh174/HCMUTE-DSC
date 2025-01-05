import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, Tag, message, Avatar, Divider, Upload } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import type { UploadChangeParam } from 'antd/es/upload';
import type { RcFile, UploadFile, UploadProps } from 'antd/es/upload/interface';
import { config } from '../../config/env';

const { confirm } = Modal;

interface Member {
  id: number;
  name: string;
  role: string;
  avatar: string;
  team: string;
  department: string;
  year?: string;
  skills: string[];
  links: {
    facebook: string;
    github: string;
    email: string;
  };
}

const { Option } = Select;

const MemberManagement = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>();

  const currentLeader = members.find(
    member => member.role === 'Leader CLB HCMUTEDSC' && member.year === '2024-2025'
  );

  const otherMembers = members.filter(m => m !== currentLeader);

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
    const { onSuccess, onError, file, onProgress } = options;
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('name', form.getFieldValue('name'));

    try {
      const response = await fetch(`${config.apiUrl}/members/upload-avatar`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();
      
      if (response.ok) {
        onSuccess(data);
        form.setFieldsValue({ avatar: data.data.url });
        setImageUrl(data.data.url);
      } else {
        onError({ error: data.message });
      }
    } catch (error) {
      onError({ error: 'Upload failed.' });
    }
  };

  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'avatar',
      key: 'avatar',
      render: (avatar: string, record: Member) => (
        <Avatar src={avatar} alt={record.name} size={40} />
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
      title: 'Thao tác',
      key: 'actions',
      render: (_: any, record: Member) => (
        <div className="space-x-2">
          <Button 
            type="text" 
            icon={<EditOutlined />}
            onClick={() => showEditModal(record)}
          />
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

  return (
    <div className="space-y-6">
      {/* Leader Card */}
      {currentLeader && (
        <Card 
          title="Leader hiện tại"
          className="bg-gradient-to-br from-primary/5 to-primary/10"
        >
          <div className="flex items-center gap-6">
            <Avatar src={currentLeader.avatar} size={100} />
            <div>
              <h3 className="text-xl font-semibold">{currentLeader.name}</h3>
              <p className="text-primary">{currentLeader.role}</p>
              <p className="text-gray-500">{currentLeader.department}</p>
              <div className="mt-2">
                {currentLeader.skills.map((skill, index) => (
                  <Tag key={index} className="mr-1">{skill}</Tag>
                ))}
              </div>
            </div>
            <div className="ml-auto">
              <Button 
                type="primary" 
                icon={<EditOutlined />}
                onClick={() => showEditModal(currentLeader)}
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
          <Button type="primary" icon={<PlusOutlined />} onClick={showAddModal}>
            Thêm thành viên
          </Button>
        }
      >
        <Table 
          columns={columns} 
          dataSource={otherMembers}
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
              <Option value="Leader CLB HCMUTEDSC">Leader CLB HCMUTEDSC</Option>
              <Option value="Leader Team Học thuật">Leader Team Học thuật</Option>
              <Option value="Leader Team Sự kiện">Leader Team Sự kiện</Option>
              <Option value="Leader Team Truyền thông">Leader Team Truyền thông</Option>
              <Option value="Technical Mentor">Technical Mentor</Option>
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
              <Option value="2024-2025">2024-2025</Option>
              <Option value="2023-2024">2023-2024</Option>
              <Option value="2022-2023">2022-2023</Option>
              <Option value="2021-2022">2021-2022</Option>
              <Option value="2020-2021">2020-2021</Option>
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
    </div>
  );
};

export default MemberManagement; 