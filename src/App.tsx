import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import AIChat from './components/AIChat';
import Auth from './components/Auth';
import Settings from './components/Settings';
import Features from './components/Features';
import Footer from './components/Footer';
import './index.css';

type PageType = 'landing' | 'dashboard' | 'chat' | 'auth' | 'settings' | 'features' | 'pricing' | 'about';

function App() {
  const getInitialPage = (): PageType => {
    const hash = window.location.hash.replace('#', '') as PageType;
    const validPages: PageType[] = ['landing', 'dashboard', 'chat', 'auth', 'settings', 'features', 'pricing', 'about'];
    return validPages.includes(hash) ? hash : 'landing';
  };

  const [currentPage, setCurrentPage] = useState<PageType>(getInitialPage);

  React.useEffect(() => {
    const handlePopState = () => {
      setCurrentPage(getInitialPage());
    };
    
    if (!window.location.hash || window.location.hash === '#') {
      window.history.replaceState(null, '', '#landing');
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as PageType);
    if (window.location.hash !== `#${page}`) {
      window.history.pushState(null, '', `#${page}`);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage onNavigate={handleNavigate} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'chat':
        return <AIChat onNavigate={handleNavigate} />;
      case 'auth':
        return <Auth onNavigate={handleNavigate} />;
      case 'settings':
        return <Settings onNavigate={handleNavigate} />;
      case 'features':
        return <Features onNavigate={handleNavigate} />;
      case 'pricing':
        return <Pricing onNavigate={handleNavigate} />;
      case 'about':
        return <About onNavigate={handleNavigate} />;
      default:
        return <LandingPage onNavigate={handleNavigate} />;
    }
  };

  const showNavbar = !['auth', 'chat'].includes(currentPage);
  const showFooter = !['auth', 'chat'].includes(currentPage);

  return (
    <div className="min-h-screen bg-dark overflow-x-hidden w-full max-w-full">
      {showNavbar && <Navbar currentPage={currentPage} onNavigate={handleNavigate} />}
      <main className={showNavbar ? '' : ''}>
        <AnimatePresence mode="wait">
          <React.Fragment key={currentPage}>
            {renderPage()}
          </React.Fragment>
        </AnimatePresence>
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

// Pricing Page Component
interface PricingProps {
  onNavigate?: (page: string) => void;
}

const Pricing: React.FC<PricingProps> = ({ onNavigate }) => {
  const plans = [
    {
      name: 'Starter',
      price: 'Free',
      description: 'Perfect for getting started with AI',
      features: ['5,000 tokens/month', 'Basic AI chat', 'Email support', 'Community access'],
      gradient: 'from-gray-600 to-gray-700',
      delay: 0.1,
    },
    {
      name: 'Pro',
      price: '$29',
      period: '/month',
      description: 'For professionals and small teams',
      features: ['100,000 tokens/month', 'Advanced AI features', 'Priority support', 'API access', 'Custom prompts', 'Analytics'],
      gradient: 'from-primary to-purple-600',
      delay: 0.2,
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'For large organizations',
      features: ['Unlimited tokens', 'Dedicated support', 'Custom integrations', 'SLA guarantee', 'Team management', 'Advanced security'],
      gradient: 'from-accent to-cyan-600',
      delay: 0.3,
    },
  ];

  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sora text-4xl sm:text-5xl font-bold text-white mb-4">
            Simple, transparent <span className="text-gradient">pricing</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the plan that fits your needs. No hidden fees.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: plan.delay }}
              className={`glass-card-hover p-8 relative ${plan.popular ? 'border-primary/50' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-white text-sm font-semibold">
                  Most Popular
                </div>
              )}
              <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${plan.gradient} mb-6`}>
                <span className="text-2xl text-white">{plan.name[0]}</span>
              </div>
              <h3 className="font-sora text-2xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-bold text-white">{plan.price}</span>
                {plan.period && <span className="text-gray-400">{plan.period}</span>}
              </div>
              <p className="text-gray-400 mb-6">{plan.description}</p>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, j) => (
                  <li key={j} className="flex items-center gap-3 text-gray-300">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button className={`w-full py-3 rounded-xl font-semibold transition-all ${
                plan.popular
                  ? 'btn-primary'
                  : 'bg-glass border border-glass-border text-white hover:bg-glass-hover'
              }`}>
                {plan.price === 'Free' ? 'Get Started' : plan.price === 'Custom' ? 'Contact Sales' : 'Subscribe'}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

// About Page Component
interface AboutProps {
  onNavigate?: (page: string) => void;
}

const About: React.FC<AboutProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="font-sora text-4xl sm:text-5xl font-bold text-white mb-4">
            About <span className="text-gradient">Mani AI</span>
          </h2>
          <p className="text-xl text-gray-400">
            Building the future of AI-powered development
          </p>
        </div>

        <div className="glass-card p-8 mb-12">
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            Mani AI was founded in 2024 with a mission to democratize AI for developers. We believe that
            artificial intelligence should be accessible, powerful, and intuitive. Our team of experienced
            engineers and AI researchers are dedicated to building tools that make developers more productive.
          </p>
          <p className="text-lg text-gray-300 leading-relaxed">
            From intelligent code completion to real-time analytics, we're committed to pushing the boundaries
            of what's possible with AI technology. Join us on our journey to transform how software is built.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {[
            { label: 'Founded', value: '2024' },
            { label: 'Team Members', value: '50+' },
            { label: 'Users', value: '10,000+' },
            { label: 'Countries', value: '30+' },
          ].map((stat, i) => (
            <div key={stat.label} className="glass-card p-6 text-center">
              <p className="text-3xl font-sora font-bold text-gradient mb-2">{stat.value}</p>
              <p className="text-gray-400">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;