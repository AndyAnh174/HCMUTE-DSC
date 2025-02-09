import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, message, Switch } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { config } from '../../config/env';
import { getImageUrl } from '../../utils/image';

interface Banner {
  id: number;
  title: string;
  description: string;
  image: string;
  order: number;
  active: boolean;
  created_at: string;
}

const BannerManagement = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [fileList, setFileList] = useState<any[]>([]);

  const fetchBanners = async () => {
    try {
      const response = await fetch(`${config.apiUrl}/banners`, {
        headers: {
          'Referer': '/admin/banner-management'
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBanners(data.data || []);
      } else {
        throw new Error(data.message || 'Có lỗi xảy ra');
      }
    } catch (error) {
      message.error('Không thể tải danh sách banner');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach(key => {
        if (key !== 'image') {
          formData.append(key, values[key]);
        }
      });

      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      const url = editingBanner 
        ? `${config.apiUrl}/banners/${editingBanner.id}`
        : `${config.apiUrl}/banners`;

      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        message.success(editingBanner ? 'Cập nhật thành công' : 'Thêm mới thành công');
        setModalVisible(false);
        form.resetFields();
        setFileList([]);
        fetchBanners();
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
      const response = await fetch(`${config.apiUrl}/banners/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        message.success('Xóa banner thành công');
        fetchBanners();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const handleStatusChange = async (checked: boolean, banner: Banner) => {
    try {
      const formData = new FormData();
      formData.append('title', banner.title);
      formData.append('description', banner.description || '');
      formData.append('order', String(banner.order));
      formData.append('active', String(checked));
      formData.append('created_at', banner.created_at);

      const response = await fetch(`${config.apiUrl}/banners/${banner.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Referer': '/admin/banner-management'
        },
        body: formData
      });

      if (response.ok) {
        message.success('Cập nhật trạng thái thành công');
        fetchBanners();
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      message.error('Lỗi: ' + error.message);
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={getImageUrl(image)} alt="banner" style={{ width: 100 }} />
      )
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Thứ tự',
      dataIndex: 'order',
      key: 'order',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean, record: Banner) => (
        <Switch 
          checked={active} 
          onChange={(checked) => handleStatusChange(checked, record)}
        />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Banner) => (
        <div className="space-x-2">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingBanner(record);
              form.setFieldsValue(record);
              setModalVisible(true);
            }}
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
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Quản lý Banner</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingBanner(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Thêm Banner
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={banners}
        rowKey="id"
        loading={loading}
      />

      <Modal
        title={editingBanner ? 'Sửa Banner' : 'Thêm Banner mới'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
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
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="order"
            label="Thứ tự"
            rules={[{ required: true, message: 'Vui lòng nhập thứ tự' }]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            name="active"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[{ required: !editingBanner, message: 'Vui lòng chọn hình ảnh' }]}
          >
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
              maxCount={1}
            >
              {fileList.length === 0 && <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>}
            </Upload>
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingBanner ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement; 