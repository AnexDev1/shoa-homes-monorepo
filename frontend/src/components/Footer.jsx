const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img
                src="/images/logo.png"
                alt="Shoa Homes Logo"
                className="w-10 h-10 object-contain"
              />
              <span className="text-xl font-bold">Shoa Homes</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your trusted partner in finding the perfect property in Ethiopia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="/properties"
                  className="hover:text-white transition-colors"
                >
                  Properties
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-white transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#contact"
                  className="hover:text-white transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Property Types</h3>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a
                  href="/properties?type=apartment"
                  className="hover:text-white transition-colors"
                >
                  Apartments
                </a>
              </li>
              <li>
                <a
                  href="/properties?type=house"
                  className="hover:text-white transition-colors"
                >
                  Houses
                </a>
              </li>
              <li>
                <a
                  href="/properties?type=villa"
                  className="hover:text-white transition-colors"
                >
                  Villas
                </a>
              </li>
              <li>
                <a
                  href="/properties?type=commercial"
                  className="hover:text-white transition-colors"
                >
                  Commercial
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>📍 Addis Ababa, Ethiopia</li>
              <li>📞 +251 11 123 4567</li>
              <li>✉️ info@shoahomes.com</li>
              <li className="flex space-x-4 pt-2">
                <a href="#" className="hover:text-white transition-colors">
                  Facebook
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Twitter
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Shoa Homes Real Estate PLC. All
            rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
