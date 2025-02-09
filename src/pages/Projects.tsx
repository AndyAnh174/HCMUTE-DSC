import { useState, Suspense, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, Tag, Button, Progress, Modal, Spin, Avatar } from 'antd';
import { IconBrandGithub, IconExternalLink, IconUsers } from '../utils/icons';
import Section from '../components/ui/Section';
import Grid from '../components/ui/Grid';
import Tabs from '../components/ui/Tabs';
import { config } from '../config/env';
import { Link } from 'react-router-dom';

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

const Projects = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

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

  const handleProjectClick = (project: Project) => {
    console.log('Project clicked:', project);
    setSelectedProject(project);
    setModalVisible(true);
  };

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
            Dự Án <span className="text-primary">DSC</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Khám phá các dự án thực tế mà chúng tôi đang phát triển tại DSC UTE, 
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
              onClick={() => handleProjectClick(project)}
            >
              <Card
                cover={
                  <div className="relative h-48">
                    <img
                      alt={project.title}
                      src={project.image}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
                      {project.technologies.map(tech => (
                        <Tag
                          key={tech}
                          className="px-3 py-1 text-sm font-medium rounded-full bg-white/80 backdrop-blur-sm"
                        >
                          {tech}
                        </Tag>
                      ))}
                    </div>
                  </div>
                }
                className="h-full flex flex-col shadow-lg hover:shadow-xl transition-all duration-300"
                bodyStyle={{ 
                  flex: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  padding: '24px',
                }}
              >
                <h3 className="text-xl font-semibold mb-4 line-clamp-2 flex-none">
                  {project.title}
                </h3>
                
                <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                  {project.description}
                </p>

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
                        Demo
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

      {/* Project Details Modal */}
      <Modal
        title={selectedProject?.title}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        width={800}
        footer={null}
      >
        {selectedProject && (
          <div className="space-y-6">
            <div className="aspect-video rounded-lg overflow-hidden">
              <img 
                src={selectedProject.image} 
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Mô tả chi tiết</h3>
              <p className="text-gray-600 whitespace-pre-line">
                {selectedProject.details || selectedProject.description}
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Công nghệ sử dụng</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map(tech => (
                  <Tag key={tech} className="px-3 py-1">
                    {tech}
                  </Tag>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Tiến độ dự án</h3>
              <Progress percent={selectedProject.progress} />
            </div>

            {selectedProject.teamMembers && selectedProject.teamMembers.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Thành viên</h3>
                <div className="flex flex-wrap gap-4">
                  {selectedProject.teamMembers.map((member, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Avatar src={member.avatar} />
                      <div>
                        <div className="font-medium">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <Button
                type="primary"
                icon={<IconBrandGithub size={18} />}
                href={selectedProject.links.github}
                target="_blank"
              >
                GitHub Repository
              </Button>
              {selectedProject.links.demo && (
                <Button
                  icon={<IconExternalLink size={18} />}
                  href={selectedProject.links.demo}
                  target="_blank"
                >
                  Live Demo
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Projects; 