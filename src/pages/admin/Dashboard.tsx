import { useState } from 'react';
import { Layout, Menu, Button, Typography } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import MemberManagement from './MemberManagement';
import EventManagement from './EventManagement';
import ProjectManagement from './ProjectManagement';
import ContactManagement from './ContactManagement';
import BannerManagement from './BannerManagement';
import DocumentManagement from './DocumentManagement';
import logoDSC from '../../assets/LogoDSC.png';

import {
  DashboardOutlined,
  TeamOutlined,
  CalendarOutlined,
  ProjectOutlined,
  LogoutOutlined,
  MessageOutlined,
  PictureOutlined,
  FileOutlined
} from '@ant-design/icons';



const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedKey, setSelectedKey] = useState('1');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const menuItems = [
    {
      key: '1',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '2',
      icon: <TeamOutlined />,
      label: 'Quản lý thành viên',
    },
    {
      key: '3',
      icon: <CalendarOutlined />,
      label: 'Quản lý sự kiện',
    },
    {
      key: '4',
      icon: <ProjectOutlined />,
      label: 'Quản lý dự án',
    },
    {
      key: '5',
      icon: <MessageOutlined />,
      label: 'Quản lý liên hệ',
    },
    {
      key: '6',
      icon: <PictureOutlined />,
      label: 'Quản lý banner',
    },
    {
      key: '7',
      icon: <FileOutlined />,
      label: 'Quản lý tài liệu',
    }
  ];



  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return (
          <div className="p-6">
            <Title level={3}>Tổng quan</Title>
          </div>
        );
      case '2':
        return <MemberManagement />;
      case '3':
        return <EventManagement />;
      case '4':
        return <ProjectManagement />;
      case '5':
        return <ContactManagement />;
      case '6':
        return <BannerManagement />;
      case '7':
        return <DocumentManagement />;
      default:
        return null;



    }
  };

  return (
    <Layout className="min-h-screen">
      <Header className="flex items-center justify-between px-6 bg-[#000B3C]">
        <div className="flex items-center">
          <img 
            src={logoDSC} 
            alt="DSC UTE Logo" 
            className="h-16 m-auto mr-4"
          />
          <Title level={4} className="m-0 text-white">
            DSC UTE Admin
          </Title>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-white">
            Xin chào, {user?.username}
          </span>
          <Button 
            type="text"
            className="text-white hover:text-gray-200"
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Đăng xuất
          </Button>
        </div>
      </Header>
      
      <Layout>
        <Sider width={200} className="bg-white">
          <Menu
            mode="inline"
            selectedKeys={[selectedKey]}
            style={{ height: '100%', borderRight: 0 }}
            items={menuItems}
            onClick={({ key }) => setSelectedKey(key)}
          />
        </Sider>
        
        <Layout className="bg-gray-50">
          <Content className="m-6 bg-white rounded-lg min-h-[280px]">
            {renderContent()}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard; 