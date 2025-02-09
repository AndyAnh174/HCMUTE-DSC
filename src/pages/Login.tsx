import { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.tsx';
import bannerDSC from '../assets/banner1.png';
const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const onFinish = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',

        },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (response.ok) {
        const { access_token, refresh_token, user } = data.data;
        // Sử dụng hook useAuth để lưu thông tin đăng nhập
        login(access_token, refresh_token, user);
        message.success(data.message || 'Đăng nhập thành công!');
        navigate('/admin/dashboard');
      } else {
        message.error(data.message || 'Đăng nhập thất bại!');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Có lỗi xảy ra, vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <img 
            src={bannerDSC} 
            alt="DSC UTE banner" 
            className="h-auto mx-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-gray-800">
            Đăng nhập Admin
          </h1>
          <p className="text-gray-600">
            Developer Student Club HCMUTE
          </p>
        </div>

        <Card className="shadow-lg">
          <Form
            name="login"
            onFinish={onFinish}
            layout="vertical"
            size="large"
          >
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập!' }]}
            >
              <Input 
                prefix={<UserOutlined />} 
                placeholder="Tên đăng nhập"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Mật khẩu"
              />
            </Form.Item>

            <Form.Item>
              <Button 
                type="primary" 
                htmlType="submit" 
                block 
                loading={loading}
              >
                Đăng nhập
              </Button>
            </Form.Item>
          </Form>
        </Card>

        <p className="text-center mt-4 text-gray-600">
          © {new Date().getFullYear()} DSC UTE. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Login; 
