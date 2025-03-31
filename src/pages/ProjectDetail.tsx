import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Tag, Spin, Progress, Avatar } from 'antd';
import { IconBrandGithub, IconExternalLink } from '../utils/icons';
import Section from '../components/ui/Section';
import { config } from '../config/env';
import { getImageUrl } from '../utils/image';
import Navbar from '../components/Navbar';
import { IconArrowLeft } from '../utils/icons';
import './ProjectDetail.css';

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

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/projects/${id}`);
        const result = await response.json();
        
        if (response.ok) {
          setProject(result.data);
        }
      } catch (error) {
        console.error('Error fetching project:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy dự án</h2>
        <Link to="/projects">
          <Button type="primary">Quay lại trang dự án</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {/* Hero Section */}
      <Section className="pt-24 pb-12 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="container mx-auto px-4"
        >
          {/* Back button */}
          <div className="mb-8">
            <Link to="/projects" onClick={() => window.scrollTo(0, 0)}>
              <Button size="large" className="flex items-center">
                <IconArrowLeft size={20} className="mr-2" />
                Quay lại danh sách dự án
              </Button>
            </Link>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Ảnh dự án */}
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src={getImageUrl(project.image)}
                  alt={project.title}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                />
                <div className="absolute top-4 right-4">
                  <Tag color="blue" className="px-3 py-1 text-sm font-medium rounded-full">
                    {project.category === 'web' ? 'Web App' :
                     project.category === 'mobile' ? 'Mobile App' :
                     'AI/ML'}
                  </Tag>
                </div>
              </div>
            </div>

            {/* Thông tin dự án */}
            <div className="md:w-1/2 space-y-6">
              <div className="space-y-4">
                <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>
                <p className="text-lg text-gray-600">{project.description}</p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Tiến độ dự án</h3>
                    <Progress percent={project.progress} />
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2">Công nghệ sử dụng</h3>
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map(tech => (
                        <Tag key={tech} className="px-3 py-1">
                          {tech}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<IconBrandGithub size={20} />}
                    href={project.links.github}
                    target="_blank"
                    className="h-12"
                  >
                    GitHub Repository
                  </Button>
                  {project.links.demo && (
                    <Button
                      size="large"
                      icon={<IconExternalLink size={20} />}
                      href={project.links.demo}
                      target="_blank"
                      className="h-12"
                    >
                      Live
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Chi tiết dự án */}
      <Section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Chi tiết dự án</h2>
            <div className="prose max-w-none text-gray-700">
              <div 
                dangerouslySetInnerHTML={{ __html: project.details }} 
                className="project-details"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Thành viên */}
      {project.teamMembers && project.teamMembers.length > 0 && (
        <Section className="py-12" gradient="secondary">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="max-w-5xl mx-auto text-center"
            >
              <h2 className="text-2xl font-bold mb-8">Thành viên dự án</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {project.teamMembers.map((member, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-sm">
                    <Avatar 
                      src={getImageUrl(member.avatar)} 
                      size={80}
                      className="mb-3"
                    />
                    <h3 className="font-semibold text-lg">{member.name}</h3>
                    <p className="text-gray-600">{member.role}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </Section>
      )}
    </div>
  );
};

export default ProjectDetail; 