import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Fade in animation variants
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -60 }
};

export const fadeInDown: Variants = {
  initial: { opacity: 0, y: -60 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 60 }
};

export const fadeInLeft: Variants = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 60 }
};

export const fadeInRight: Variants = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -60 }
};

export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 }
};

export const slideInUp: Variants = {
  initial: { opacity: 0, y: 100 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 100 }
};

// Stagger children animation
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Hover animations
export const hoverScale = {
  scale: 1.05,
  transition: { duration: 0.2, ease: "easeOut" }
};

export const hoverLift = {
  y: -8,
  boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
  transition: { duration: 0.3, ease: "easeOut" }
};

export const hoverGlow = {
  boxShadow: "0 0 30px rgba(147, 51, 234, 0.3)",
  transition: { duration: 0.3, ease: "easeOut" }
};

// Animated Card Component
export const AnimatedCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  whileHover?: any;
  onClick?: () => void;
}> = ({ children, className = "", delay = 0, whileHover = hoverLift, onClick }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={fadeInUp}
    transition={{ duration: 0.6, delay, ease: "easeOut" }}
    whileHover={whileHover}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`${className} cursor-pointer`}
  >
    {children}
  </motion.div>
);

// Animated Button Component
export const AnimatedButton: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
}> = ({ children, className = "", onClick, disabled = false, variant = 'primary' }) => {
  const baseClasses = "relative overflow-hidden rounded-lg font-medium transition-all duration-300";
  const variantClasses = {
    primary: "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg",
    secondary: "bg-gray-800 text-gray-100 border border-gray-700",
    ghost: "bg-transparent text-gray-300 hover:text-white"
  };

  return (
    <motion.button
      whileHover={{ 
        scale: disabled ? 1 : 1.05,
        boxShadow: disabled ? "none" : "0 10px 30px rgba(147, 51, 234, 0.3)"
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-blue-400/20"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
};

// Animated Text Component
export const AnimatedText: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}> = ({ children, className = "", delay = 0, variant = 'p' }) => {
  const Tag = variant as keyof JSX.IntrinsicElements;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      <Tag className={className}>{children}</Tag>
    </motion.div>
  );
};

// Animated Icon Component
export const AnimatedIcon: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className = "", delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ 
      duration: 0.5, 
      delay, 
      ease: "easeOut",
      type: "spring",
      stiffness: 200
    }}
    whileHover={{ 
      scale: 1.1,
      rotate: 5,
      transition: { duration: 0.2 }
    }}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated Loading Spinner
export const AnimatedSpinner: React.FC<{ size?: number; className?: string }> = ({ 
  size = 24, 
  className = "" 
}) => (
  <motion.div
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    className={`${className}`}
    style={{ width: size, height: size }}
  >
    <div className="w-full h-full border-2 border-purple-600 border-t-transparent rounded-full" />
  </motion.div>
);

// Animated Progress Bar
export const AnimatedProgress: React.FC<{
  progress: number;
  className?: string;
  color?: string;
}> = ({ progress, className = "", color = "purple" }) => (
  <div className={`w-full bg-gray-700 rounded-full h-2 ${className}`}>
    <motion.div
      className={`h-full bg-gradient-to-r from-${color}-500 to-${color}-600 rounded-full`}
      initial={{ width: 0 }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
    />
  </div>
);

// Animated Counter
export const AnimatedCounter: React.FC<{
  value: number;
  className?: string;
  duration?: number;
}> = ({ value, className = "", duration = 2 }) => (
  <motion.span
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className={className}
  >
    <motion.span
      initial={{ number: 0 }}
      animate={{ number: value }}
      transition={{ duration, ease: "easeOut" }}
    >
      {Math.round(value)}
    </motion.span>
  </motion.span>
);

// Animated Background Gradient
export const AnimatedBackground: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <motion.div
      className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20"
      animate={{
        background: [
          "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))",
          "linear-gradient(45deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1))",
          "linear-gradient(45deg, rgba(147, 51, 234, 0.1), rgba(59, 130, 246, 0.1))"
        ]
      }}
      transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
    />
    <div className="relative z-10">{children}</div>
  </div>
);

// Animated List Item
export const AnimatedListItem: React.FC<{
  children: React.ReactNode;
  index: number;
  className?: string;
}> = ({ children, index, className = "" }) => (
  <motion.div
    initial={{ opacity: 0, x: -50 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ 
      duration: 0.5, 
      delay: index * 0.1,
      ease: "easeOut"
    }}
    whileHover={{ x: 10, transition: { duration: 0.2 } }}
    className={className}
  >
    {children}
  </motion.div>
);

// Animated Modal
export const AnimatedModal: React.FC<{
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}> = ({ children, isOpen, onClose, className = "" }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
          className={`bg-gray-900 rounded-xl shadow-2xl border border-gray-700 ${className}`}
        >
          {children}
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

// Animated Tooltip
export const AnimatedTooltip: React.FC<{
  children: React.ReactNode;
  content: string;
  className?: string;
}> = ({ children, content, className = "" }) => (
  <motion.div
    className={`relative group ${className}`}
    whileHover={{ scale: 1.05 }}
  >
    {children}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileHover={{ opacity: 1, y: 0 }}
      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-800 text-white text-sm rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity"
    >
      {content}
      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-800" />
    </motion.div>
  </motion.div>
);

// Animated Notification
export const AnimatedNotification: React.FC<{
  children: React.ReactNode;
  isVisible: boolean;
  type?: 'success' | 'error' | 'warning' | 'info';
  className?: string;
}> = ({ children, isVisible, type = 'info', className = "" }) => {
  const typeClasses = {
    success: 'bg-green-600 border-green-500',
    error: 'bg-red-600 border-red-500',
    warning: 'bg-yellow-600 border-yellow-500',
    info: 'bg-blue-600 border-blue-500'
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg border ${typeClasses[type]} text-white shadow-lg ${className}`}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
