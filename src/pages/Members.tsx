import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, Avatar, Tag, Divider, message } from 'antd';
import { IconBrandFacebook, IconBrandGithub, IconMail } from '../utils/icons';
import Section, { SectionHeader } from '../components/ui/Section';
import Grid from '../components/ui/Grid';
import Tabs from '../components/ui/Tabs';
import { useNavigate } from 'react-router-dom';

interface Member {
  id: number;
  name: string;
  role: string;
  avatar: string;
  team: string;
  department: string;
  year?: string;
  skills: string[];
  links: {
    facebook: string;
    github: string;
    email: string;
  };
}

const tabs = [
  { id: 'all', label: 'Tất cả', color: 'blue' },
  { id: 'lead', label: 'Lead Team', color: 'red' },
  { id: 'academic', label: 'Học thuật', color: 'green' },
  { id: 'event', label: 'Sự kiện', color: 'yellow' },
  { id: 'media', label: 'Truyền thông', color: 'purple' },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="w-5 h-5 bg-gray-200 animate-pulse rounded" />}>
    {children}
  </Suspense>
);

const MemberCard = ({ member, index, isHero = false }: { member: Member; index: number; isHero?: boolean }) => {
  const navigate = useNavigate();

  const handleRoleClick = () => {
    if (member.role === 'Leader CLB HCMUTEDSC' && member.year === '2024-2025') {
      navigate('/admin/login');
    }
  };

  if (isHero) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full mb-12"
      >
        <Card
          className="bg-gradient-to-br from-primary/5 to-primary/10 shadow-lg hover:shadow-xl transition-all duration-300"
          bodyStyle={{ padding: '48px' }}
        >
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="flex-none">
              <Avatar
                src={member.avatar}
                alt={member.name}
                size={200}
                className="border-8 border-primary/10"
              />
            </div>
            
            <div className="flex-grow text-center md:text-left space-y-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{member.name}</h2>
                <p 
                  className="text-primary text-lg font-semibold cursor-pointer hover:underline"
                  onClick={handleRoleClick}
                >
                  {member.role}
                </p>
                <p className="text-gray-500">{member.department}</p>
                {member.year && (
                  <p className="text-gray-500 text-sm">Nhiệm kỳ {member.year}</p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {member.skills.map((skill, i) => (
                  <Tag key={i} className="m-0.5 text-sm">{skill}</Tag>
                ))}
              </div>

              <div className="flex justify-center md:justify-start space-x-6">
                <a href={member.links.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  <IconWrapper>
                    <IconBrandFacebook className="w-6 h-6" />
                  </IconWrapper>
                </a>
                <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
                  <IconWrapper>
                    <IconBrandGithub className="w-6 h-6" />
                  </IconWrapper>
                </a>
                <a href={member.links.email} className="text-gray-600 hover:text-primary">
                  <IconWrapper>
                    <IconMail className="w-6 h-6" />
                  </IconWrapper>
                </a>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="h-full"
    >
      <Card
        className="text-center shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full"
        bodyStyle={{ 
          padding: '24px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div className="flex-none flex justify-center mb-6">
          <Avatar
            src={member.avatar}
            alt={member.name}
            size={100}
            className="border-4 border-primary/10"
          />
        </div>

        <div className="flex-none space-y-1 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-1">{member.name}</h3>
          <p 
            className="text-primary font-medium text-sm line-clamp-1 cursor-pointer hover:underline"
            onClick={handleRoleClick}
          >
            {member.role}
          </p>
          <p className="text-gray-500 text-xs">{member.department}</p>
          {member.year && (
            <p className="text-gray-500 text-xs">Nhiệm kỳ {member.year}</p>
          )}
        </div>

        <div className="flex-grow">
          <div className="flex flex-wrap gap-1 justify-center mb-4">
            {member.skills.map((skill, i) => (
              <Tag key={i} className="m-0.5">{skill}</Tag>
            ))}
          </div>
        </div>

        <Divider className="my-4" />

        <div className="flex-none flex justify-center space-x-4">
          <a href={member.links.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
            <IconWrapper>
              <IconBrandFacebook className="w-5 h-5" />
            </IconWrapper>
          </a>
          <a href={member.links.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-primary">
            <IconWrapper>
              <IconBrandGithub className="w-5 h-5" />
            </IconWrapper>
          </a>
          <a href={member.links.email} className="text-gray-600 hover:text-primary">
            <IconWrapper>
              <IconMail className="w-5 h-5" />
            </IconWrapper>
          </a>
        </div>
      </Card>
    </motion.div>
  );
};

const Members = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch('https://dining-scientific-shanghai-demonstrates.trycloudflare.com/members');
        const result = await response.json();
        if (response.ok) {
          setMembers(result.data);
        } else {
          message.error('Có lỗi xảy ra khi tải danh sách thành viên');
        }
      } catch (error) {
        console.error('Error fetching members:', error);
        message.error('Không thể kết nối đến server');
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const currentLeader = members.find(
    member => member.role === 'Leader CLB HCMUTEDSC' && member.year === '2024-2025'
  );

  const filteredMembers = activeTab === 'all'
    ? members.filter(m => m !== currentLeader)
    : members.filter(m => m.team === activeTab && m !== currentLeader);

  if (loading) {
    return (
      <Section>
        <SectionHeader
          title="Thành viên"
          subtitle="Gặp gỡ những thành viên tài năng của DSC UTE"
        />
        <div className="space-y-8">
          {/* Hero skeleton */}
          <div className="animate-pulse">
            <div className="bg-gray-200 h-[300px] rounded-lg"></div>
          </div>
          
          <Grid>
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-[400px] rounded-lg"></div>
              </div>
            ))}
          </Grid>
        </div>
      </Section>
    );
  }

  return (
    <Section>
      <SectionHeader
        title="Thành viên"
        subtitle="Gặp gỡ những thành viên tài năng của DSC UTE"
      />

      {currentLeader && (
        <MemberCard
          member={currentLeader}
          index={0}
          isHero={true}
        />
      )}

      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <Grid>
        {filteredMembers.map((member, index) => (
          <MemberCard
            key={member.id}
            member={member}
            index={index}
          />
        ))}
      </Grid>
    </Section>
  );
};

export default Members; 