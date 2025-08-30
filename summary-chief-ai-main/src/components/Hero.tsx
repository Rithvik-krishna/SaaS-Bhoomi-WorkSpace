import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Mail, 
  FileText, 
  MessageSquare, 
  Calendar,
  Zap,
  ArrowRight,
  Sparkles,
  MessageCircle,
  Shield,
  Users,
  BarChart3,
  Bolt
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export function Hero() {
  const navigate = useNavigate();
  
  const features = [
    { icon: Mail, label: "Email Summaries", color: "text-yellow-400", delay: 0.1 },
    { icon: FileText, label: "Document AI", color: "text-green-400", delay: 0.2 },
    { icon: MessageSquare, label: "Chat Integration", color: "text-blue-400", delay: 0.3 },
    { icon: Calendar, label: "Meeting Digests", color: "text-purple-400", delay: 0.4 },
    { icon: Brain, label: "AI Assistant", color: "text-pink-400", delay: 0.5 },
    { icon: Bolt, label: "Smart Automation", color: "text-orange-400", delay: 0.6 }
  ];

  const stats = [
    { value: "10+", label: "Integrations", icon: "🚀", delay: 0.1 },
    { value: "60s", label: "Voice Digests", icon: "⚡", delay: 0.2 },
    { value: "AI-First", label: "Productivity", icon: "🤖", delay: 0.3 }
  ];
  
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900/50 to-blue-900/50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
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

        {/* Animated orbs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            x: [0, 50, 0],
            y: [0, -30, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            x: [0, -40, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-pink-500/15 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [180, 360, 180],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="relative z-10 text-center max-w-6xl mx-auto">
        {/* Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, type: "spring", stiffness: 200 }}
          className="mb-8"
        >
                     <Badge variant="secondary" className="text-sm font-medium px-6 py-3 bg-gradient-to-r from-purple-600/30 to-blue-600/30 border border-purple-500/50 backdrop-blur-sm">
             <Sparkles className="w-4 h-4 mr-2" />
             Built for SaaSBoomi Hackathon 2025
           </Badge>
        </motion.div>
        
        {/* Main Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6"
        >
          <h1 className="text-6xl md:text-8xl font-bold">
            <motion.span
              className="bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              WorkSpace
            </motion.span>
            <motion.span
              className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
              animate={{
                backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              AI
            </motion.span>
          </h1>
        </motion.div>
        
        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-xl md:text-2xl text-gray-300 mb-4 max-w-3xl mx-auto"
        >
          📊 Unified Work Summary Agent
        </motion.p>
        
        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-lg md:text-xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          An AI-powered productivity dashboard that centralizes work emails, documents, 
          presentations, and chats — and auto-generates smart summaries and email drafts — all in one place.
        </motion.p>
        
        {/* Feature Icons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-wrap justify-center gap-6 mb-12"
        >
          {features.map(({ icon: Icon, label, color, delay }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.5, 
                delay: 1 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 5,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="flex flex-col items-center group"
            >
              <motion.div
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/20 flex items-center justify-center mb-3 backdrop-blur-sm group-hover:border-purple-500/50 transition-all duration-300"
                whileHover={{ 
                  scale: 1.1,
                  boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)",
                }}
              >
                <Icon className={`w-8 h-8 ${color}`} />
              </motion.div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors font-medium">
                {label}
              </span>
            </motion.div>
          ))}
        </motion.div>
        
        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-10 py-6 rounded-xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300"
              onClick={() => navigate('/dashboard')}
            >
              <motion.span
                className="flex items-center gap-2"
                whileHover={{ x: 5 }}
                transition={{ duration: 0.2 }}
              >
                Launch Dashboard
                <ArrowRight className="w-5 h-5" />
              </motion.span>
            </Button>
          </motion.div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="px-10 py-6 rounded-xl border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:border-purple-400 transition-all duration-300 flex items-center gap-2"
              onClick={() => navigate('/chat')}
            >
              <MessageCircle className="w-5 h-5" />
              Chat with WorkspaceAI
            </Button>
          </motion.div>
        </motion.div>
        
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="flex justify-center items-center gap-8 max-w-2xl mx-auto"
        >
          {stats.map(({ value, label, icon, delay }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: 1.6 + index * 0.1,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ 
                scale: 1.05,
                y: -5,
                transition: { duration: 0.2 }
              }}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/20 backdrop-blur-sm"
            >
              <motion.div
                className="text-4xl mb-2"
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
      </div>
    </div>
  );
}