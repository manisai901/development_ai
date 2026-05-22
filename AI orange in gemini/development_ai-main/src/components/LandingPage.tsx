import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Sparkles, Code, BarChart3, MessageSquare, Layers, Database } from 'lucide-react';
import { Logo } from './Navbar';

interface LandingPageProps {
  onNavigate?: (page: string) => void;
}

const FloatingCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  delay?: number;
  className?: string;
  styleDelay?: string;
}> = ({ icon, title, subtitle, delay = 0, className = '', styleDelay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={`bg-white rounded-2xl p-6 shadow-lg border border-orange-100 ${className}`}
    style={styleDelay ? { animationDelay: styleDelay } : undefined}
  >
    <div className="flex items-start gap-4">
      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100">
        {icon}
      </div>
      <div>
        <h3 className="font-sora font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  </motion.div>
);

const DashboardPreview: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.8, delay: 0.3 }}
    className="relative bg-white rounded-2xl p-6 shadow-xl border border-orange-100 overflow-hidden"
  >
    {/* Subtle glow effects */}
    <div className="absolute top-0 left-1/4 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-20" />
    <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20" />

    {/* Header */}
    <div className="flex items-center justify-between mb-6">
      <div>
        <h3 className="font-sora font-semibold text-gray-900">AI Dashboard</h3>
        <p className="text-sm text-gray-500">Real-time analytics</p>
      </div>
      <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 border border-green-200">
        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs text-green-600 font-medium">Live</span>
      </div>
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-2 gap-4 mb-6">
      {[
        { label: 'Total Chats', value: '12,847', change: '+12%' },
        { label: 'AI Usage', value: '89%', change: '+5%' },
        { label: 'Tokens Used', value: '2.4M', change: '+18%' },
        { label: 'Sessions', value: '847', change: '+8%' },
      ].map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 + i * 0.1 }}
          className="p-4 rounded-xl bg-orange-50 border border-orange-100"
        >
          <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
          <p className="text-2xl font-sora font-bold text-gray-900">{stat.value}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">{stat.change}</p>
        </motion.div>
      ))}
    </div>

    {/* Mini chart placeholder */}
    <div className="h-32 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 flex items-end justify-center gap-2 p-4">
      {[40, 60, 45, 80, 65, 90, 75, 85, 95, 70, 88, 92].map((h, i) => (
        <motion.div
          key={i}
          initial={{ height: 0 }}
          animate={{ height: `${h}%` }}
          transition={{ delay: 0.6 + i * 0.05, duration: 0.5 }}
          className="w-4 rounded-full bg-gradient-to-t from-orange-400 to-amber-400"
        />
      ))}
    </div>
  </motion.div>
);

const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: <Code className="w-6 h-6 text-primary" />, title: 'AI Coding Assistant', desc: 'Intelligent code completion and generation' },
    { icon: <MessageSquare className="w-6 h-6 text-accent" />, title: 'Smart Chat', desc: 'Natural language understanding' },
    { icon: <BarChart3 className="w-6 h-6 text-primary" />, title: 'Real-Time Analytics', desc: 'Live insights and monitoring' },
    { icon: <Layers className="w-6 h-6 text-accent" />, title: 'Prompt Engineering', desc: 'Optimize your prompts' },
    { icon: <Database className="w-6 h-6 text-primary" />, title: 'Session History', desc: 'Complete conversation tracking' },
    { icon: <Shield className="w-6 h-6 text-accent" />, title: 'Firebase Cloud', desc: 'Secure data storage' },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="particles-bg" />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-300 rounded-full blur-3xl opacity-20"
            animate={{
              x: mousePosition.x,
              y: mousePosition.y,
            }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
          <motion.div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-300 rounded-full blur-3xl opacity-20"
            animate={{
              x: -mousePosition.x,
              y: -mousePosition.y,
            }}
            transition={{ type: 'spring', stiffness: 50 }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-orange-200 mb-8 shadow-sm"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-gray-600">Powered by Advanced AI</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-sora text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight"
            >
              <span className="text-gray-900">Build Smarter with</span>
              <br />
              <span className="text-gradient-orange">Mani AI</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0"
            >
              AI coding assistant, analytics, architecture guidance, and intelligent automation.
              Transform your workflow with cutting-edge AI technology.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => onNavigate?.('auth')}
                className="btn-primary flex items-center justify-center gap-2"
              >
                <Zap className="w-5 h-5" />
                Get Started
              </button>
              <button
                onClick={() => onNavigate?.('chat')}
                className="btn-secondary flex items-center justify-center gap-2"
              >
                Live Demo
              </button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: '10K+', label: 'Active Users' },
                { value: '99.9%', label: 'Uptime' },
                { value: '50M+', label: 'Tokens Processed' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <p className="text-2xl sm:text-3xl font-sora font-bold text-gradient-orange">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right content - Dashboard preview */}
          <div className="relative">
            <DashboardPreview />

            {/* Floating feature cards */}
            <FloatingCard
              icon={<MessageSquare className="w-5 h-5 text-primary" />}
              title="AI Chat"
              subtitle="24/7 Support"
              delay={0.6}
              className="absolute -left-4 top-1/4 hidden md:block animate-float"
            />
            <FloatingCard
              icon={<BarChart3 className="w-5 h-5 text-accent" />}
              title="Analytics"
              subtitle="Real-time data"
              delay={0.8}
              className="absolute -right-4 top-2/3 hidden md:block animate-float"
              styleDelay="2s"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-sora text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to build smarter, faster, and more efficiently
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-6 rounded-2xl border border-orange-100 hover:shadow-lg hover:border-orange-200 cursor-pointer transition-all duration-300"
              >
                <div className="p-4 rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100 mb-4 group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="font-sora font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-gray-500 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-white p-12 rounded-3xl shadow-xl border border-orange-100 text-center overflow-hidden"
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-amber-50" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30" />

            <div className="relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary to-accent mb-6">
                <Logo size="sm" />
              </div>
              <h2 className="font-sora text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Ready to Transform Your Workflow?
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Join thousands of developers building smarter with Mani AI. Start your free trial today.
              </p>
              <button
                onClick={() => onNavigate?.('auth')}
                className="btn-primary text-lg px-8 py-4"
              >
                Start Free Trial
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;