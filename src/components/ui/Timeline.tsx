import { useState } from 'react';
import { motion } from 'framer-motion';
import TimelineModal from './TimelineModal';

interface TimelineItem {
  year: string;
  title: string;
  description: string;
  image: string;
  achievements?: {
    title: string;
    description: string;
  }[];
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

const Timeline = ({ items, className = '' }: TimelineProps) => {
  const [selectedItem, setSelectedItem] = useState<TimelineItem | null>(null);

  return (
    <>
      <div className={`relative ${className}`}>
        {/* Line */}
        <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-primary/50 to-primary/10" />

        {/* Items */}
        <div className="relative">
          {items.map((item, index) => (
            <motion.div
              key={item.year}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`flex items-center gap-8 mb-12 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Content */}
              <div className="w-[calc(50%-2rem)] p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => setSelectedItem(item)}
              >
                <div className="relative h-48 mb-4 overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>

              {/* Year Dot */}
              <motion.div
                className="relative cursor-pointer"
                whileHover={{ scale: 1.2 }}
                onClick={() => setSelectedItem(item)}
              >
                <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-bold relative z-10 text-sm">
                  {item.year}
                </div>
                <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
              </motion.div>

              {/* Spacer */}
              <div className="w-[calc(50%-2rem)]" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <TimelineModal
        isOpen={selectedItem !== null}
        onClose={() => setSelectedItem(null)}
        year={selectedItem?.year || ''}
        title={selectedItem?.title || ''}
        description={selectedItem?.description || ''}
        achievements={selectedItem?.achievements || [
          {
            title: 'Thành lập câu lạc bộ',
            description: 'Khởi đầu hành trình với những thành viên đầu tiên'
          },
          {
            title: 'Tổ chức workshop đầu tiên',
            description: 'Workshop về Web Development với hơn 50 sinh viên tham gia'
          },
          {
            title: 'Xây dựng cộng đồng',
            description: 'Tạo môi trường học tập và chia sẻ kiến thức'
          }
        ]}
      />
    </>
  );
};

export default Timeline; 