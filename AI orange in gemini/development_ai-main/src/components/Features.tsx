import React from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  MessageSquare,
  BarChart3,
  Sparkles,
  Database,
  Shield,
  Zap,
  Globe,
  Layers,
  GitBranch,
  Cloud,
  Cpu,
} from 'lucide-react';

interface FeaturesProps {
  onNavigate?: (page: string) => void;
}

const features = [
  {
    icon: <Code className="w-6 h-6" />,
    title: 'AI Coding Assistant',
    description: 'Intelligent code completion, generation, and debugging powered by advanced language models.',
    gradient: 'from-orange-400 to-amber-500',
    delay: 0.1,
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: 'Smart Chat',
    description: 'Natural language understanding with context-aware conversations and memory.',
    gradient: 'from-amber-400 to-yellow-500',
    delay: 0.2,
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: 'Real-Time Analytics',
    description: 'Live insights, usage metrics, and performance monitoring with beautiful dashboards.',
    gradient: 'from-orange-500 to-red-500',
    delay: 0.3,
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Prompt Engineering',
    description: 'Advanced tools to optimize and test your prompts for better results.',
    gradient: 'from-yellow-500 to-orange-600',
    delay: 0.4,
  },
  {
    icon: <Database className="w-6 h-6" />,
    title: 'Session History',
    description: 'Complete conversation tracking with search and export capabilities.',
    gradient: 'from-green-500 to-emerald-600',
    delay: 0.5,
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: 'Firebase Cloud',
    description: 'Secure and scalable cloud storage powered by Firebase infrastructure.',
    gradient: 'from-red-500 to-rose-600',
    delay: 0.6,
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: 'Lightning Fast',
    description: 'Optimized responses with sub-100ms latency for seamless interactions.',
    gradient: 'from-amber-500 to-yellow-600',
    delay: 0.7,
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: 'Global CDN',
    description: 'Edge computing infrastructure for worldwide low-latency access.',
    gradient: 'from-blue-500 to-indigo-600',
    delay: 0.8,
  },
  {
    icon: <Layers className="w-6 h-6" />,
    title: 'Modular Design',
    description: 'Flexible architecture that adapts to your workflow and requirements.',
    gradient: 'from-orange-500 to-amber-600',
    delay: 0.9,
  },
];

const Features: React.FC<FeaturesProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm text-gray-600">Powerful Features</span>
          </div>
          <h2 className="font-sora text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            Everything you need to
            <span className="text-gradient-orange"> build smarter</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            A comprehensive suite of AI-powered tools designed for modern developers
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: feature.delay }}
              className="group bg-white p-6 rounded-2xl border border-orange-100 hover:shadow-lg hover:border-orange-200 cursor-pointer transition-all duration-300"
            >
              <div
                className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} mb-4 group-hover:scale-110 transition-transform duration-300`}
              >
                <div className="text-white">{feature.icon}</div>
              </div>
              <h3 className="font-sora font-semibold text-xl text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Integration Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 bg-white p-12 rounded-3xl text-center border border-orange-100 shadow-sm"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <GitBranch className="w-4 h-4 text-primary" />
            <span className="text-sm text-primary font-medium">Seamless Integrations</span>
          </div>
          <h3 className="font-sora text-3xl font-bold text-gray-900 mb-4">
            Works with your favorite tools
          </h3>
          <p className="text-gray-600 mb-8 max-w-xl mx-auto">
            Mani AI integrates seamlessly with popular development tools and platforms
          </p>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: <Cloud className="w-6 h-6" />, name: 'AWS' },
              { icon: <Cloud className="w-6 h-6" />, name: 'Google Cloud' },
              { icon: <Cpu className="w-6 h-6" />, name: 'NVIDIA' },
              { icon: <Database className="w-6 h-6" />, name: 'Firebase' },
              { icon: <GitBranch className="w-6 h-6" />, name: 'GitHub' },
              { icon: <Layers className="w-6 h-6" />, name: 'Vercel' },
            ].map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="flex items-center gap-3 px-6 py-3 rounded-xl bg-orange-50 border border-orange-100 hover:border-primary/30 transition-colors"
              >
                <span className="text-gray-500">{tool.icon}</span>
                <span className="text-gray-900 font-medium">{tool.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Features;