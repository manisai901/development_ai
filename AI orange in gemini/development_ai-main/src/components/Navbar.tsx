import React, { useState } from 'react';
import { Menu, X, Sun, Moon, ChevronDown, User, Settings, LogOut, MessageSquare, BarChart3, Home, Users } from 'lucide-react';

interface NavbarProps {
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: { container: 32, stroke: 2, nodes: 4 },
    md: { container: 40, stroke: 2.5, nodes: 5 },
    lg: { container: 56, stroke: 3, nodes: 6 },
  };

  const { container, stroke, nodes } = dimensions[size];

  return (
    <svg width={container} height={container} viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer glow effect */}
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Neural network nodes */}
      {[...Array(nodes)].map((_, i) => {
        const angle = (i / nodes) * 2 * Math.PI - Math.PI / 2;
        const radius = 22;
        const x = 28 + radius * Math.cos(angle);
        const y = 28 + radius * Math.sin(angle);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={3}
            fill="url(#logoGradient)"
            filter="url(#glow)"
            className="animate-pulse"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        );
      })}

      {/* Central M letter */}
      <path
        d="M14 38V18L28 32L42 18V38"
        stroke="url(#logoGradient)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#glow)"
      />

      {/* Circuit lines */}
      <path
        d="M14 18L28 8L42 18"
        stroke="url(#logoGradient)"
        strokeWidth={stroke * 0.6}
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* Connection dots */}
      <circle cx="14" cy="18" r="2" fill="#FBBF24" filter="url(#glow)" />
      <circle cx="42" cy="18" r="2" fill="#FBBF24" filter="url(#glow)" />
      <circle cx="28" cy="8" r="2" fill="#F97316" filter="url(#glow)" />
    </svg>
  );
};

const Navbar: React.FC<NavbarProps> = ({ currentPage = 'landing', onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navLinks = [
    { name: 'Home', id: 'landing', icon: Home },
    { name: 'Dashboard', id: 'dashboard', icon: BarChart3 },
    { name: 'AI Chat', id: 'chat', icon: MessageSquare },
    { name: 'Pricing', id: 'pricing', icon: Users },
    { name: 'About', id: 'about', icon: User },
  ];

  const handleNavigate = (pageId: string) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
    setIsMenuOpen(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50">
        {/* Light warm background */}
        <div className="absolute inset-0 bg-white/90 backdrop-blur-xl border-b border-orange-100 shadow-sm" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <button
              onClick={() => handleNavigate('landing')}
              className="flex items-center gap-3 group"
            >
              <Logo size="md" />
              <span className="font-sora font-bold text-xl text-gray-900 group-hover:text-primary transition-colors">
                Mani AI
              </span>
            </button>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`nav-link font-medium transition-all duration-300 ${
                    currentPage === link.id
                      ? 'text-orange-600 after:w-full'
                      : 'hover:text-orange-600'
                  }`}
                >
                  {link.name}
                </button>
              ))}
            </div>

            {/* Right side buttons */}
            <div className="hidden lg:flex items-center gap-4">
              {/* Dark mode toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all duration-200"
              >
                {isDarkMode ? (
                  <Sun className="w-5 h-5 text-orange-600" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-500" />
                )}
              </button>

              {/* Profile dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">A</span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 animate-scale-in overflow-hidden">
                    <div className="p-4 border-b border-orange-100 bg-orange-50">
                      <p className="font-medium text-gray-900">Alex Chen</p>
                      <p className="text-sm text-gray-500">alex@mani.ai</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <User className="w-4 h-4" />
                        Profile
                      </button>
                      <button className="w-full flex items-center gap-3 px-4 py-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                      </button>
                      <button
                        onClick={() => handleNavigate('auth')}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Login button */}
              <button
                onClick={() => handleNavigate('auth')}
                className="btn-primary"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-orange-50 border border-orange-200"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-700" />
              ) : (
                <Menu className="w-6 h-6 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white rounded-2xl shadow-xl border border-orange-100 m-4 animate-slide-up overflow-hidden">
            <div className="p-4 space-y-2">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavigate(link.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    currentPage === link.id
                      ? 'bg-primary/10 text-orange-600'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.name}
                </button>
              ))}

              <div className="pt-4 border-t border-orange-100 flex items-center gap-4">
                <button
                  onClick={toggleDarkMode}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-50 rounded-xl text-gray-600"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  Theme
                </button>
                <button
                  onClick={() => handleNavigate('auth')}
                  className="flex-1 btn-primary text-center"
                >
                  Get Started
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-16 md:h-20" />
    </>
  );
};

export default Navbar;
export { Logo };