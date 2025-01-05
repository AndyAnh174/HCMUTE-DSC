import { Modal } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { Suspense } from 'react';
import { IconCircleCheck } from '../../utils/icons';

interface Achievement {
  title: string;
  description: string;
}

interface TimelineModalProps {
  isOpen: boolean;
  onClose: () => void;
  year: string;
  title: string;
  description: string;
  achievements: Achievement[];
}

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="w-6 h-6 bg-gray-200 animate-pulse rounded-full" />}>
    {children}
  </Suspense>
);

const TimelineModal = ({ isOpen, onClose, year, title, description, achievements }: TimelineModalProps) => {
  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={800}
      className="timeline-modal"
      centered
    >
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-8">
              <motion.h2 
                className="text-6xl font-bold text-primary mb-4"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {year}
              </motion.h2>
              <motion.h3 
                className="text-2xl font-semibold mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                {title}
              </motion.h3>
              <motion.p 
                className="text-gray-600 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                {description}
              </motion.p>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="bg-gradient-to-br from-primary/5 to-transparent p-6 rounded-2xl"
            >
              <h4 className="text-xl font-semibold mb-6">Thành tựu nổi bật:</h4>
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4 group"
                    whileHover={{ x: 10 }}
                  >
                    <div className="flex-shrink-0 w-6 h-6 text-primary mt-1">
                      <IconWrapper>
                        <IconCircleCheck />
                      </IconWrapper>
                    </div>
                    <div>
                      <h5 className="font-semibold text-lg group-hover:text-primary transition-colors">
                        {achievement.title}
                      </h5>
                      <p className="text-gray-600">{achievement.description}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Modal>
  );
};

export default TimelineModal; 