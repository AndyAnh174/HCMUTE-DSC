import { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Button, Progress, Spin } from 'antd';
import { IconBrandGithub, IconExternalLink, IconUsers } from '../utils/icons';
import Section from '../components/ui/Section';
import Grid from '../components/ui/Grid';
import Tabs from '../components/ui/Tabs';
import { config } from '../config/env';
import { Link } from 'react-router-dom';
import './Projects.css';

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

const tabs = [
  { id: 'all', label: 'Tất cả', color: 'blue' },
  { id: 'web', label: 'Web App', color: 'green' },
  { id: 'mobile', label: 'Mobile App', color: 'yellow' },
  { id: 'ai', label: 'AI/ML', color: 'red' },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="w-5 h-5 bg-gray-200 animate-pulse rounded" />}>
    {children}
  </Suspense>
);

const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) {
    return path;
  }
  return `${config.apiUrl}${path}`;
};

// Hàm để cắt HTML an toàn
const truncateHtml = (html: string, maxLength: number): string => {
  if (!html) return '';
  
  // Tạo một div tạm để phân tích chuỗi HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  
  // Lấy văn bản thuần túy
  const textContent = tempDiv.textContent || tempDiv.innerText || '';
  
  if (textContent.length <= maxLength) {
    return html;
  }
  
  // Nếu cần cắt, giữ nguyên HTML gốc và thêm '...' vào cuối
  return html + '...';
};

const Projects = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('Fetching projects...');
        const response = await fetch(`${config.apiUrl}/projects`);
        console.log('Response status:', response.status);
        
        const result = await response.json();
        console.log('API Response:', result);
        
        if (response.ok) {
          console.log('Setting projects:', result.data);
          setProjects(result.data);
        } else {
          throw new Error(result.message || 'Có lỗi xảy ra khi tải danh sách dự án');
        }
      } catch (error) {
        console.error('Error fetching projects:', {
          error,
          message: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const filteredProjects = projects.filter(
    project => activeTab === 'all' || project.category === activeTab
  );

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  // No projects state
  if (!loading && (!projects || projects.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Chưa có dự án nào.
      </div>
    );
  }

  console.log('Rendering projects:', {
    activeTab,
    totalProjects: projects.length,
    filteredProjects: filteredProjects.length
  });

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section 
        className="pt-24 pb-12"
        gradient="primary"
        pattern="dots"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Dự Án
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá các dự án mà chúng tôi đang phát triển mạnh tại <span className="text-primary">HCMUTE Developer Student Club</span>, 
            nơi ứng dụng công nghệ để giải quyết các vấn đề thực tiễn.
          </p>
        </motion.div>
      </Section>

      {/* Projects List Section */}
      <Section className="py-12">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="justify-center mb-12"
        />

        <Grid cols={3} gap={8}>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full cursor-pointer"
            >
              <Card
                cover={
                  <Link to={`/projects/${project.id}`}>
                    <img
                      alt={project.title}
                      src={getImageUrl(project.image)}
                      className="h-48 w-full object-cover"
                    />
                  </Link>
                }
                className="h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300"
                bodyStyle={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '24px',
                }}
              >
                <Link to={`/projects/${project.id}`}>
                  <Card.Meta
                    title={project.title}
                    description={
                      <div 
                        className="project-description-preview" 
                        dangerouslySetInnerHTML={{ __html: truncateHtml(project.description, 150) }}
                      />
                    }
                  />
                </Link>
                
                <div className="space-y-4 flex-none">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Tiến độ</span>
                    <span>{project.progress}%</span>
                  </div>
                  <Progress percent={project.progress} size="small" />
                  
                  <div className="flex items-center gap-2 text-gray-600">
                    <IconWrapper>
                      <IconUsers size={18} className="text-primary" />
                    </IconWrapper>
                    <span className="text-sm">{project.teamSize} thành viên</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      type="primary"
                      icon={
                        <IconWrapper>
                          <IconBrandGithub size={18} />
                        </IconWrapper>
                      }
                      href={project.links.github}
                      target="_blank"
                      className="flex-1 h-10 flex items-center justify-center"
                    >
                      GitHub
                    </Button>
                    {project.links.demo && (
                      <Button
                        icon={
                          <IconWrapper>
                            <IconExternalLink size={18} />
                          </IconWrapper>
                        }
                        href={project.links.demo}
                        target="_blank"
                        className="flex-1 h-10 flex items-center justify-center"
                      >
                        Live
                      </Button>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </Grid>
      </Section>

      {/* CTA Section */}
      <Section 
        className="py-20"
        gradient="secondary"
        pattern="grid"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bạn có ý tưởng dự án?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Hãy chia sẻ ý tưởng của bạn với chúng tôi. Chúng tôi sẽ hỗ trợ bạn 
            biến ý tưởng thành hiện thực.
          </p>
          <Button type="primary" size="large">
            <Link to="/contact#top" onClick={() => window.scrollTo(0, 0)}>Đề xuất dự án</Link>  
          </Button>
        </motion.div>
      </Section>
    </div>
  );
};

export default Projects; 