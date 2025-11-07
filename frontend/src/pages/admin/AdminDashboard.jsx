import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Home, CheckCircle, Mail, Users, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardAPI.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Properties',
      value: stats?.totalProperties || 0,
      icon: Home,
      color: 'bg-blue-500',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Active Listings',
      value: stats?.activeListings || 0,
      icon: CheckCircle,
      color: 'bg-green-500',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Inquiries',
      value: stats?.totalInquiries || 0,
      icon: Mail,
      color: 'bg-purple-500',
      change: '+24%',
      trend: 'up',
    },
    {
      title: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-orange-500',
      change: '+5%',
      trend: 'up',
    },
  ];

  const monthlyData = [
    { name: 'Jan', listings: 40, inquiries: 24 },
    { name: 'Feb', listings: 30, inquiries: 18 },
    { name: 'Mar', listings: 50, inquiries: 35 },
    { name: 'Apr', listings: 45, inquiries: 30 },
    { name: 'May', listings: 60, inquiries: 42 },
    { name: 'Jun', listings: 55, inquiries: 38 },
  ];

  const propertyTypeData = [
    { name: 'Apartment', value: 45 },
    { name: 'House', value: 30 },
    { name: 'Villa', value: 15 },
    { name: 'Commercial', value: 10 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600">Welcome back! Here's your overview</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center text-white`}>
                  <IconComponent className="w-6 h-6" />
                </div>
                <span className={`${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} text-sm font-semibold flex items-center gap-1`}>
                  <TrendIcon className="w-4 h-4" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
              <p className="text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Monthly Trends</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="listings"
                stroke="#0ea5e9"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="inquiries"
                stroke="#a855f7"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Property Types */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Properties by Type</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={propertyTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { action: 'New inquiry received', property: 'Luxury Villa in Bole', time: '2 hours ago' },
            { action: 'Property listed', property: 'Modern Apartment in Kirkos', time: '5 hours ago' },
            { action: 'Property sold', property: 'Commercial Building', time: '1 day ago' },
            { action: 'New user registered', property: 'John Doe', time: '2 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <div>
                <p className="font-semibold">{activity.action}</p>
                <p className="text-sm text-gray-600">{activity.property}</p>
              </div>
              <span className="text-sm text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
