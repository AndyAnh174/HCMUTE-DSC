import { useEffect, useState } from 'react';
import { Table, Space, Button, message, Popconfirm, Typography, Tag } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import axiosInstance from '../../utils/axios';
import { ColumnType } from 'antd/es/table';

const { Title } = Typography;

interface Contact {
  id: number;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
}

const ContactManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/contacts');
      const contactData = Array.isArray(response.data) ? response.data : [];
      setContacts(contactData);
    } catch (error: any) {
      console.error('Error fetching contacts:', error);
      message.error('Không thể tải danh sách liên hệ');
      setContacts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await axiosInstance.delete(`/contacts/${id}`);
      if (response.status === 204) {
        message.success('Đã xóa liên hệ thành công');
        fetchContacts();
      }
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      if (error.response?.data?.error) {
        message.error(error.response.data.error);
      } else {
        message.error('Không thể xóa liên hệ');
      }
    }
  };

  // Hàm render tag cho subject
  const renderSubjectTag = (subject: string) => {
    const colorMap: { [key: string]: string } = {
      general: 'blue',
      event: 'green',
      project: 'purple',
      membership: 'orange',
      other: 'default'
    };

    return (
      <Tag color={colorMap[subject] || 'default'}>
        {subject === 'general' && 'Thông tin chung'}
        {subject === 'event' && 'Sự kiện'}
        {subject === 'project' && 'Dự án'}
        {subject === 'membership' && 'Thành viên'}
        {subject === 'other' && 'Khác'}
      </Tag>
    );
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Contact, b: Contact) => a.name.localeCompare(b.name),
      filterSearch: true,
      onFilter: (value: string, record: Contact) => record.name.toLowerCase().includes(value.toLowerCase()),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sorter: (a: Contact, b: Contact) => a.email.localeCompare(b.email),
      render: (text: string) => (
        <a href={`mailto:${text}`} className="text-blue-500 hover:text-blue-700">
          {text}
        </a>
      ),
    },
    {
      title: 'Chủ đề',
      dataIndex: 'subject',
      key: 'subject',
      render: renderSubjectTag,
      filters: [
        { text: 'Thông tin chung', value: 'general' },
        { text: 'Sự kiện', value: 'event' },
        { text: 'Dự án', value: 'project' },
        { text: 'Thành viên', value: 'membership' },
        { text: 'Khác', value: 'other' },
      ],
      onFilter: (value: string, record: Contact) => record.subject === value,
    },
    {
      title: 'Nội dung',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
      width: '30%',
    },
    {
      title: 'Thời gian',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (text: string) => new Date(text).toLocaleString('vi-VN'),
      sorter: (a: Contact, b: Contact) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Contact) => (
        <Space>
          <Popconfirm
            title="Xóa liên hệ này?"
            description="Bạn có chắc muốn xóa liên hệ này không?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button 
              danger
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Title level={3}>Quản lý liên hệ</Title>
        <span className="text-gray-500">
          Tổng số: {contacts.length} liên hệ
        </span>
      </div>
      <Table
        columns={columns as ColumnType<Contact>[]}
        dataSource={contacts}
        rowKey="id"
        loading={loading}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} liên hệ`,
          pageSizeOptions: ['10', '20', '50'],
        }}
        scroll={{ x: true }}
      />
    </div>
  );
};

export default ContactManagement; 