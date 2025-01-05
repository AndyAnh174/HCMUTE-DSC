import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { IconBrandGoogle, IconCode, IconTrophy, IconBulb } from '../utils/icons';
import Section, { SectionHeader } from '../components/ui/Section';
import Grid from '../components/ui/Grid';
import Timeline from '../components/ui/Timeline';
import BannerSlider from '../components/BannerSlider';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';


const timelineItems = [
  {
    year: '2020',
    title: 'Thành lập DSC HCM UTE',
    description: 'Câu lạc bộ được thành lập với sứ mệnh phát triển cộng đồng lập trình viên tại trường ĐH SPKT TPHCM.',
    image: '/images/history/founding.jpg',
    achievements: [
      {
        title: 'Thành lập câu lạc bộ',
        description: 'Khởi đầu hành trình với 20 thành viên đầu tiên đầy nhiệt huyết'
      },
      {
        title: 'Workshop đầu tiên',
        description: 'Tổ chức thành công workshop "Web Development with React" với 50 sinh viên tham gia'
      },
      {
        title: 'Xây dựng cộng đồng',
        description: 'Tạo group Facebook và Discord server để kết nối thành viên'
      }
    ]
  },
  {
    year: '2021',
    title: 'Tổ chức các workshop đầu tiên',
    description: 'Chuỗi workshop về Web Development, Mobile App và Cloud Computing với sự tham gia của hơn 200 sinh viên.',
    image: '/images/history/first-workshop.jpg',
    achievements: [
      {
        title: 'Chuỗi workshop thành công',
        description: 'Tổ chức 5 workshop với hơn 200 sinh viên tham gia'
      },
      {
        title: 'Dự án đầu tiên',
        description: 'Hoàn thành dự án website cho câu lạc bộ sinh viên của trường'
      },
      {
        title: 'Phát triển thành viên',
        description: 'Tăng số lượng thành viên lên 100+ với nhiều hoạt động đa dạng'
      }
    ]
  },
  {
    year: '2022',
    title: 'Mở rộng cộng đồng và tổ chức các sự kiện lớn',
    description: 'Tổ chức Hackathon và Tech Conference với sự tham gia của các chuyên gia từ Google và các công ty công nghệ hàng đầu.',
    image: '/images/history/expansion.jpg',
    achievements: [
      {
        title: 'DSC Hackathon 2022',
        description: 'Cuộc thi lập trình với 20 đội tham gia và tổng giải thưởng 20 triệu đồng'
      },
      {
        title: 'Tech Conference',
        description: 'Hội thảo công nghệ với 5 diễn giả từ Google và các công ty hàng đầu'
      },
      {
        title: 'Hợp tác doanh nghiệp',
        description: 'Ký kết hợp tác với 5 công ty công nghệ để tạo cơ hội thực tập cho sinh viên'
      }
    ]
  },
  {
    year: '2023',
    title: 'Phát triển các dự án cộng đồng',
    description: 'Triển khai nhiều dự án thực tế, giúp sinh viên tích lũy kinh nghiệm và đóng góp cho cộng đồng.',
    image: '/images/history/projects.jpg',
    achievements: [
      {
        title: 'Dự án vì cộng đồng',
        description: 'Phát triển 3 dự án phần mềm hỗ trợ các tổ chức phi lợi nhuận'
      },
      {
        title: 'Mentor System',
        description: 'Xây dựng hệ thống mentor-mentee kết nối sinh viên với chuyên gia'
      },
      {
        title: 'Tech Bootcamp',
        description: 'Tổ chức bootcamp 2 tháng đào tạo 50 sinh viên về Full-stack Development'
      }
    ]
  },
  {
    year: '2024',
    title: 'Hướng tới tương lai',
    description: 'Tiếp tục phát triển và mở rộng tầm ảnh hưởng, trở thành một trong những DSC hàng đầu tại Việt Nam.',
    image: '/images/history/future.jpg',
    achievements: [
      {
        title: 'Mở rộng quy mô',
        description: 'Mục tiêu đạt 500+ thành viên và tổ chức 20+ sự kiện trong năm'
      },
      {
        title: 'Hợp tác quốc tế',
        description: 'Kết nối với các DSC trong khu vực Đông Nam Á để tổ chức sự kiện chung'
      },
      {
        title: 'Innovation Hub',
        description: 'Xây dựng không gian sáng tạo và học tập cho sinh viên SPKT'
      }
    ]
  },
  {
    year: '2025',
    title: 'Hướng tới tương lai',
    description: 'Tiếp tục phát triển và mở rộng tầm ảnh hưởng, trở thành một trong những DSC hàng đầu tại Việt Nam.',
    image: '/images/history/future.jpg',
    achievements: [
      {
        title: 'Mở rộng quy mô',
        description: 'Mục tiêu đạt 500+ thành viên và tổ chức 20+ sự kiện trong năm'
      },
      {
        title: 'Hợp tác quốc tế',
        description: 'Kết nối với các DSC trong khu vực Đông Nam Á để tổ chức sự kiện chung'
      },
      {
        title: 'Innovation Hub',
        description: 'Xây dựng không gian sáng tạo và học tập cho sinh viên SPKT'
      }
    ]
  }
];

const features = [
  {
    icon: IconBrandGoogle,
    title: 'Công Nghệ Google',
    description: 'Tiếp cận và học hỏi các công nghệ mới nhất từ Google'
  },
  {
    icon: IconCode,
    title: 'Thực Hành',
    description: 'Xây dựng các dự án thực tế với công nghệ hiện đại'
  },
  {
    icon: IconTrophy,
    title: 'Phát Triển',
    description: 'Nâng cao kỹ năng và kinh nghiệm chuyên môn'
  },
  {
    icon: IconBulb,
    title: 'Sáng Tạo',
    description: 'Khuyến khích tư duy sáng tạo và đổi mới'
  }
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="w-12 h-12 bg-gray-200 animate-pulse rounded" />}>
    {children}
  </Suspense>
);

const bannerImages = [
  banner1,
  banner2,
  banner3,
];

const About = () => {
  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <Section className="bg-gradient-to-b from-primary/5 to-transparent">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Về Google Developer Student Clubs
              <br />
              <span className="text-primary">HCM UTE</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Chúng tôi là một cộng đồng sinh viên đam mê công nghệ, nơi các bạn có thể học hỏi, 
              chia sẻ và phát triển cùng nhau. DSC HCM UTE được thành lập với sứ mệnh tạo ra một 
              môi trường học tập và thực hành lý tưởng cho sinh viên SPKT.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:w-1/2"
          >
            <BannerSlider images={bannerImages} />
          </motion.div>
        </div>
      </Section>

      {/* Features */}
      <Section>
        <SectionHeader
          title="Giá Trị Cốt Lõi"
          subtitle="Những giá trị định hình nên DSC HCM UTE"
        />
        <Grid cols={4} gap={8}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="w-16 h-16 mx-auto mb-6 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                <IconWrapper>
                  <feature.icon size={32} />
                </IconWrapper>
              </div>
              <h3 className="text-xl font-bold mb-4">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </Grid>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionHeader
          title="Lịch Sử Phát Triển"
          subtitle="Hành trình phát triển của DSC HCM UTE qua các năm"
        />
        <Timeline items={timelineItems} className="mt-16" />
      </Section>

      {/* Stats */}
      <Section className="bg-primary/5">
        <Grid cols={4} gap={8}>
          {[
            { number: '500+', label: 'Thành viên' },
            { number: '50+', label: 'Sự kiện đã tổ chức' },
            { number: '20+', label: 'Dự án thực hiện' },
            { number: '10+', label: 'Đối tác' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center p-8 bg-white rounded-xl shadow-lg"
            >
              <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </motion.div>
          ))}
        </Grid>
      </Section>
    </div>
  );
};

export default About; 