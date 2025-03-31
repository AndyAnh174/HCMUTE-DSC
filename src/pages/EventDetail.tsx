import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button, Tag, Spin, Divider } from 'antd';
import { IconCalendar, IconMapPin, IconBrandFacebook} from '../utils/icons';
import Section from '../components/ui/Section';
import { config } from '../config/env';
import { getImageUrl } from '../utils/image';
import Navbar from '../components/Navbar';
import './EventDetail.css';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: string;
  image: string;
  organizer: string;
  isHighlight: boolean;
  facebookUrl: string;
}

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/events/${id}`);
        const result = await response.json();
        
        if (response.ok) {
          setEvent(result.data);
        }
      } catch (error) {
        console.error('Error fetching event:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy sự kiện</h2>
        <Link to="/events">
          <Button type="primary">Quay lại trang sự kiện</Button>
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
          <div className="flex flex-col md:flex-row gap-8">
            {/* Ảnh sự kiện */}
            <div className="md:w-1/2">
              <div className="relative">
                <img
                  src={getImageUrl(event.image)}
                  alt={event.title}
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                />
                {event.isHighlight && (
                  <div className="absolute top-4 right-4">
                    <Tag color="orange" className="px-3 py-1 text-sm font-medium rounded-full">
                      Nổi bật
                    </Tag>
                  </div>
                )}
              </div>
            </div>

            {/* Thông tin sự kiện */}
            <div className="md:w-1/2 space-y-6">
              <div className="space-y-4">
                <Tag 
                  color={
                    event.status === 'upcoming' ? 'green' :
                    event.status === 'ongoing' ? 'blue' :
                    'default'
                  }
                  className="px-3 py-1 text-sm font-medium rounded-full"
                >
                  {event.status === 'upcoming' ? 'Sắp diễn ra' :
                   event.status === 'ongoing' ? 'Đang diễn ra' :
                   'Đã kết thúc'}
                </Tag>

                <h1 className="text-4xl font-bold text-gray-900">{event.title}</h1>

                <div className="space-y-3 text-lg">
                  <div className="flex items-center text-gray-700">
                    <IconCalendar size={24} className="mr-3 text-primary" />
                    <span>{event.date} | {event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-700">
                    <IconMapPin size={24} className="mr-3 text-primary" />
                    <span>{event.location}</span>
                  </div>
                </div>

                <Divider className="my-6" />

                <div className="space-y-4">
                  <Button 
                    type="default"
                    size="large"
                    href={event.facebookUrl || "https://www.facebook.com/hcmute.dsc"}
                    target="_blank"
                    icon={<IconBrandFacebook size={20} />}
                    className="w-full md:w-auto h-12 text-base"
                  >
                    {event.facebookUrl ? 'Xem trên Facebook' : 'Theo dõi trên Facebook'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* Chi tiết sự kiện */}
      <Section className="py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Chi tiết sự kiện</h2>
            <div className="prose max-w-none text-gray-700">
              <div 
                dangerouslySetInnerHTML={{ __html: event.description }} 
                className="event-description"
              />
            </div>
          </div>
        </div>
      </Section>

      {/* Ban tổ chức */}
      <Section className="py-12" gradient="secondary">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <h2 className="text-2xl font-bold mb-4">Ban tổ chức</h2>
            <p className="text-lg">{event.organizer}</p>
            
            <Divider className="my-8" />
            
            <h3 className="text-xl font-semibold mb-4">Quan tâm đến sự kiện này?</h3>
            <p className="text-gray-600 mb-6">
              Đừng quên theo dõi chúng tôi trên Facebook để cập nhật những thông tin mới nhất về sự kiện
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/events" onClick={() => window.scrollTo(0, 0)}>
                <Button size="large">Xem các sự kiện khác</Button>
              </Link>
              <Button 
                type="primary" 
                size="large"
                href="https://www.facebook.com/hcmute.dsc"
                target="_blank"
                icon={<IconBrandFacebook size={20} />}
              >
                Theo dõi Fanpage
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </div>
  );
};

export default EventDetail; 