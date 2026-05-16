import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Sparkles, User } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { Logo } from './Navbar';

interface AuthProps {
  onNavigate?: (page: string) => void;
}

const Auth: React.FC<AuthProps> = ({ onNavigate }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
      onNavigate?.('dashboard');
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
      onNavigate?.('dashboard');
    } catch (error) {
      console.error('Google Auth error:', error);
      alert('Google Authentication failed: ' + (error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - AI Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background - Warm gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50" />

        {/* Animated particles */}
        <div className="absolute inset-0">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-orange-300/50"
              initial={{
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
              }}
              animate={{
                x: [Math.random() * window.innerWidth, Math.random() * window.innerWidth],
                y: [Math.random() * window.innerHeight, Math.random() * window.innerHeight],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center p-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="p-4 rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg">
                <Logo size="lg" />
              </div>
              <div>
                <h1 className="font-sora text-4xl font-bold text-gray-900">Mani AI</h1>
                <p className="text-gray-600">Build smarter with AI</p>
              </div>
            </div>

            <h2 className="font-sora text-3xl font-bold text-gray-900 mb-4">
              Welcome to the future of AI development
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-md">
              Join thousands of developers who are building smarter, faster applications with Mani AI.
            </p>

            <div className="space-y-4">
              {[
                { icon: '⚡', text: 'Lightning-fast AI responses' },
                { icon: '🔒', text: 'Enterprise-grade security' },
                { icon: '🌐', text: 'Global infrastructure' },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-2xl">{feature.icon}</span>
                  <span className="text-gray-700">{feature.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Glow effects */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-orange-200 rounded-full blur-3xl opacity-30" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-amber-200 rounded-full blur-3xl opacity-30" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back button */}
          <button
            onClick={() => onNavigate?.('landing')}
            className="flex items-center gap-2 text-gray-500 hover:text-orange-600 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="text-center mb-8 lg:hidden">
              <div className="inline-flex items-center gap-2 mb-4">
                <Logo size="md" />
                <span className="font-sora font-bold text-2xl text-gray-900">Mani AI</span>
              </div>
            </div>

            <h2 className="font-sora text-3xl font-bold text-gray-900 mb-2">
              {isLogin ? 'Welcome back' : 'Create account'}
            </h2>
            <p className="text-gray-500 mb-8">
              {isLogin
                ? 'Enter your credentials to access your account'
                : 'Start your journey with Mani AI today'}
            </p>

            {/* Google Auth */}
            <button
              onClick={handleGoogleAuth}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-white border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or continue with email</span>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="block text-sm text-gray-600 mb-2">Full Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Alex Chen"
                      className="input-field pl-11 bg-orange-50 border-orange-200 text-gray-800 placeholder-gray-400 focus:border-primary"
                      required={!isLogin}
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </motion.div>
              )}

              <div>
                <label className="block text-sm text-gray-600 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="input-field pl-11 bg-orange-50 border-orange-200 text-gray-800 placeholder-gray-400 focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="input-field pl-11 pr-11 bg-orange-50 border-orange-200 text-gray-800 placeholder-gray-400 focus:border-primary"
                    required
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {isLogin && (
                <div className="flex items-center justify-end">
                  <button type="button" className="text-sm text-orange-600 hover:text-orange-700 transition-colors font-medium">
                    Forgot password?
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <Sparkles className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-gray-500 mt-6">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-orange-600 hover:text-orange-700 font-medium transition-colors"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Auth;