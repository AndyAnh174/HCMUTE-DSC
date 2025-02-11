import { useState, useEffect } from 'react';
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, TimePicker, InputNumber, message, Upload, Checkbox } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import { config } from '../../config/env';
import dayjs from 'dayjs';
import './EventManagement.css';
import { IconBrandFacebook } from '@tabler/icons-react';

const { confirm } = Modal;

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: string;
  image: string;
  organizer: string;
  isHighlight: boolean;
  facebookUrl: string;
}

const EventManagement = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [form] = Form.useForm();
  const { token } = useAuth();
  const [imageUrl, setImageUrl] = useState<string>();
  const [uploading, setUploading] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${config.apiUrl}/events`);
      const result = await response.json();
      
      if (response.ok) {
        setEvents(result.data);
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra khi tải danh sách sự kiện');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
      message.error('Không thể tải danh sách sự kiện');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSubmit = async (values: any) => {
    try {
      console.log('Submitting event with values:', values);
      
      const baseUrl = `${config.apiUrl}/events/`;
      const url = editingEvent ? `${baseUrl}${editingEvent.id}` : baseUrl;
      const method = editingEvent ? 'PUT' : 'POST';

      // Kiểm tra và format thời gian
      if (!Array.isArray(values.time)) {
        throw new Error('Time value must be an array from TimePicker.RangePicker');
      }

      const [startTime, endTime] = values.time;
      if (!startTime || !endTime) {
        throw new Error('Invalid time range selected');
      }

      const formattedTime = `${startTime.format('HH:mm')} - ${endTime.format('HH:mm')}`;
      
      // Format lại dữ liệu trước khi gửi
      const eventData = {
        ...values,
        time: formattedTime,
        date: values.date.format('YYYY-MM-DD'),
        isHighlight: values.isHighlight || false,
        facebookUrl: values.facebookUrl || '',
        status: values.status || 'upcoming'
      };

      // Xóa các trường không cần thiết
      delete eventData.maxParticipants;
      delete eventData.currentParticipants;

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventData)
      });

      const result = await response.json();

      if (response.ok) {
        message.success(
          editingEvent 
            ? 'Cập nhật sự kiện thành công!' 
            : 'Thêm sự kiện mới thành công!'
        );
        setModalVisible(false);
        form.resetFields();
        fetchEvents();
      } else {
        throw new Error(result.message || 'Có lỗi xảy ra');
      }
    } catch (error: any) {
      console.error('Error submitting event:', error);
      message.error('Không thể lưu sự kiện: ' + error.message);
    }
  };

  const handleDelete = (id: number) => {
    confirm({
      title: 'Xác nhận xóa sự kiện',
      content: 'Bạn có chắc chắn muốn xóa sự kiện này không?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      async onOk() {
        try {
          const response = await fetch(`${config.apiUrl}/events/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (!response.ok) {
            throw new Error('Có lỗi xảy ra khi xóa sự kiện');
          }

          message.success('Xóa sự kiện thành công');
          fetchEvents();
        } catch (error) {
          console.error('Error deleting event:', error);
          message.error('Không thể xóa sự kiện');
        }
      }
    });
  };

  const handleEdit = (event: Event) => {
    try {
      console.log('Editing event:', event);
      
      const [startTime, endTime] = event.time.split(' - ');
      console.log('Time split:', { startTime, endTime });

      const formValues = {
        ...event,
        date: dayjs(event.date),
        time: [dayjs(startTime, 'HH:mm'), dayjs(endTime, 'HH:mm')]
      };

      console.log('Setting form values:', formValues);
      
      setEditingEvent(event);
      form.setFieldsValue(formValues);
      setModalVisible(true);
    } catch (error) {
      console.error('Error in handleEdit:', error);
      message.error('Có lỗi khi tải thông tin sự kiện');
    }
  };

  const handleUpload = async (options: any) => {
    const { onSuccess, onError, file } = options;
    const formData = new FormData();
    formData.append('image', file);
    formData.append('title', form.getFieldValue('title') || 'event');

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
        setImageUrl(result.data.url);
        form.setFieldsValue({ image: result.data.url });
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

  const columns = [
    {
      title: 'Tên sự kiện',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: 'Ngày',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Thời gian',
      dataIndex: 'time',
      key: 'time',
    },
    {
      title: 'Địa điểm',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Select value={status} style={{ width: 120 }} disabled>
          <Select.Option value="upcoming">Sắp diễn ra</Select.Option>
          <Select.Option value="ongoing">Đang diễn ra</Select.Option>
          <Select.Option value="past">Đã kết thúc</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, event: Event) => (
        <div className="space-x-2">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(event)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(event.id)}
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
        title="Quản lý sự kiện"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingEvent(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Thêm sự kiện
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={events}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingEvent ? 'Chỉnh sửa sự kiện' : 'Thêm sự kiện mới'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            status: 'upcoming',
            maxParticipants: 100,
            organizer: 'DSC UTE',
            isHighlight: false
          }}
        >
          <Form.Item
            name="title"
            label="Tên sự kiện"
            rules={[{ required: true, message: 'Vui lòng nhập tên sự kiện' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: 'Vui lòng nhập mô tả' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="date"
              label="Ngày"
              rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
            >
              <DatePicker className="w-full" format="YYYY-MM-DD" />
            </Form.Item>

            <Form.Item
              name="time"
              label="Thời gian"
              rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
            >
              <TimePicker.RangePicker className="w-full" format="HH:mm" />
            </Form.Item>
          </div>

          <Form.Item
            name="location"
            label="Địa điểm"
            rules={[{ required: true, message: 'Vui lòng nhập địa điểm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="image"
            label="Ảnh sự kiện"
            rules={[{ required: true, message: 'Vui lòng tải lên ảnh sự kiện' }]}
          >
            <div className="flex items-start space-x-4">
              <Upload
                name="image"
                listType="picture-card"
                showUploadList={false}
                customRequest={handleUpload}
                beforeUpload={(file) => {
                  const isImage = file.type.startsWith('image/');
                  if (!isImage) {
                    message.error('Chỉ có thể tải lên file ảnh!');
                  }
                  return isImage;
                }}
              >
                {imageUrl ? (
                  <img src={imageUrl} alt="event" style={{ width: '100%' }} />
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

          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="organizer"
              label="Ban tổ chức"
              rules={[{ required: true, message: 'Vui lòng nhập ban tổ chức' }]}
            >
              <Input />
            </Form.Item>
          </div>

          <Form.Item
            name="facebookUrl"
            label="Link Facebook"
            rules={[
              { 
                required: false,
                type: 'url',
                message: 'Vui lòng nhập đúng định dạng URL Facebook' 
              }
            ]}
          >
            <Input 
              placeholder="https://facebook.com/events/..." 
              prefix={<IconBrandFacebook className="text-[#1877F2]" />}
            />
          </Form.Item>

          <Form.Item
            name="isHighlight"
            valuePropName="checked"
          >
            <Checkbox>Đánh dấu là sự kiện nổi bật</Checkbox>
          </Form.Item>

          <div className="flex justify-end space-x-4">
            <Button onClick={() => setModalVisible(false)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              {editingEvent ? 'Cập nhật' : 'Thêm mới'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default EventManagement; 