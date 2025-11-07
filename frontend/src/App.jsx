import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';

// Client Pages
import LandingPage from './pages/client/LandingPage';
import PropertyListingPage from './pages/client/PropertyListingPage';
import PropertyDetailPage from './pages/client/PropertyDetailPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import PropertyManagement from './pages/admin/PropertyManagement';
import InquiryManagement from './pages/admin/InquiryManagement';
import SettingsPage from './pages/admin/SettingsPage';

// Protected Route Component
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="properties" element={<PropertyListingPage />} />
          <Route path="properties/:id" element={<PropertyDetailPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="properties" element={<PropertyManagement />} />
          <Route path="inquiries" element={<InquiryManagement />} />
          <Route path="settings" element={<SettingsPage />} />
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
    </Router>
  );
}

export default App;
