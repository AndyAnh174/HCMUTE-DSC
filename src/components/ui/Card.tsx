import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  pattern?: 'dots' | 'grid' | 'none';
}

const Card = ({ children, className = '', hover = true, onClick, pattern = 'none' }: CardProps) => {
  const baseStyles = "bg-white rounded-xl shadow-sm overflow-hidden relative";
  const hoverStyles = hover ? "hover:shadow-lg transition-all duration-300" : "";
  const patternStyles = {
    dots: "pattern-dots",
    grid: "pattern-grid",
    none: ""
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -5 } : {}}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${hoverStyles} ${patternStyles[pattern]} ${className}`}
      onClick={onClick}
    >
      {children}
    </motion.div>
  );
};

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`p-6 ${className}`}>
    {children}
  </div>
);

export const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

export const CardFooter = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={`px-6 py-4 bg-secondary-50 ${className}`}>
    {children}
  </div>
);

export const CardImage = ({ src, alt, className = '' }: { src: string; alt: string; className?: string }) => (
  <div className="relative w-full aspect-video overflow-hidden">
    <img 
      src={src} 
      alt={alt} 
      className={`w-full h-full object-cover transition-transform duration-300 hover:scale-105 ${className}`}
    />
  </div>
);

export default Card; 