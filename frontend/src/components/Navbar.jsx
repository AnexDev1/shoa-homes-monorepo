import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkClasses = (path) => {
    return isActive(path)
      ? 'text-navy-900 font-semibold border-b-2 border-gold-500 pb-1'
      : 'text-gray-700 hover:text-primary-600 transition-colors';
  };

  const mobileLinkClasses = (path) => {
    return isActive(path)
      ? 'block px-4 py-3 text-navy-900 font-semibold bg-gold-50 border-r-4 border-gold-500'
      : 'block px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors';
  };

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={handleLinkClick}
          >
            <img
              src="/images/logo.png"
              alt="Shoa Homes Logo"
              className="w-10 h-10 object-contain"
            />
            <span className="text-xl font-bold text-gray-900">Shoa Homes</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={linkClasses('/')}>
              Home
            </Link>
            <Link to="/properties" className={linkClasses('/properties')}>
              Properties
            </Link>
            <Link to="/about" className={linkClasses('/about')}>
              About
            </Link>
            <Link to="/contact" className={linkClasses('/contact')}>
              Contact
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                {user?.role === 'admin' && (
                  <Link to="/admin" className={linkClasses('/admin')}>
                    Dashboard
                  </Link>
                )}
                <button onClick={logout} className="btn-secondary text-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={linkClasses('/login')}>
                  Login
                </Link>
                {/* Registration disabled */}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg
              className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
            {/* Close icon */}
            <svg
              className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden border-t border-gray-200`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white">
            <Link
              to="/"
              className={mobileLinkClasses('/')}
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link
              to="/properties"
              className={mobileLinkClasses('/properties')}
              onClick={handleLinkClick}
            >
              Properties
            </Link>
            <Link
              to="/about"
              className={mobileLinkClasses('/about')}
              onClick={handleLinkClick}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={mobileLinkClasses('/contact')}
              onClick={handleLinkClick}
            >
              Contact
            </Link>

            {/* Mobile Auth Links */}
            <div className="border-t border-gray-200 pt-3 mt-3">
              {isAuthenticated ? (
                <>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      className={mobileLinkClasses('/admin')}
                      onClick={handleLinkClick}
                    >
                      Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left px-4 py-3 text-gray-700 hover:text-primary-600 hover:bg-gray-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className={mobileLinkClasses('/login')}
                  onClick={handleLinkClick}
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
