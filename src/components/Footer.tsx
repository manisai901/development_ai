import React, { useState } from 'react';
import { Github, Twitter, Linkedin, Mail, Heart, Sparkles, X } from 'lucide-react';
import { Logo } from './Navbar';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [showEmailModal, setShowEmailModal] = useState(false);

  const footerLinks = {
    Product: [
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Documentation', href: '#' },
      { name: 'API', href: '#' },
    ],
    Company: [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Press', href: '#' },
    ],
    Resources: [
      { name: 'Community', href: '#' },
      { name: 'Support', href: '#', onClick: () => setShowEmailModal(true) },
      { name: 'Status', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    Legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Cookies', href: '#' },
    ],
  };

  return (
    <>
      <footer className="relative border-t border-orange-100 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Footer */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <Logo size="sm" />
                <span className="font-sora font-bold text-xl text-gray-900">Mani AI</span>
              </div>
              <p className="text-gray-500 text-sm mb-6">
                Building the future of AI-powered development tools.
              </p>
              <div className="flex items-center gap-4">
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 text-gray-500 hover:text-orange-600 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 text-gray-500 hover:text-orange-600 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-100 text-gray-500 hover:text-orange-600 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h4 className="font-sora font-semibold text-gray-900 mb-4">{title}</h4>
                <ul className="space-y-3">
                  {links.map((link: any) => (
                    <li key={link.name}>
                      <a
                        href={link.onClick ? '#' : link.href}
                        onClick={link.onClick}
                        className="text-gray-500 hover:text-orange-600 text-sm transition-colors cursor-pointer"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Newsletter */}
          <div className="mb-12 p-6 rounded-2xl bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="font-sora font-semibold text-gray-900 mb-2">Stay Updated</h3>
                <p className="text-gray-500 text-sm">
                  Get the latest news and updates directly to your inbox
                </p>
              </div>
              <div className="flex gap-3 w-full md:w-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="input-field flex-1 md:w-64 bg-white border-orange-200 text-gray-800 placeholder-gray-400"
                />
                <button className="btn-primary flex items-center gap-2 whitespace-nowrap">
                  <Mail className="w-4 h-4" />
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-orange-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <span>&copy; {currentYear} Mani AI. All rights reserved.</span>
            </div>
          </div>
        </div>

        {/* Glow effect */}
        <div className="absolute bottom-0 left-1/4 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-20 pointer-events-none" />
      </footer>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowEmailModal(false)}
          />
          <div className="relative bg-white p-8 max-w-md w-full rounded-2xl shadow-2xl border border-orange-100 animate-scale-in">
            <button
              onClick={() => setShowEmailModal(false)}
              className="absolute top-4 right-4 p-2 rounded-lg bg-orange-50 text-gray-500 hover:text-orange-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="text-center">
              <div className="inline-flex p-4 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-100 mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-sora text-2xl font-bold text-gray-900 mb-2">Contact Support</h3>
              <p className="text-gray-500 mb-6">
                Reach out to us for any questions or support requests
              </p>
              <a
                href="mailto:manikantasaivootla@gmail.com"
                className="inline-flex items-center gap-2 btn-primary"
              >
                <Mail className="w-5 h-5" />
                manikantasaivootla@gmail.com
              </a>
              <p className="text-sm text-gray-400 mt-4">
                Click to open your email client
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;