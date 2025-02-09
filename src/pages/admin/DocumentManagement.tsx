import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Select, message, Switch, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { config } from '../../config/env';

interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  subCategory: string;
  fileUrl: string;
  fileType: string;
  fileSize: string;
  uploadDate: string;
  downloads: number;
  active: boolean;
}

const { Option } = Select;
const { TextArea } = Input;

const CATEGORIES = [
  {
    label: 'Lập trình',
    value: 'programming',
    children: [
      { label: 'Web Development', value: 'web' },
      { label: 'Mobile Development', value: 'mobile' },
      { label: 'AI/ML', value: 'ai' },
      { label: 'DevOps', value: 'devops' },
      { label: 'Backend', value: 'backend' },
      { label: 'Frontend', value: 'frontend' },
    ]
  },
  {
    label: 'Cơ sở dữ liệu',
    value: 'database',
    children: [
      { label: 'SQL', value: 'sql' },
      { label: 'NoSQL', value: 'nosql' },
      { label: 'Data Modeling', value: 'data-modeling' },
    ]
  },
  {
    label: 'Tài liệu học tập',
    value: 'study',
    children: [
      { label: 'Slide', value: 'slides' },
      { label: 'Bài tập', value: 'exercises' },
      { label: 'Đề thi mẫu', value: 'exam-samples' },
    ]
  },
  {
    label: 'Linux & DevOps',
    value: 'linux-devops',
    children: [
      { label: 'Hệ điều hành Linux', value: 'linux-os' },
      { label: 'Shell Script', value: 'shell-script' },
      { label: 'Command Line', value: 'command-line' },
      { label: 'System Administration', value: 'system-admin' },
      { label: 'Network Administration', value: 'network-admin' },
      { label: 'Security', value: 'security' },
    ]
  },
  {
    label: 'Container & Orchestration',
    value: 'container',
    children: [
      { label: 'Docker', value: 'docker' },
      { label: 'Kubernetes', value: 'kubernetes' },
      { label: 'Docker Compose', value: 'docker-compose' },
      { label: 'Container Security', value: 'container-security' },
    ]
  },
  {
    label: 'CI/CD & Version Control',
    value: 'cicd-vcs',
    children: [
      { label: 'Git', value: 'git' },
      { label: 'GitHub', value: 'github' },
      { label: 'GitLab CI/CD', value: 'gitlab-cicd' },
      { label: 'Jenkins', value: 'jenkins' },
      { label: 'GitHub Actions', value: 'github-actions' },
    ]
  },
];

const DocumentManagement = () => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingDocument, setEditingDocument] = useState<Document | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [subCategories, setSubCategories] = useState<{label: string, value: string}[]>([]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/api/documents`, {
        headers: {
          'Referer': '/admin/document-management'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setDocuments(data.data || []);
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      message.error('Không thể tải danh sách tài liệu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'file') {
          formData.append(key, values[key]);
        }
      });

      if (fileList[0]?.originFileObj) {
        formData.append('file', fileList[0].originFileObj);
      }

      const url = editingDocument 
        ? `${config.apiUrl}/api/documents/${editingDocument.id}`
        : `${config.apiUrl}/api/documents`;

      const response = await fetch(url, {
        method: editingDocument ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Referer': '/admin/document-management'
        },
        body: formData
      });

      if (response.ok) {
        message.success(editingDocument ? 'Cập nhật thành công' : 'Thêm mới thành công');
        setModalVisible(false);
        form.resetFields();
        setFileList([]);
        fetchDocuments();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${config.apiUrl}/api/documents/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Referer': '/admin/document-management'
        }
      });

      if (response.ok) {
        message.success('Xóa tài liệu thành công');
        fetchDocuments();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const handleCategoryChange = (value: string) => {
    const category = CATEGORIES.find(c => c.value === value);
    setSelectedCategory(value);
    setSubCategories(category?.children || []);
    form.setFieldsValue({ subCategory: undefined });
  };

  const handleStatusChange = async (checked: boolean, document: Document) => {
    try {
      const formData = new FormData();
      Object.keys(document).forEach(key => {
        if (key !== 'file') {
          if (key === 'active') {
            formData.append(key, String(checked));
          } else {
            formData.append(key, String((document as any)[key]));
          }
        }
      });

      const response = await fetch(`${config.apiUrl}/api/documents/${document.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Referer': '/admin/document-management'
        },
        body: formData
      });

      if (response.ok) {
        message.success('Cập nhật trạng thái thành công');
        setDocuments(prev => 
          prev.map(doc => 
            doc.id === document.id 
              ? { ...doc, active: checked }
              : doc
          )
        );
      } else {
        throw new Error('Không thể cập nhật trạng thái');
      }
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const columns = [
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (text: string) => {
        const category = CATEGORIES.find(c => c.value === text);
        return category?.label || text;
      }
    },
    {
      title: 'Danh mục con',
      dataIndex: 'subCategory',
      key: 'subCategory',
      render: (text: string, record: Document) => {
        const category = CATEGORIES.find(c => c.value === record.category);
        const subCategory = category?.children?.find(s => s.value === text);
        return subCategory?.label || text;
      }
    },
    {
      title: 'Loại file',
      dataIndex: 'fileType',
      key: 'fileType',
      render: (text: string) => <Tag color="blue">{text}</Tag>
    },
    {
      title: 'Kích thước',
      dataIndex: 'fileSize',
      key: 'fileSize',
    },
    {
      title: 'Lượt tải',
      dataIndex: 'downloads',
      key: 'downloads',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean, record: Document) => (
        <Switch 
          checked={active}
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Document) => (
        <div className="space-x-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingDocument(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
          >
            Sửa
          </Button>
          <Button
            type="default"
            icon={<DownloadOutlined />}
            onClick={() => window.open(`${config.apiUrl}${record.fileUrl}`, '_blank')}
          >
            Tải xuống
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Tài liệu</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDocument(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm Tài liệu
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={documents}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingDocument ? 'Sửa Tài liệu' : 'Thêm Tài liệu mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <TextArea rows={4} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select
              placeholder="Chọn danh mục"
              onChange={handleCategoryChange}
            >
              {CATEGORIES.map(category => (
                <Option key={category.value} value={category.value}>
                  {category.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="subCategory"
            label="Danh mục con"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục con' }]}
          >
            <Select
              placeholder="Chọn danh mục con"
              disabled={!selectedCategory}
            >
              {subCategories.map(sub => (
                <Option key={sub.value} value={sub.value}>
                  {sub.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="file"
            label="File tài liệu"
            rules={[{ required: !editingDocument, message: 'Vui lòng chọn file' }]}
          >
            <Upload
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="active"
            label="Trạng thái"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingDocument ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default DocumentManagement; 