import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, InputNumber, Upload, message, Progress } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { config } from '../../config/env';

interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  progress: number;
  teamSize: number;
  technologies: string[];
  links: {
    github: string;
    demo?: string;
  };
  details: string;
  teamMembers: Array<{
    name: string;
    role: string;
    avatar: string;
  }>;
}

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/projects`);
      const result = await response.json();
      
      if (response.ok) {
        setProjects(result.data);
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra khi tải danh sách dự án');
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      message.error('Không thể tải danh sách dự án');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setImageUrl(undefined);
    setEditingProject(null);
    setModalVisible(true);
  };

  const handleEdit = (project: Project) => {
    try {
      console.log('Editing project:', project);
      setEditingProject(project);
      setImageUrl(project.image);

      const formValues = {
        ...project,
        technologies: project.technologies.join(', '),
        github: project.links.github,
        demo: project.links.demo,
        teamMembers: project.teamMembers || []
      };

      console.log('Setting form values:', formValues);
      form.setFieldsValue(formValues);
      setModalVisible(true);
    } catch (error) {
      const err = error as Error;
      console.error('Error in handleEdit:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      message.error('Lỗi khi chỉnh sửa: ' + err.message);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      console.log('Deleting project with ID:', id);
      console.log('Auth token:', token);

      const response = await fetch(`${config.apiUrl}/projects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      console.log('Delete response status:', response.status);

      if (response.ok) {
        message.success('Xóa dự án thành công');
        fetchProjects();
      } else {
        const result = await response.json();
        console.error('Delete error response:', result);
        throw new Error(result.message || 'Có lỗi xảy ra khi xóa dự án');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting project:', {
        error: err,
        message: err.message,
        stack: err.stack
      });
      message.error('Không thể xóa dự án: ' + err.message);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Submitting project with values:', values);

      const projectData = {
        title: values.title,
        description: values.description,
        details: values.details,
        category: values.category,
        image: imageUrl,
        progress: values.progress,
        teamSize: values.teamSize,
        technologies: values.technologies.split(',').map((t: string) => t.trim()),
        links: {
          github: values.github,
          demo: values.demo || ''
        },
        teamMembers: (values.teamMembers || []).map((member: { name: string; role: string; avatar: string; }) => ({
          name: member.name,
          role: member.role,
          avatar: member.avatar
        }))
      };

      console.log('Processed project data:', projectData);

      const url = editingProject 
        ? `${config.apiUrl}/projects/${editingProject.id}`
        : `${config.apiUrl}/projects`;
      
      console.log('Request URL:', url);
      console.log('Request method:', editingProject ? 'PUT' : 'POST');
      console.log('Auth token:', token);

      const response = await fetch(url, {
        method: editingProject ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(projectData)
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response data:', result);

      if (response.ok) {
        message.success(editingProject ? 'Cập nhật dự án thành công' : 'Thêm dự án mới thành công');
        setModalVisible(false);
        fetchProjects();
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      console.error('Error submitting project:', {
        error,
        message: error instanceof Error ? error.message : 'Có lỗi xảy ra',
        stack: error instanceof Error ? error.stack : undefined
      });
      message.error('Không thể lưu dự án: ' + (error instanceof Error ? error.message : 'Có lỗi xảy ra'));
    }
  };

  const handleUploadProjectImage = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', form.getFieldValue('title') || 'project');

    try {
      setUploading(true);
      const response = await fetch(`${config.apiUrl}/events/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        const fullImageUrl = result.data.url;
        setImageUrl(fullImageUrl);
        form.setFieldsValue({ image: fullImageUrl });
        onSuccess(result, file);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Upload ảnh thất bại');
      onError(error);
    } finally {
      setUploading(false);
    }
  };

  const handleUploadMemberAvatar = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', 'member-avatar');

    try {
      const response = await fetch(`${config.apiUrl}/events/upload-image`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const result = await response.json();

      if (response.ok) {
        onSuccess(result, file);
        return result.data.url;
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Error uploading file:', error);
      message.error('Upload ảnh thất bại');
      onError(error);
    }
  };

  const columns = [
    {
      title: 'Tên dự án',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category',
      key: 'category',
      render: (category: string) => ({
        web: 'Web App',
        mobile: 'Mobile App',
        ai: 'AI/ML'
      }[category] || category)
    },
    {
      title: 'Tiến độ',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress: number) => (
        <Progress percent={progress} size="small" />
      )
    },
    {
      title: 'Số thành viên',
      dataIndex: 'teamSize',
      key: 'teamSize',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Project) => (
        <div className="space-x-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
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
      <Card
        title="Quản lý dự án"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm dự án
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={projects}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingProject ? 'Sửa dự án' : 'Thêm dự án mới'}
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
            label="Tên dự án"
            rules={[{ required: true, message: 'Vui lòng nhập tên dự án' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả ngắn"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="details"
            label="Chi tiết dự án"
            rules={[{ required: true, message: 'Vui lòng nhập chi tiết dự án' }]}
          >
            <Input.TextArea rows={5} />
          </Form.Item>

          <Form.Item
            name="category"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select>
              <Select.Option value="web">Web App</Select.Option>
              <Select.Option value="mobile">Mobile App</Select.Option>
              <Select.Option value="ai">AI/ML</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh dự án"
            rules={[{ required: true, message: 'Vui lòng tải lên ảnh dự án' }]}
          >
            <div className="flex items-start space-x-4">
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                customRequest={handleUploadProjectImage}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Chỉ có thể tải lên file ảnh!');
                  }
                  return isImage;
                }}
              >
                {imageUrl ? (
                  <img 
                    src={imageUrl.startsWith('http') ? imageUrl : `${config.apiUrl}${imageUrl}`} 
                    alt="project" 
                    style={{ width: '100%' }} 
                  />
                ) : (
                  <div>
                    {uploading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
                  </div>
                )}
              </Upload>
              <Input 
                value={imageUrl} 
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  form.setFieldsValue({ image: e.target.value });
                }}
                placeholder="Hoặc nhập URL ảnh"
                style={{ width: '100%' }}
              />
            </div>
          </Form.Item>

          <Form.Item
            name="technologies"
            label="Công nghệ sử dụng"
            rules={[{ required: true, message: 'Vui lòng nhập các công nghệ sử dụng' }]}
            help="Nhập các công nghệ, phân cách bằng dấu phẩy"
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="progress"
              label="Tiến độ (%)"
              rules={[{ required: true, message: 'Vui lòng nhập tiến độ' }]}
            >
              <InputNumber min={0} max={100} className="w-full" />
            </Form.Item>

            <Form.Item
              name="teamSize"
              label="Số thành viên"
              rules={[{ required: true, message: 'Vui lòng nhập số thành viên' }]}
            >
              <InputNumber min={1} className="w-full" />
            </Form.Item>
          </div>

          <Form.Item
            name="github"
            label="GitHub Repository"
            rules={[{ required: true, message: 'Vui lòng nhập link GitHub' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="demo"
            label="Demo URL"
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="teamMembers"
            label="Thành viên dự án"
            rules={[{ required: true, message: 'Vui lòng thêm ít nhất một thành viên' }]}
          >
            <Form.List name="teamMembers">
              {(fields, { add, remove }) => (
                <div className="space-y-4">
                  {fields.map(({ key, name, ...restField }, index) => (
                    <div key={key} className="flex items-start gap-4">
                      <Form.Item
                        {...restField}
                        name={[name, 'name']}
                        rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
                        className="flex-1 mb-0"
                      >
                        <Input placeholder="Tên thành viên" />
                      </Form.Item>
                      
                      <Form.Item
                        {...restField}
                        name={[name, 'role']}
                        rules={[{ required: true, message: 'Vui lòng nhập vai trò' }]}
                        className="flex-1 mb-0"
                      >
                        <Input placeholder="Vai trò" />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'avatar']}
                        rules={[{ required: true, message: 'Vui lòng tải lên ảnh đại diện' }]}
                        className="flex-1 mb-0"
                      >
                        <Upload
                          name="image"
                          listType="picture-card"
                          showUploadList={false}
                          customRequest={async (options) => {
                            const url = await handleUploadMemberAvatar(options);
                            const teamMembers = form.getFieldValue('teamMembers');
                            teamMembers[index].avatar = url;
                            form.setFieldsValue({ teamMembers });
                          }}
                          beforeUpload={(file) => {
                            const isImage = file.type.startsWith('image/');
                            if (!isImage) {
                              message.error('Chỉ có thể tải lên file ảnh!');
                            }
                            return isImage;
                          }}
                        >
                          {form.getFieldValue(['teamMembers', index, 'avatar']) ? (
                            <img 
                              src={form.getFieldValue(['teamMembers', index, 'avatar'])} 
                              alt="avatar" 
                              style={{ width: '100%' }} 
                            />
                          ) : (
                            <div>
                              <PlusOutlined />
                              <div style={{ marginTop: 8 }}>Tải ảnh</div>
                            </div>
                          )}
                        </Upload>
                      </Form.Item>

                      <MinusCircleOutlined 
                        onClick={() => remove(name)} 
                        className="mt-2 text-red-500 cursor-pointer"
                      />
                    </div>
                  ))}
                  
                  <Button 
                    type="dashed" 
                    onClick={() => add()} 
                    block 
                    icon={<PlusOutlined />}
                  >
                    Thêm thành viên
                  </Button>
                </div>
              )}
            </Form.List>
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingProject ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ProjectManagement;