import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import AgentLayout from './layouts/AgentLayout';

// Client Pages
import LandingPage from './pages/client/LandingPage';
import PropertyListingPage from './pages/client/PropertyListingPage';
import PropertyDetailPage from './pages/client/PropertyDetailPage';
import AboutPage from './pages/client/AboutPage';
import ContactPage from './pages/client/ContactPage';
import LoginPage from './pages/auth/LoginPage';
import NewsEventsPage from './pages/client/NewsEventsPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyManagement from './pages/admin/PropertyManagement';
import CreateUser from './pages/admin/CreateUser';
import SettingsPage from './pages/admin/SettingsPage';

import AgentDashboard from './pages/agent/AgentDashboard';
import ClientsPage from './pages/agent/ClientsPage';
import AgentSettingsPage from './pages/agent/AgentSettingsPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if the current path is '/' and has a hash fragment
    if (location.pathname === '/' && location.hash === '#contact') {
      // Redirect to the contact page
      navigate('/contact', { replace: true });
    }
  }, [location, navigate]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="properties" element={<PropertyListingPage />} />
        <Route path="properties/:id" element={<PropertyDetailPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="news" element={<NewsEventsPage />} />
        <Route path="login" element={<LoginPage />} />
        {/* Registration removed — admins are pre-created */}
      </Route>

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="properties" element={<PropertyManagement />} />
        <Route path="create_user" element={<CreateUser />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Agent Routes */}
      <Route
        path="/agent"
        element={
          <ProtectedRoute allowedRoles={['AGENT']}>
            <AgentLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AgentDashboard />} />
        <Route path="clients" element={<ClientsPage />} />
        <Route path="settings" element={<AgentSettingsPage />} />
      </Route>

      {/* 404 Route */}
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-primary-600">404</h1>
              <p className="text-xl mt-4">Page not found</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
