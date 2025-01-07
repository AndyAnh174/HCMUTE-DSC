import { useState, useEffect, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Button } from 'antd';
import { IconUsers, IconCode, IconDeviceLaptop } from '../utils/icons';
import { Link } from 'react-router-dom';
import { config } from '../config/env';

const IconWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<div className="w-12 h-12 bg-gray-200 animate-pulse rounded" />}>
    {children}
  </Suspense>
);

const Home = () => {
  const [currentBanner, setCurrentBanner] = useState(0);
  const [banners, setBanners] = useState([]);
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/banners`);
        const result = await response.json();
        if (response.ok) {
          // Chỉ lấy các banner đang active
          const activeBanners = result.data.filter((banner: { active: boolean }) => banner.active);
          setBanners(activeBanners);
        }
      } catch (error) {
        console.error('Error fetching banners:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    if (banners.length > 0) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);

      return () => clearInterval(timer);
    }
  }, [banners.length]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-12">
        <div className="container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            {/* Text Content - Left Side */}
            <div className="lg:w-1/2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                  Welcome to{' '}
                  <span className="text-[#EA4335]">HCM</span>
                  <br />
                  <span className="text-[#EA4335]">UTE Developer</span>
                  <br />
                  <span className="text-[#EA4335]">Student Club</span>
                </h1>
                <p className="text-lg text-gray-600 mb-8">
                  Join our community of passionate developers and tech enthusiasts.
                  <br />
                  Learn, build, and grow together with Google technologies.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Button
                    type="primary"
                    size="large"
                    icon={<IconUsers className="w-5 h-5" />}
                    className="flex items-center"
                  >
                    <Link to="/members" onClick={() => window.scrollTo(0, 0)}>Join Us</Link>
                  </Button>
                  <Button
                    size="large"
                    icon={<IconCode className="w-5 h-5" />}
                    className="flex items-center"
                  >
                    <Link to="/projects" onClick={() => window.scrollTo(0, 0)}>View Projects</Link>
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Banner Slider - Right Side */}
            <div className="lg:w-1/2 relative h-[400px] w-full overflow-hidden rounded-2xl">
              {banners.map((banner, index) => (
                <motion.div
                  key={index}
                  className="absolute inset-0"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ 
                    opacity: currentBanner === index ? 1 : 0,
                    x: currentBanner === index ? 0 : 100 
                  }}
                  transition={{ duration: 0.5 }}
                  style={{ display: currentBanner === index ? 'block' : 'none' }}
                >
                  <img
                    src={`${config.apiUrl}${(banner as any).image}`}
                    alt={`${(banner as any).title}`}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              ))}
              
              {/* Banner Navigation Dots */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                {banners.map((_, index) => (
                  <button
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      currentBanner === index ? 'bg-white w-4' : 'bg-white/50'
                    }`}
                    onClick={() => setCurrentBanner(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <IconWrapper>
                <IconDeviceLaptop className="text-primary w-12 h-12 mb-4" />
              </IconWrapper>
              <h3 className="text-xl font-semibold mb-3">Công nghệ mới</h3>
              <p className="text-gray-600">
                Học hỏi và làm việc với các công nghệ hiện đại nhất.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <IconWrapper>
                <IconCode className="text-secondary w-12 h-12 mb-4" />
              </IconWrapper>
              <h3 className="text-xl font-semibold mb-3">Hands-on Projects</h3>
              <p className="text-gray-600">
                Build real-world projects and gain practical experience.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-lg">
              <IconWrapper>
                <IconUsers className="text-accent w-12 h-12 mb-4" />
              </IconWrapper>
              <h3 className="text-xl font-semibold mb-3">Community</h3>
              <p className="text-gray-600">
                Connect with like-minded developers and grow together.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join our community today and embark on an exciting journey of
              learning, innovation, and growth.
            </p>
            <Button
            type="primary"
            size="large">
              <Link to="/contact#top" onClick={() => window.scrollTo(0, 0)}>Get Started Now</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;