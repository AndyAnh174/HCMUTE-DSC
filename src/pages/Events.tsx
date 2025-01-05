import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Card, Tag, Button, message, Modal } from 'antd';
import { IconCalendar, IconMapPin, IconUsers } from '../utils/icons';
import Section from '../components/ui/Section';
import Grid from '../components/ui/Grid';
import Tabs from '../components/ui/Tabs';
import { config } from '../config/env';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  status: string;
  image: string;
  maxParticipants: number;
  currentParticipants: number;
  organizer: string;
  googleFormUrl: string;
  registered_ips: string[];
}

const tabs = [
  { id: 'all', label: 'Tất cả', color: 'blue' },
  { id: 'upcoming', label: 'Sắp diễn ra', color: 'green' },
  { id: 'ongoing', label: 'Đang diễn ra', color: 'yellow' },
  { id: 'past', label: 'Đã kết thúc', color: 'red' },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="w-5 h-5 bg-gray-200 animate-pulse rounded" />}>
    {children}
  </Suspense>
);

const Events = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [registerModalVisible, setRegisterModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [registering, setRegistering] = useState(false);
  const [userIp, setUserIp] = useState<string>('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/events`);
        const result = await response.json();
        
        if (response.ok) {
          setEvents(result.data);
        } else {
          throw new Error(result.message || 'Có lỗi xảy ra khi tải danh sách sự kiện');
        }
      } catch (error) {
        console.error('Error fetching events:', error);
        message.error('Không thể tải danh sách sự kiện');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchUserIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setUserIp(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };
    fetchUserIp();
  }, []);

  const filteredEvents = events.filter(
    event => activeTab === 'all' || event.status === activeTab
  );

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setRegisterModalVisible(true);
  };

  const handleConfirmRegistration = async () => {
    if (!selectedEvent) return;

    try {
      setRegistering(true);
      const response = await fetch(`${config.apiUrl}/events/${selectedEvent.id}/register`, {
        method: 'POST'
      });

      const data = await response.json();

      if (response.ok) {
        message.success('Đăng ký tham gia thành công!');
        setEvents(prevEvents => prevEvents.map(event => 
          event.id === selectedEvent.id 
            ? {...event, registered_ips: [...event.registered_ips, userIp]}
            : event
        ));
      } else {
        if (data.error === 'IP_ALREADY_REGISTERED') {
          message.warning('Bạn đã đăng ký tham gia sự kiện này rồi!');
        } else if (data.error === 'FULL_CAPACITY') {
          message.error('Sự kiện đã đủ số lượng người tham gia!');
        } else {
          throw new Error(data.message || 'Có lỗi xảy ra');
        }
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error('Không thể đăng ký tham gia: ' + error.message);
      } else {
        message.error('Không thể đăng ký tham gia: Có lỗi xảy ra');
      }
    } finally {
      setRegistering(false);
      setRegisterModalVisible(false);
    }
  };

  const hasUserRegistered = (event: Event) => {
    return event.registered_ips.includes(userIp);
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Section className="pt-24 pb-12" gradient="primary" pattern="dots">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-gray-200 rounded mb-4 mx-auto" />
            <div className="h-4 w-2/3 bg-gray-200 rounded mx-auto" />
          </div>
        </Section>
        
        <Section className="py-12">
          <Grid cols={3} gap={8}>
            {[1, 2, 3].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-white rounded-lg shadow-lg">
                  <div className="h-48 bg-gray-200 rounded-t-lg" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </Grid>
        </Section>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section className="pt-24 pb-12" gradient="primary" pattern="dots">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Sự Kiện <span className="text-primary">DSC UTE</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Tham gia các sự kiện hấp dẫn của chúng tôi để học hỏi, chia sẻ và kết nối 
            với cộng đồng công nghệ tại UTE.
          </p>
        </motion.div>
      </Section>

      {/* Events List Section */}
      <Section className="py-12">
        <Tabs
          tabs={tabs}
          activeTab={activeTab}
          onChange={setActiveTab}
          className="justify-center mb-12"
        />

        <Grid cols={3} gap={8}>
          {filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              <Card
                cover={
                  <div className="relative h-48">
                    <img
                      alt={event.title}
                      src={event.image.startsWith('http') ? event.image : `${config.apiUrl}${event.image}`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-4 right-4">
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
                  {event.title}
                </h3>
                
                <div className="space-y-3 mb-4 flex-none">
                  <div className="flex items-center text-gray-600">
                    <IconWrapper>
                      <IconCalendar size={18} className="mr-2 text-primary" />
                    </IconWrapper>
                    <span className="text-sm">{event.date} | {event.time}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <IconWrapper>
                      <IconMapPin size={18} className="mr-2 text-primary" />
                    </IconWrapper>
                    <span className="text-sm line-clamp-1">{event.location}</span>
                  </div>
                </div>

                <p className="text-gray-600 mb-6 line-clamp-3 flex-1">
                  {event.description}
                </p>

                <div className="flex-none">
                  <Button 
                    type="primary" 
                    icon={
                      <IconWrapper>
                        <IconUsers size={18} />
                      </IconWrapper>
                    } 
                    className="w-full h-10 flex items-center justify-center"
                    onClick={() => handleRegister(event)}
                    disabled={
                      event.status === 'past' || 
                      event.currentParticipants >= event.maxParticipants ||
                      hasUserRegistered(event)
                    }
                  >
                    {event.status === 'past' ? 'Đã kết thúc' :
                     event.currentParticipants >= event.maxParticipants ? 'Hết chỗ' :
                     hasUserRegistered(event) ? 'Đã đăng ký' :
                     'Đăng ký tham gia'}
                  </Button>
                  <div className="text-center text-sm text-gray-500 mt-2">
                    {event.currentParticipants}/{event.maxParticipants} người tham gia
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </Grid>

        {filteredEvents.length === 0 && (
          <div className="text-center text-gray-500 py-12">
            Không có sự kiện nào {activeTab !== 'all' ? 'trong trạng thái này' : ''}.
          </div>
        )}
      </Section>

      {/* CTA Section */}
      <Section className="py-20" gradient="secondary" pattern="grid">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Bạn muốn tổ chức sự kiện cùng DSC?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hợp tác để tổ chức các sự kiện công nghệ 
            bổ ích cho cộng đồng sinh viên UTE.
          </p>
          <Button type="primary" size="large">
            Liên hệ hợp tác
          </Button>
        </motion.div>
      </Section>

      <Modal
        title="Đăng ký tham gia sự kiện"
        open={registerModalVisible}
        onCancel={() => setRegisterModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setRegisterModalVisible(false)}>
            Hủy
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={registering}
            onClick={handleConfirmRegistration}
          >
            Xác nhận tham gia
          </Button>
        ]}
      >
        <div className="space-y-4">
          <p>Vui lòng hoàn thành các bước sau để đăng ký tham gia sự kiện:</p>
          
          <ol className="list-decimal list-inside space-y-2">
            <li>
              Đọc thông tin chi tiết và điền form đăng ký tại{' '}
              <a 
                href={selectedEvent?.googleFormUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                đây
              </a>
            </li>
            <li>Sau khi hoàn thành form, quay lại đây và nhấn "Xác nhận tham gia"</li>
          </ol>

          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">
              Lưu ý: Việc xác nhận tham gia sẽ giúp chúng tôi thống kê số lượng người tham dự chính xác hơn.
              Vui lòng chỉ xác nhận khi bạn đã điền form đăng ký.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Events; 