import { Layout, Menu, message } from 'antd';
import { Link, useLocation } from 'react-router-dom';
import { IconDashboard, IconUsers, IconCalendarEvent, IconCode, IconPhoto } from '../utils/icons';
import { useState, useEffect } from 'react';

const { Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const [error, setError] = useState<Error | null>(null);

  // Error boundary
  useEffect(() => {
    const handleError = (error: Error) => {
      console.error('AdminLayout Error:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      setError(error);
      message.error('Có lỗi xảy ra trong giao diện admin');
    };

    window.addEventListener('error', (event) => handleError(event.error));
    return () => window.removeEventListener('error', (event) => handleError(event.error));
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-500 mb-4">
            Có lỗi xảy ra
          </h1>
          <pre className="text-left bg-gray-100 p-4 rounded">
            {error.message}
            {error.stack}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Content className="bg-gray-50">
        {children}
      </Content>
    </Layout>
  );
};

export default AdminLayout; 