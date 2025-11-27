import { Outlet, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { Menu, X } from 'lucide-react';

const AdminLayout = () => {
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', path: '/admin', icon: '📊' },
    { name: 'Create User', path: '/admin/create_user', icon: '👤' },
    { name: 'Properties', path: '/admin/properties', icon: '🏠' },
    { name: 'Settings', path: '/admin/settings', icon: '⚙️' },
  ];

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Navigation */}
      <nav className="bg-white shadow-md">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden mr-4 p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {sidebarOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              <Link to="/" className="flex items-center space-x-2">
                <img
                  src="/images/logo.png"
                  alt="Shoa Homes Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                />
                <span className="text-lg sm:text-xl font-bold text-gray-900 hidden sm:block">
                  Shoa Homes Admin
                </span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 text-sm sm:text-base">
                Welcome, <span className="font-semibold">{user?.name}</span>
              </span>
              <button onClick={logout} className="btn-secondary text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-md min-h-screen lg:min-h-[calc(100vh-4rem)] transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          {/* Close button for mobile */}
          <div className="lg:hidden p-4 border-b">
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="p-4 space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)} // Close sidebar on mobile after navigation
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          <div className="max-w-full overflow-x-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
