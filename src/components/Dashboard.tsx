import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Cpu,
  Hash,
  Activity,
  TrendingUp,
  TrendingDown,
  Calendar,
  Download,
  Filter,
  RefreshCw,
} from 'lucide-react';

interface DashboardProps {
  onNavigate?: (page: string) => void;
}

// Chart colors - warm orange palette
const COLORS = ['#F97316', '#FBBF24', '#F59E0B', '#FB923C', '#FCD34D', '#FDE68A'];

// Mock data
const lineChartData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 800 },
  { name: 'May', value: 700 },
  { name: 'Jun', value: 900 },
  { name: 'Jul', value: 1100 },
];

const barChartData = [
  { name: 'Mon', chats: 120, sessions: 80 },
  { name: 'Tue', chats: 150, sessions: 100 },
  { name: 'Wed', chats: 180, sessions: 120 },
  { name: 'Thu', chats: 200, sessions: 140 },
  { name: 'Fri', chats: 220, sessions: 160 },
  { name: 'Sat', chats: 160, sessions: 100 },
  { name: 'Sun', chats: 140, sessions: 90 },
];

const pieChartData = [
  { name: 'Coding', value: 45 },
  { name: 'Analytics', value: 30 },
  { name: 'Chat', value: 15 },
  { name: 'Other', value: 10 },
];

const areaChartData = [
  { name: 'Week 1', tokens: 4000 },
  { name: 'Week 2', tokens: 6000 },
  { name: 'Week 3', tokens: 8000 },
  { name: 'Week 4', tokens: 10000 },
];

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  change: string;
  changeType: 'up' | 'down';
  delay?: number;
}> = ({ icon, label, value, change, changeType, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100"
  >
    <div className="flex items-start justify-between">
      <div className="p-3 rounded-xl bg-gradient-to-br from-orange-100 to-amber-100">
        {icon}
      </div>
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
        changeType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'
      }`}>
        {changeType === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {change}
      </div>
    </div>
    <div className="mt-4">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-3xl font-sora font-bold text-gray-900">{value}</p>
    </div>
  </motion.div>
);

const ChartCard: React.FC<{
  title: string;
  children: React.ReactNode;
  delay?: number;
}> = ({ title, children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white p-6 rounded-2xl shadow-sm border border-orange-100"
  >
    <div className="flex items-center justify-between mb-6">
      <h3 className="font-sora font-semibold text-gray-900">{title}</h3>
      <button className="p-2 rounded-lg bg-orange-50 text-gray-500 hover:text-orange-600 hover:bg-orange-100 transition-colors">
        <Filter className="w-4 h-4" />
      </button>
    </div>
    {children}
  </motion.div>
);

// Simple custom line chart component
const SimpleLineChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  const minValue = Math.min(...data.map(d => d.value));
  const range = maxValue - minValue;

  return (
    <div className="h-72 flex items-end justify-between gap-2 px-4">
      {data.map((item, i) => {
        const height = range > 0 ? ((item.value - minValue) / range) * 100 : 50;
        return (
          <motion.div
            key={item.name}
            initial={{ height: 0 }}
            animate={{ height: `${Math.max(height, 10)}%` }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex-1 relative"
          >
            <div
              className="w-full bg-gradient-to-t from-orange-400 to-amber-400 rounded-t-lg"
              style={{ height: '100%' }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
              {item.name}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Simple custom bar chart component
const SimpleBarChart: React.FC<{ data: { name: string; chats: number; sessions: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => Math.max(d.chats, d.sessions)));

  return (
    <div className="h-72 flex items-end justify-between gap-2 px-4">
      {data.map((item, i) => {
        const chatsHeight = (item.chats / maxValue) * 100;
        const sessionsHeight = (item.sessions / maxValue) * 100;
        return (
          <motion.div
            key={item.name}
            initial={{ height: 0 }}
            animate={{ height: '100%' }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex-1 flex items-end gap-1"
          >
            <div
              className="w-1/2 bg-gradient-to-t from-orange-400 to-amber-400 rounded-t-sm"
              style={{ height: `${chatsHeight}%` }}
            />
            <div
              className="w-1/2 bg-gradient-to-t from-amber-400 to-yellow-400 rounded-t-sm"
              style={{ height: `${sessionsHeight}%` }}
            />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-gray-400">
              {item.name}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

// Simple pie chart component
const SimplePieChart: React.FC<{ data: { name: string; value: number }[] }> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90;

  return (
    <div className="h-72 flex items-center justify-center">
      <div className="relative w-48 h-48">
        <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
          {data.map((item, i) => {
            const percentage = (item.value / total) * 100;
            const angle = (percentage / 100) * 360;
            const startAngle = currentAngle;
            const endAngle = currentAngle + angle;
            currentAngle = endAngle;

            const startRad = (startAngle * Math.PI) / 180;
            const endRad = (endAngle * Math.PI) / 180;

            const x1 = 50 + 50 * Math.cos(startRad);
            const y1 = 50 + 50 * Math.sin(startRad);
            const x2 = 50 + 50 * Math.cos(endRad);
            const y2 = 50 + 50 * Math.sin(endRad);

            const largeArc = percentage > 50 ? 1 : 0;

            const path = `M 50 50 L ${x1} ${y1} A 50 50 0 ${largeArc} 1 ${x2} ${y2} Z`;

            return (
              <motion.path
                key={item.name}
                d={path}
                fill={COLORS[i % COLORS.length]}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="hover:opacity-80 transition-opacity cursor-pointer"
              />
            );
          })}
          <circle cx="50" cy="50" r="25" fill="#FFFBEB" />
        </svg>
      </div>
    </div>
  );
};

// Simple area chart component
const SimpleAreaChart: React.FC<{ data: { name: string; tokens: number }[] }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.tokens));
  const minValue = Math.min(...data.map(d => d.tokens));
  const range = maxValue - minValue;

  const points = data.map((item, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((item.tokens - minValue) / range) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="h-72 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="areaGradientOrange" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.polygon
          points={`0,100 ${points} 100,100`}
          fill="url(#areaGradientOrange)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        />
        <motion.polyline
          points={points}
          fill="none"
          stroke="#FBBF24"
          strokeWidth="0.5"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        />
        {data.map((item, i) => {
          const x = (i / (data.length - 1)) * 100;
          const y = 100 - ((item.tokens - minValue) / range) * 80 - 10;
          return (
            <motion.circle
              key={item.name}
              cx={x}
              cy={y}
              r="1.5"
              fill="#FBBF24"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          );
        })}
      </svg>
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-4 text-xs text-gray-400">
        {data.map((item) => (
          <span key={item.name}>{item.name}</span>
        ))}
      </div>
    </div>
  );
};

const Dashboard: React.FC<DashboardProps> = ({ onNavigate }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-sora text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back, Alex</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-orange-100 shadow-sm">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600">Last 30 days</span>
          </div>
          <button
            onClick={handleRefresh}
            className={`p-3 rounded-xl bg-white border border-orange-100 text-gray-500 hover:text-orange-600 transition-all shadow-sm ${
              isRefreshing ? 'animate-spin' : ''
            }`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<MessageSquare className="w-6 h-6 text-primary" />}
          label="Total Chats"
          value="12,847"
          change="+12%"
          changeType="up"
          delay={0.1}
        />
        <StatCard
          icon={<Cpu className="w-6 h-6 text-accent" />}
          label="AI Usage"
          value="89%"
          change="+5%"
          changeType="up"
          delay={0.2}
        />
        <StatCard
          icon={<Hash className="w-6 h-6 text-primary" />}
          label="Tokens Used"
          value="2.4M"
          change="+18%"
          changeType="up"
          delay={0.3}
        />
        <StatCard
          icon={<Activity className="w-6 h-6 text-accent" />}
          label="Active Sessions"
          value="847"
          change="-3%"
          changeType="down"
          delay={0.4}
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Line Chart */}
        <ChartCard title="AI Usage Over Time" delay={0.5}>
          <SimpleLineChart data={lineChartData} />
        </ChartCard>

        {/* Bar Chart */}
        <ChartCard title="Chats vs Sessions" delay={0.6}>
          <SimpleBarChart data={barChartData} />
          <div className="flex justify-center gap-6 mt-8 pt-4 border-t border-orange-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-primary" />
              <span className="text-sm text-gray-500">Chats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-accent" />
              <span className="text-sm text-gray-500">Sessions</span>
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <ChartCard title="Usage Distribution" delay={0.7}>
          <SimplePieChart data={pieChartData} />
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {pieChartData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <span className="text-sm text-gray-500">{entry.name}</span>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Area Chart */}
        <ChartCard title="Token Usage (Weekly)" delay={0.8}>
          <SimpleAreaChart data={areaChartData} />
        </ChartCard>

        {/* Quick Stats */}
        <ChartCard title="Quick Stats" delay={0.9}>
          <div className="space-y-4">
            {[
              { label: 'Avg Response Time', value: '124ms', icon: <Activity className="w-4 h-4" /> },
              { label: 'Success Rate', value: '99.8%', icon: <TrendingUp className="w-4 h-4" /> },
              { label: 'API Calls Today', value: '45.2K', icon: <Cpu className="w-4 h-4" /> },
              { label: 'Cost Savings', value: '$2.4K', icon: <TrendingDown className="w-4 h-4" /> },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="flex items-center justify-between p-4 rounded-xl bg-orange-50 border border-orange-100"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-100 text-primary">
                    {stat.icon}
                  </div>
                  <span className="text-sm text-gray-600">{stat.label}</span>
                </div>
                <span className="font-sora font-semibold text-gray-900">{stat.value}</span>
              </motion.div>
            ))}
          </div>
        </ChartCard>
      </div>
    </div>
  );
};

export default Dashboard;