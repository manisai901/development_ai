import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Bell,
  Shield,
  Palette,
  Key,
  Globe,
  Smartphone,
  Monitor,
  Save,
  Camera,
  Moon,
  Sun,
  ChevronRight,
  Check,
  AlertCircle,
} from 'lucide-react';

interface SettingsProps {
  onNavigate?: (page: string) => void;
}

interface SettingSection {
  id: string;
  title: string;
  icon: React.ReactNode;
}

const Settings: React.FC<SettingsProps> = ({ onNavigate }) => {
  const [activeSection, setActiveSection] = useState('profile');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    sms: false,
  });
  const [isSaving, setIsSaving] = useState(false);

  const sections: SettingSection[] = [
    { id: 'profile', title: 'Profile', icon: <User className="w-5 h-5" /> },
    { id: 'appearance', title: 'Appearance', icon: <Palette className="w-5 h-5" /> },
    { id: 'notifications', title: 'Notifications', icon: <Bell className="w-5 h-5" /> },
    { id: 'security', title: 'Security', icon: <Shield className="w-5 h-5" /> },
    { id: 'api', title: 'API Settings', icon: <Key className="w-5 h-5" /> },
  ];

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => setIsSaving(false), 1500);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-sora text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
            <nav className="space-y-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    activeSection === section.id
                      ? 'bg-primary/10 text-orange-600 border border-primary/20'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                  <ChevronRight className={`w-4 h-4 ml-auto transition-transform ${
                    activeSection === section.id ? 'rotate-90' : ''
                  }`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm"
          >
            {activeSection === 'profile' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-semibold text-gray-900 mb-4">Profile Settings</h2>
                  <p className="text-gray-500 text-sm">Update your personal information</p>
                </div>

                {/* Avatar */}
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-r from-primary to-accent flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">A</span>
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 rounded-full bg-white border border-orange-200 hover:bg-orange-50 transition-colors shadow-sm">
                      <Camera className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Profile Photo</h3>
                    <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max 2MB</p>
                    <button className="text-sm text-orange-600 hover:text-orange-700 mt-2 font-medium">
                      Change photo
                    </button>
                  </div>
                </div>

                {/* Form */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">First Name</label>
                    <input
                      type="text"
                      defaultValue="Alex"
                      className="input-field bg-orange-50 border-orange-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Last Name</label>
                    <input
                      type="text"
                      defaultValue="Chen"
                      className="input-field bg-orange-50 border-orange-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm text-gray-600 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="alex@mani.ai"
                      className="input-field bg-orange-50 border-orange-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Company</label>
                    <input
                      type="text"
                      defaultValue="TechCorp"
                      className="input-field bg-orange-50 border-orange-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-2">Role</label>
                    <input
                      type="text"
                      defaultValue="Senior Developer"
                      className="input-field bg-orange-50 border-orange-200 text-gray-800 placeholder-gray-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-4 border-t border-orange-100">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                    {isSaving ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full"
                      />
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button className="btn-secondary">Cancel</button>
                </div>
              </div>
            )}

            {activeSection === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-semibold text-gray-900 mb-4">Appearance</h2>
                  <p className="text-gray-500 text-sm">Customize how Mani AI looks</p>
                </div>

                {/* Theme */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-4">Theme</h3>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <button
                      onClick={() => setIsDarkMode(true)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        isDarkMode
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <Moon className="w-6 h-6 text-primary mb-2" />
                      <p className="text-gray-900 font-medium">Dark</p>
                      <p className="text-xs text-gray-500 mt-1">Easy on the eyes</p>
                    </button>
                    <button
                      onClick={() => setIsDarkMode(false)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        !isDarkMode
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <Sun className="w-6 h-6 text-amber-500 mb-2" />
                      <p className="text-gray-900 font-medium">Light</p>
                      <p className="text-xs text-gray-500 mt-1">Bright and clean</p>
                    </button>
                    <button className="p-4 rounded-xl border-2 border-gray-200 hover:border-orange-200 transition-all">
                      <Monitor className="w-6 h-6 text-gray-500 mb-2" />
                      <p className="text-gray-900 font-medium">System</p>
                      <p className="text-xs text-gray-500 mt-1">Match device</p>
                    </button>
                  </div>
                </div>

                {/* Accent Color */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-4">Accent Color</h3>
                  <div className="flex gap-3">
                    {['#F97316', '#FBBF24', '#10B981', '#3B82F6', '#EF4444'].map((color) => (
                      <button
                        key={color}
                        className="w-10 h-10 rounded-full border-2 border-transparent hover:scale-110 transition-transform"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>

                {/* Font Size */}
                <div>
                  <h3 className="text-gray-900 font-medium mb-4">Font Size</h3>
                  <input
                    type="range"
                    min="12"
                    max="20"
                    defaultValue="16"
                    className="w-full"
                  />
                </div>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-semibold text-gray-900 mb-4">Notifications</h2>
                  <p className="text-gray-500 text-sm">Configure how you receive notifications</p>
                </div>

                <div className="space-y-4">
                  {[
                    { key: 'email', label: 'Email Notifications', desc: 'Receive updates via email' },
                    { key: 'push', label: 'Push Notifications', desc: 'Get instant alerts in browser' },
                    { key: 'sms', label: 'SMS Notifications', desc: 'Receive text messages' },
                  ].map((item) => (
                    <div
                      key={item.key}
                      className="flex items-center justify-between p-4 rounded-xl bg-orange-50 border border-orange-100"
                    >
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-gray-900 font-medium">{item.label}</p>
                          <p className="text-sm text-gray-500">{item.desc}</p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications((prev) => ({
                            ...prev,
                            [item.key]: !prev[item.key as keyof typeof prev],
                          }))
                        }
                        className={`relative w-12 h-6 rounded-full transition-colors ${
                          notifications[item.key as keyof typeof notifications]
                            ? 'bg-primary'
                            : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                            notifications[item.key as keyof typeof notifications]
                              ? 'translate-x-7'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-orange-100">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Preferences
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-semibold text-gray-900 mb-4">Security</h2>
                  <p className="text-gray-500 text-sm">Keep your account secure</p>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-5 h-5 text-green-500" />
                        <div>
                          <p className="text-gray-900 font-medium">Two-Factor Authentication</p>
                          <p className="text-sm text-gray-500">Add an extra layer of security</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 rounded-full bg-green-50 text-green-600 text-sm font-medium border border-green-200">
                        Enabled
                      </span>
                    </div>
                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                      Manage 2FA
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Key className="w-5 h-5 text-primary" />
                        <div>
                          <p className="text-gray-900 font-medium">Password</p>
                          <p className="text-sm text-gray-500">Last changed 30 days ago</p>
                        </div>
                      </div>
                      <button className="btn-secondary text-sm py-2">Change</button>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-accent" />
                        <div>
                          <p className="text-gray-900 font-medium">Active Sessions</p>
                          <p className="text-sm text-gray-500">3 devices currently logged in</p>
                        </div>
                      </div>
                      <button className="text-sm text-red-500 hover:text-red-600 font-medium">
                        Sign out all
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'api' && (
              <div className="space-y-6">
                <div>
                  <h2 className="font-sora text-xl font-semibold text-gray-900 mb-4">API Settings</h2>
                  <p className="text-gray-500 text-sm">Manage your API keys and integrations</p>
                </div>

                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-900 font-medium">API Key</p>
                      <p className="text-sm text-gray-500">Use this key to authenticate API requests</p>
                    </div>
                    <button className="text-sm text-orange-600 hover:text-orange-700 font-medium">Regenerate</button>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      readOnly
                      value="sk-mani-xxxxxxxxxxxxxxxxxxxxxxxx"
                      className="input-field flex-1 bg-white border-orange-200 text-gray-800"
                    />
                    <button className="btn-secondary">Copy</button>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-gray-900 font-medium">Webhook URL</p>
                      <p className="text-sm text-gray-500">Receive real-time event notifications</p>
                    </div>
                  </div>
                  <input
                    type="url"
                    placeholder="https://your-domain.com/webhook"
                    className="input-field w-full bg-white border-orange-200 text-gray-800 placeholder-gray-400"
                  />
                </div>

                <div className="pt-4 border-t border-orange-100">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save API Settings
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;