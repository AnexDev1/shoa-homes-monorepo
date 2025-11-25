import { useQuery } from '@tanstack/react-query';
import { dashboardAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import { Users, Home, Clock } from 'lucide-react';

const AgentDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['agent-dashboard-stats'],
    queryFn: () => dashboardAPI.getAgentStats(),
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
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Active Listings',
      value: stats?.activeListings || 0,
      icon: Home,
      color: 'bg-green-500',
    },
    {
      title: 'Upcoming Appointments',
      value: stats?.upcomingAppointments || 0,
      icon: Clock,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agent Dashboard</h1>
        <p className="mt-1 text-sm text-gray-600">
          {`Welcome back! Here's what's happening with your business today.`}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="overflow-hidden rounded-lg bg-white shadow"
          >
            <div className="p-5">
              <div className="flex items-center">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-md ${stat.color} text-white`}
                >
                  <stat.icon className="h-6 w-6" />
                </div>
                <div className="ml-5">
                  <p className="text-sm font-medium text-gray-500">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          Recent Activity
        </h2>
        <div className="overflow-hidden rounded-lg bg-white shadow">
          <div className="p-6">
            {stats?.recentActivities?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {stats.recentActivities.map((activity, index) => (
                  <li key={index} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {activity.description}
                        </p>
                        <p className="mt-1 text-xs text-gray-400">
                          {activity.timeAgo}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-sm text-gray-500">
                No recent activities found.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
