import { Suspense } from 'react';
import { motion } from 'framer-motion';
import { IconDeviceLaptop, IconCode, IconTrophy, IconBulb } from '../utils/icons';
import Section, { SectionHeader } from '../components/ui/Section';
import Grid from '../components/ui/Grid';
import Timeline from '../components/ui/Timeline';
import BannerSlider from '../components/BannerSlider';
import useCountUp from '../hooks/useCountUp';
import banner1 from '../assets/banner1.png';
import banner2 from '../assets/banner2.png';
import banner3 from '../assets/banner3.png';
import banner4 from '../assets/banner4.png';
import OpenGDSC from '../assets/timeline/Open-GDSC.jpg';
import GoogleCloud from '../assets/timeline/Google-Cloud.jpg';
import ECom from '../assets/timeline/E-Com.jpg';
import OpenDay from '../assets/timeline/OpenDay.jpg';
import HCMUTEDSC from '../assets/timeline/DSC.jpg'

const timelineItems = [
  {
    year: '2020',
    title: 'Thành lập HCMUTE - Google Developer Student Clubs',
    description: 'Câu lạc bộ được thành lập với sứ mệnh phát triển cộng đồng lập trình viên tại trường ĐH SPKT TPHCM.',
    image: OpenGDSC,
    achievements: [
      {
        title: 'Google Resource',
        description: 'Truy cập vài các tài nguyên dành cho dành phát triển của Google.'
      },
      {
        title: 'Technology',
        description: 'Chia sẻ, học hỏi những kiến thức về Công nghệ mới.'
      },
      {
        title: 'Learning By Making',
        description: 'Xây dựng các sản phẩm công nghệ giải quyết những bài toán thực tiễn.'
      },
      {
        title: 'Multi-Culture',
        description: 'Hướng tới các thành viên đến từ các ngành học và các khóa khác nhau.'
      }
    ]
  },
  {
    year: '2021',
    title: 'Câu lạc bộ bắt đầu đi vào hoạt động',
    description: 'Bắt đầu tuyển thành viên và tổ chức các sự kiện đầu tiên.',
    image: GoogleCloud,
    achievements: [
      {
        title: 'Tuyển Thành viên GEN 1 và chia ban chủ nhiệm',
        description: 'Tuyển thành viên đầu tiên và chia ban chủ nhiệm để đảm bảo câu lạc bộ hoạt động hiệu quả.'
      },
      {
        title: 'Buổi sinh hoạt đầu tiên',
        description: 'Tổ chức buổi sinh hoạt đầu tiên để giới thiệu câu lạc bộ và các hoạt động sắp tới.'
      },
      {
        title: 'Phát triển thành viên',
        description: 'Tăng số lượng thành viên với nhiều hoạt động đa dạng'
      },
      {
        title: 'Tổ chức các sự kiện đầu tiên',
        description: 'Tổ chức các sự kiện đầu tiên như Tech Talk và các hoạt động ngoại khóa.'
      }
    ]
  },
  {
    year: '2022',
    title: 'Mở rộng cộng đồng và tổ chức các sự kiện lớn',
    description: 'Tổ chức MASTERING IT, Tech Conference và Workshopvới sự tham gia của các chuyên gia từ Google và các công ty công nghệ hàng đầu.',
    image: ECom,
    achievements: [
      {
        title: 'MASTERING IT 2022',
        description: 'Cuộc thi lập trình tìm ra những nhà phát triển công nghệ tốt nhất.'
      },
      {
        title: 'Workshop: "E-COMMERCE: GAIN FROM GROWTH" ',
        description: 'Tổ chức sự kiện về E-Commerce với sự tham gia của các chuyên gia từ Google và các công ty công nghệ hàng đầu.'
      },
      {
        title: 'CTF-HCMUTE 2022',
        description: 'Tổ chức cuộc thi CTF với sự tham gia của các chuyên gia của sinh viên trường ĐH SPKT TPHCM.'
      },
      {
        title: 'Tuyển thành viên GEN 2',
        description: 'Tuyển thành viên để đảm bảo câu lạc bộ hoạt động hiệu quả.'
      }
    ]
  },
  {
    year: '2023',
    title: 'Phát triển các dự án cộng đồng',
    description: 'Triển khai nhiều dự án thực tế, giúp sinh viên tích lũy kinh nghiệm và đóng góp cho cộng đồng.',
    image: OpenDay,
    achievements: [
      {
        title: 'OPEN DAY 2023',
        description: 'Sự kiện đã thu hút các bạn học sinh từ nhiều trường khác nhau với  "đại tiệc móc khóa" khi tham gia các minigame, đặc biệt là game AI được lập trình bởi thành viên CLB.'
      },
      {
        title: 'Workshop: "GIT&GITHUB"',
        description: 'Tổ chức sự kiện về GIT&GITHUB với sự tham gia của các chuyên gia từ Google và các công ty công nghệ hàng đầu.'
      },
      {
        title: 'Workshop: "GDSC HACKATHON"',
        description: 'Nói về hội chứng "kẻ giả mạo" trong ngành lập trình và cách để tránh nó.'
      },
      {
        title: 'Workshop: "BLOCKCHAIN 101: FUNDAMENTALS AND SOLIDITY"',
        description: 'Nói về cách thức hoạt động của Blockchain và cách để tạo ra một dự án Blockchain.'
      },
      {
        title: 'CUỘC THI HỌC THUẬT TRUYỀN THỐNG "MASTERING IT" 2023',
        description: 'Cuộc thi lập trình tìm ra những nhà phát triển công nghệ tốt nhất.'
      },
      {
        title: 'GDSC Summit Việt Nam 2023',
        description: 'Sự kiện đã thu hút các bạn học sinh từ nhiều trường khác nhau với  "đại tiệc móc khóa" khi tham gia các minigame, đặc biệt là game AI được lập trình bởi thành viên CLB GDSC VN.'
      },
      {
        title: 'Tuyển thành viên GEN 3',
        description: 'Tuyển thành viên để đảm bảo câu lạc bộ hoạt động hiệu quả.'
      }
    ]
  },
  {
    year: '2024',
    title: 'Hướng tới tương lai',
    description: 'Bước ngoặc lớn đổi mới với CLB GDSC HCMUTE.',
    image: HCMUTEDSC,
    achievements: [
      {
        title: 'Quyết định thay đổi định hướng',
        description: 'Quyết định đổi tên thành CLB HCMUTE - Developer Student Clubs, lần này sẽ không phụ thuộc vào Google nữa mà sẽ cố gắng phát triển nhìu công nghệ hơn, cộng đồng lập trình viên tại trường ĐH SPKT TPHCM.'
      },
      {
        title: 'CHƯƠNG TRÌNH: "GIT & GITHUB STUDY JAM"',
        description: 'Tổ chức sự kiện về GIT&GITHUB, được học tập về GIT&GITHUB và tổ chức xây dựng ứng dụng nhận các giải thưởng hấp dẫn.'
      },
      {
        title: 'CHÀO ĐÓN THÀNH VIÊN MỚI & KỶ NIỆM 3 NĂM THÀNH LẬP',
        description: 'Tổ chức buổi sinh hoạt đầu tiên của CLB HCMUTE - Developer Student Clubs, đồng thời chào đón các bạn sinh viên mới và kỷ niệm 3 năm thành lập của CLB.'
      },
      {
        title: 'Workshop INTRODUCTION TO LINUX',
        description: 'Tổ chức sự kiện về LINUX, được học tập về LINUX và hướng dẫn cơ bản cách tổ chức tạo server từ Ubuntu Server.'
      }
    ]
  }
];

const features = [
  {
    icon: IconDeviceLaptop,
    title: 'Công Nghệ Mới',
    description: 'Tiếp cận và học hỏi các công nghệ hiện đại nhất'
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
  banner4,
  banner2,
  banner3,
];

const StatCard = ({ number, label }: { number: string; label: string }) => {
  const endValue = parseInt(number);
  const count = useCountUp(endValue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center p-8 bg-white rounded-xl shadow-lg"
    >
      <div className="text-4xl font-bold text-primary mb-2">{count}+</div>
      <div className="text-gray-600">{label}</div>
    </motion.div>
  );
};

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
              Về Câu lạc bộ
              <br />
              <span className="text-primary">Sinh viên Lập trình HCMUTE</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Chúng tôi là một cộng đồng sinh viên đam mê công nghệ, nơi các bạn có thể học hỏi, 
              chia sẻ và phát triển cùng nhau. Câu lạc bộ Sinh viên Lập trình HCMUTE (HCMUTE Developer Student Club) được thành lập với sứ mệnh tạo ra một 
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
          subtitle="Những giá trị định hình nên HCMUTE Developer Student Club"
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
          subtitle="Hành trình phát triển của HCMUTE Developer Student Club qua các năm"
        />
        <Timeline items={timelineItems} className="mt-16" />
      </Section>
      {/* Stats Section  */}
      <Section className="bg-primary/5">
        <Grid cols={4} gap={8}>
          {[
            { number: '100', label: 'Thành viên' },
            { number: '20', label: 'Sự kiện đã tổ chức' },
            { number: '10', label: 'Dự án thực hiện' },
            { number: '5', label: 'Đối tác' },
          ].map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </Grid>
      </Section>
    </div>
  );
};

export default About; 