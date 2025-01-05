import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  color?: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
  className?: string;
}

const Tabs = ({ tabs, activeTab, onChange, className = '' }: TabsProps) => {
  const getTabColor = (tab: Tab) => {
    switch (tab.color) {
      case 'blue':
        return 'bg-accent-100 text-accent-600 hover:bg-accent-200';
      case 'green':
        return 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200';
      case 'yellow':
        return 'bg-amber-100 text-amber-600 hover:bg-amber-200';
      case 'red':
        return 'bg-primary-100 text-primary-600 hover:bg-primary-200';
      case 'purple':
        return 'bg-purple-100 text-purple-600 hover:bg-purple-200';
      default:
        return 'bg-secondary-100 text-secondary-600 hover:bg-secondary-200';
    }
  };

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onChange(tab.id)}
          className={`
            relative px-4 py-2 rounded-full font-medium text-sm
            transition-colors duration-200
            ${activeTab === tab.id ? getTabColor(tab) : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}
          `}
        >
          {tab.label}
          {activeTab === tab.id && (
            <motion.div
              layoutId="activeTab"
              className="absolute inset-0 border-2 rounded-full"
              initial={false}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              style={{ borderColor: 'currentColor' }}
            />
          )}
        </motion.button>
      ))}
    </div>
  );
};

export default Tabs; 