import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Projects from './pages/Projects';
import Members from './pages/Members';
import Contact from './pages/Contact';
import Login from './pages/Login';
import { AuthProvider } from './hooks/useAuth.tsx';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './pages/admin/Dashboard';
import ProjectManagement from './pages/admin/ProjectManagement';
import Documents from './pages/Documents';
import DocumentManagement from './pages/admin/DocumentManagement';
import EventDetail from './pages/EventDetail';


function App() {
  return (
    <div className="min-h-screen bg-white">
      <AuthProvider>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#4285F4',
              colorSuccess: '#34A853',
              colorWarning: '#FBBC05',
              colorError: '#EA4335',
              borderRadius: 8,
            },
          }}
        >
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<MainLayout><Home /></MainLayout>} />
              <Route path="/about" element={<MainLayout><About /></MainLayout>} />
              <Route path="/events" element={<MainLayout><Events /></MainLayout>} />
              <Route path="/events/:id" element={<EventDetail />} />
              <Route path="/projects" element={<MainLayout><Projects /></MainLayout>} />
              <Route path="/members" element={<MainLayout><Members /></MainLayout>} />
              <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
              <Route path="/documents" element={<MainLayout><Documents /></MainLayout>} />
              
              {/* Auth Routes */}
              <Route path="/admin/login" element={<Login />} />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout>
                      <AdminDashboard />
                    </AdminLayout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/admin/projects" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout>
                      <ProjectManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/admin/documents" 
                element={
                  <ProtectedRoute requireAdmin>
                    <AdminLayout>
                      <DocumentManagement />
                    </AdminLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Router>
        </ConfigProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
