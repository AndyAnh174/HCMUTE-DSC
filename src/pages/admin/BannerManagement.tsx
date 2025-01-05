import { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Input, Upload, Switch, message, Spin } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface';
import type { RcFile, UploadProps } from 'antd/es/upload';
import { useAuth } from '../../hooks/useAuth';
import { config } from '../../config/env';

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
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const { user } = useAuth();

  const fetchBanners = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/banners`);
      const result = await response.json();
      if (response.ok) {
        setBanners(result.data);
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

  const handleAdd = () => {
    setEditingBanner(null);
    setFileList([]);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (record: Banner) => {
    setEditingBanner(record);
    form.setFieldsValue(record);
    setFileList([]);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`${config.apiUrl}/banners/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể xóa banner');
      }

      message.success('Xóa banner thành công');
      fetchBanners();
    } catch (error: any) {
      console.error('Error:', error);
      message.error(error.message || 'Có lỗi xảy ra khi xóa banner');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const formData = new FormData();
      formData.append('title', values.title);
      formData.append('description', values.description);
      formData.append('order', values.order.toString());
      formData.append('active', values.active.toString());

      if (fileList[0]?.originFileObj) {
        formData.append('image', fileList[0].originFileObj);
      }

      const url = editingBanner 
        ? `${config.apiUrl}/banners/${editingBanner.id}`
        : `${config.apiUrl}/banners`;

      const response = await fetch(url, {
        method: editingBanner ? 'PUT' : 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Không thể lưu banner');
      }

      const data = await response.json();
      message.success(`${editingBanner ? 'Cập nhật' : 'Thêm'} banner thành công`);
      setModalVisible(false);
      fetchBanners();

    } catch (error: any) {
      console.error('Error:', error);
      message.error(error.message || 'Có lỗi xảy ra khi lưu banner');
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={`${config.apiUrl}${image}`} alt="Banner" style={{ width: 100 }} />
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
      sorter: (a: Banner, b: Banner) => a.order - b.order,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'active',
      key: 'active',
      render: (active: boolean) => (
        <Switch checked={active} disabled />
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Banner) => (
        <div className="space-x-2">
          <Button 
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
      )
    }
  ];

  const uploadProps: UploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ có thể tải lên file ảnh!');
        return false;
      }
      return false;
    },
    onChange: ({ fileList }) => setFileList(fileList),
    maxCount: 1
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Quản lý Banner</h1>
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm Banner
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center p-8">
          <Spin size="large" />
        </div>
      ) : (
        <Table 
          columns={columns} 
          dataSource={banners}
          rowKey="id"
        />
      )}

      <Modal
        title={`${editingBanner ? 'Sửa' : 'Thêm'} Banner`}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{ active: true }}
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
            label="Hình ảnh"
          >
            <Upload
              {...uploadProps}
              fileList={fileList}
              listType="picture-card"
            >
              {fileList.length === 0 && (
                <div>
                  <UploadOutlined />
                  <div className="mt-2">Tải ảnh lên</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item className="mb-0 text-right">
            <Button onClick={() => setModalVisible(false)} className="mr-2">
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingBanner ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement; 