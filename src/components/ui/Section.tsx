import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import Container from './Container';

interface SectionProps {
  children: ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  animate?: boolean;
  pattern?: 'dots' | 'grid' | 'none';
  gradient?: 'primary' | 'secondary' | 'none';
}

const Section = ({ 
  children, 
  className = '', 
  containerSize = 'lg',
  animate = true,
  pattern = 'none',
  gradient = 'none'
}: SectionProps) => {
  const patternStyles = {
    dots: "pattern-dots",
    grid: "pattern-grid",
    none: ""
  };

  const gradientStyles = {
    primary: "bg-gradient-to-br from-primary/5 via-primary/2 to-transparent",
    secondary: "bg-gradient-to-br from-secondary/5 via-secondary/2 to-transparent",
    none: ""
  };

  const Content = () => (
    <Container size={containerSize}>
      {children}
    </Container>
  );

  if (!animate) {
    return (
      <section className={`py-16 sm:py-20 relative ${patternStyles[pattern]} ${gradientStyles[gradient]} ${className}`}>
        <Content />
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`py-16 sm:py-20 relative ${patternStyles[pattern]} ${gradientStyles[gradient]} ${className}`}
    >
      <Content />
    </motion.section>
  );
};

export const SectionHeader = ({ 
  title, 
  subtitle,
  className = '',
  gradient = false
}: { 
  title: string; 
  subtitle?: string;
  className?: string;
  gradient?: boolean;
}) => (
  <div className={`text-center max-w-3xl mx-auto mb-16 ${className}`}>
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`text-3xl sm:text-4xl font-bold mb-4 ${gradient ? 'gradient-text' : ''}`}
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-lg text-gray-600"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

export default Section; 