import { Layout, message } from 'antd';
import { useState, useEffect } from 'react';

const { Content } = Layout;

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
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

    const errorHandler = (event: ErrorEvent) => handleError(event.error);
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
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
            {error.stack && <div className="mt-2">{error.stack}</div>}
          </pre>
        </div>
      </div>
    );
  }

  return (
    <Layout className="min-h-screen">
      <Content className="bg-gray-50 p-6">
        {children}
      </Content>
    </Layout>
  );
};

export default AdminLayout;