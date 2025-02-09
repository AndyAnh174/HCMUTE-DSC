import { useState, Suspense } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from 'antd';
import { IconMenu2, IconX } from '../utils/icons';
import Container from './ui/Container';
import LogoCLB from '../assets/LogoDSC.png';

const menuItems = [
  { 
    path: '/', 
    label: 'Trang chủ',
    description: 'Khám phá DSC HCM UTE'
  },
  { 
    path: '/about', 
    label: 'Giới thiệu',
    description: 'Tìm hiểu về chúng tôi'
  },
  { 
    path: '/events', 
    label: 'Sự kiện',
    description: 'Các hoạt động sắp tới'
  },
  { 
    path: '/projects', 
    label: 'Dự án',
    description: 'Các dự án nổi bật'
  },
  { 
    path: '/members', 
    label: 'Thành viên',
    description: 'Đội ngũ của chúng tôi'
  },
  { 
    path: '/documents', 
    label: 'Tài liệu',
    description: 'Kho tài nguyên học tập'
  },
  { 
    path: '/contact', 
    label: 'Liên hệ',
    description: 'Kết nối với chúng tôi'
  },
];

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="w-5 h-5 bg-gray-200 animate-pulse rounded" />}>
    {children}
  </Suspense>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-secondary to-secondary-600 backdrop-blur-md border-b border-secondary-400">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={LogoCLB} alt="DSC Logo" className="h-24 w-auto" />
            <div className="flex flex-col justify-center">
              <span className="font-bold text-base block nav-text text-white">DSC HCM UTE</span>
              <span className="text-[10px] font-semibold text-secondary-100 nav-text">Developer Student Clubs</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-1">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  relative px-3 py-2 rounded-lg text-sm font-semibold nav-text
                  transition-colors duration-200
                  ${pathname === item.path 
                    ? 'text-primary bg-white/10' 
                    : 'text-white hover:text-white hover:bg-white/10'
                  }
                `}
              >
                {item.label}
                {pathname === item.path && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute -bottom-[1px] left-0 right-0 h-0.5 bg-primary"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Join Button */}
          <div className="hidden lg:block">
            <Button 
              type="default" 
              href="https://www.facebook.com/hcmute.dsc" 
              target="_blank"
              rel="noopener noreferrer"
              size="large" 
              className="px-6 nav-text font-semibold bg-white text-secondary hover:bg-white/90"
              onClick={() => window.open('https://www.facebook.com/hcmute.dsc', '_blank')}
            >
              Tham gia ngay
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-lg hover:bg-white/10 text-white"
          >
            <IconWrapper>
              {isOpen ? <IconX size={24} /> : <IconMenu2 size={24} />}
            </IconWrapper>
          </button>
        </div>
      </Container>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden border-t border-secondary-400 bg-secondary-700"
          >
            <Container>
              <div className="py-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={`
                      block px-4 py-3 rounded-lg nav-text
                      ${pathname === item.path
                        ? 'bg-white/10 text-primary'
                        : 'text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <span className="block font-semibold">{item.label}</span>
                    <span className="block text-sm font-medium text-secondary-100 mt-0.5">{item.description}</span>
                  </Link>
                ))}
                <div className="pt-4">
                  <Button type="default" size="large" block className="nav-text font-semibold bg-white text-secondary hover:bg-white/90">
                    Tham gia ngay
                  </Button>
                </div>
              </div>
            </Container>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar; 