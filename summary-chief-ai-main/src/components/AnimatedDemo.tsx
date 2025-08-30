import React from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, 
  Zap, 
  Brain, 
  Shield, 
  Users, 
  BarChart3,
  TrendingUp,
  Star,
  Heart,
  Award,
  Trophy,
  Crown
} from 'lucide-react';

export const AnimatedDemo: React.FC = () => {
  const features = [
    { icon: Sparkles, label: 'Magic Animations', color: 'text-purple-400' },
    { icon: Zap, label: 'Lightning Fast', color: 'text-yellow-400' },
    { icon: Brain, label: 'AI Powered', color: 'text-blue-400' },
    { icon: Shield, label: 'Secure', color: 'text-green-400' },
    { icon: Users, label: 'Collaborative', color: 'text-pink-400' },
    { icon: BarChart3, label: 'Analytics', color: 'text-orange-400' }
  ];

  const stats = [
    { value: '99.9%', label: 'Uptime', icon: '🚀' },
    { value: '< 100ms', label: 'Response Time', icon: '⚡' },
    { value: '10M+', label: 'Users', icon: '👥' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/30 to-blue-900/30 text-white p-8">
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-30"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -50, 0],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="w-20 h-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Sparkles className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1
            className="text-6xl font-bold mb-6"
            animate={{
              backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            style={{
              background: "linear-gradient(45deg, #9333ea, #3b82f6, #ec4899, #f59e0b)",
              backgroundSize: "400% 400%",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            God-Tier Animations
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300 mb-8"
          >
            Experience the most beautiful and smooth animations ever created
          </motion.p>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
        >
          {features.map(({ icon: Icon, label, color }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 0.6 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.05, 
                rotate: 5,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm group"
            >
              <motion.div
                className={`w-16 h-16 rounded-xl bg-gradient-to-br from-purple-600/20 to-blue-600/20 flex items-center justify-center mb-4 ${color}`}
                whileHover={{ 
                  scale: 1.2, 
                  rotate: 10,
                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
                }}
                transition={{ duration: 0.2 }}
              >
                <Icon className="w-8 h-8" />
              </motion.div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-white transition-colors">
                {label}
              </h3>
              <p className="text-gray-400 text-sm">
                Experience smooth and beautiful animations that enhance user interaction.
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
        >
          {stats.map(({ value, label, icon }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 1.4 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center p-8 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm"
            >
              <motion.div
                className="text-5xl mb-4"
                animate={{ 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.5
                }}
              >
                {icon}
              </motion.div>
              <div className="text-3xl font-bold text-purple-400 mb-2">{value}</div>
              <div className="text-gray-400 font-medium">{label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold mb-8">Interactive Elements</h2>
          
          <div className="flex flex-wrap justify-center gap-6">
            {/* Animated Button */}
            <motion.button
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)"
              }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-lg"
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Hover Me!
                <TrendingUp className="w-5 h-5" />
              </motion.span>
            </motion.button>

            {/* Animated Card */}
            <motion.div
              whileHover={{ 
                scale: 1.05,
                y: -10,
                boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
              }}
              className="p-6 rounded-xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 backdrop-blur-sm cursor-pointer"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mb-4 mx-auto"
              >
                <Star className="w-6 h-6 text-white" />
              </motion.div>
              <h3 className="font-semibold mb-2">Animated Card</h3>
              <p className="text-sm text-gray-400">Hover to see the magic!</p>
            </motion.div>

            {/* Floating Icon */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="p-6 rounded-xl bg-gradient-to-br from-pink-500/20 to-purple-500/20 border border-pink-500/30 backdrop-blur-sm"
            >
              <Heart className="w-12 h-12 text-pink-400 mx-auto mb-4" />
              <h3 className="font-semibold mb-2">Floating Heart</h3>
              <p className="text-sm text-gray-400">Always in motion!</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2 }}
          className="text-center mt-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block p-8 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 backdrop-blur-sm"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Crown className="w-8 h-8 text-white" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Ready for God-Tier?</h2>
            <p className="text-gray-300 mb-4">Experience the most beautiful animations ever created</p>
            <motion.button
              whileHover={{ 
                scale: 1.1,
                boxShadow: "0 15px 35px rgba(147, 51, 234, 0.4)"
              }}
              whileTap={{ scale: 0.9 }}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl font-semibold text-white shadow-xl"
            >
              Get Started
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
