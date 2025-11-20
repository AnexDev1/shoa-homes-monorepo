import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Home, CheckCircle, TrendingUp, TrendingDown } from 'lucide-react';
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
      <div className="flex items-center justify-center py-12 sm:py-20">
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
  ];

  const monthlyData = stats?.monthlyTrends || [];

  const propertyTypeData = stats?.propertyTypeBreakdown || [];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-600 text-sm sm:text-base">
          Welcome back! Here&apos;s your overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat, index) => {
          const IconComponent = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-4 sm:p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-3 sm:mb-4">
                <div
                  className={`${stat.color} w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-white`}
                >
                  <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <span
                  className={`${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'} text-xs sm:text-sm font-semibold flex items-center gap-1`}
                >
                  <TrendIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                  {stat.change}
                </span>
              </div>
              <h3 className="text-gray-600 text-xs sm:text-sm mb-1">
                {stat.title}
              </h3>
              <p className="text-2xl sm:text-3xl font-bold">{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
            Monthly Trends
          </h2>
          <ResponsiveContainer
            width="100%"
            height={250}
            className="text-xs sm:text-sm"
          >
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
              {/* inquiries line removed */}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Property Types */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
            Properties by Type
          </h2>
          <ResponsiveContainer
            width="100%"
            height={250}
            className="text-xs sm:text-sm"
          >
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
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">
          Recent Activity
        </h2>
        <div className="space-y-3 sm:space-y-4">
          {(stats?.recentActivity || []).map((activity, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b last:border-b-0 gap-2 sm:gap-0"
            >
              <div className="flex-1">
                <p className="font-semibold text-sm sm:text-base">
                  {activity.action}
                </p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {activity.property}
                </p>
              </div>
              <span className="text-xs sm:text-sm text-gray-500 sm:text-right">
                {new Date(activity.time).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
