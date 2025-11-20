import { Link } from 'react-router-dom';
import {
  mockProperties,
  whyChooseUs,
  mockTestimonials,
  companyStats,
} from '../../data/mockData';
import PropertyCard from '../../components/PropertyCard';

const LandingPage = () => {
  const featuredProperties = mockProperties
    .filter((p) => p.featured)
    .slice(0, 7);

  return (
    <div className="overflow-hidden">
      {/* Hero Section with Background */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage:
                'url(https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&q=80)',
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy-900/95 via-navy-800/90 to-navy-900/95" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
        </div>

        {/* Hero Content */}
        <div className="container-custom relative z-10 py-20">
          <div className="max-w-4xl mx-auto text-center text-white">
            <div className="animate-slide-down">
              <span className="inline-block px-4 py-2 mb-6 text-sm font-semibold tracking-wider text-gold-400 bg-gold-400/10 border border-gold-400/30 rounded-full backdrop-blur-sm">
                ✨ PREMIUM REAL ESTATE IN ETHIOPIA
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 leading-tight animate-slide-up">
              Find Your Dream Home in{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 to-gold-500">
                Addis Ababa
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-10 text-gray-200 max-w-3xl mx-auto animate-fade-in">
              Discover modern, affordable homes with Ethiopia&apos;s most
              trusted real estate developer. With 60+ years of Shoa legacy, we
              build communities where families belong.
            </p>

            <div className="flex flex-wrap justify-center gap-4 animate-fade-in">
              <Link
                to="/properties"
                className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold rounded-lg hover:from-gold-400 hover:to-gold-500 transform hover:scale-105 transition-all duration-300 shadow-premium"
              >
                Browse Properties
              </Link>
              <a
                href="#featured"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transform hover:scale-105 transition-all duration-300"
              >
                View Featured
              </a>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="flex flex-col items-center text-white/60">
            <span className="text-xs mb-2">Scroll Down</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </div>
      </section>

      {/* Quick Search Card */}
      <section className="container-custom -mt-16 relative z-20">
        <div className="bg-white rounded-2xl shadow-premium-lg p-8 border border-gray-100">
          <h3 className="text-2xl font-bold mb-6 text-navy-800">
            Find Your Perfect Property
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Location (e.g., Bole, CMC)..."
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors"
            />
            <select className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors">
              <option>Property Type</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Condo</option>
              <option>Commercial</option>
            </select>
            <select className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors">
              <option>Price Range</option>
              <option>Under 5M ETB</option>
              <option>5M - 15M ETB</option>
              <option>15M - 30M ETB</option>
              <option>30M+ ETB</option>
            </select>
            <Link
              to="/properties"
              className="px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 text-white font-semibold rounded-lg hover:from-navy-600 hover:to-navy-800 transition-all duration-300 text-center"
            >
              Search Properties
            </Link>
          </div>
        </div>
      </section>

      {/* Company Stats */}
      <section className="container-custom py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {companyStats.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-navy-700 to-gold-600 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section
        id="featured"
        className="bg-gradient-to-b from-gray-50 to-white py-20"
      >
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-gold-600 bg-gold-50 rounded-full">
              HANDPICKED FOR YOU
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
              Featured Properties
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Discover our carefully selected premium properties in the best
              locations of Addis Ababa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredProperties.map((property, index) => (
              <div
                key={property.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <PropertyCard property={property} />
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-8 py-4 bg-navy-800 text-white font-semibold rounded-lg hover:bg-navy-700 transition-all duration-300 transform hover:scale-105"
            >
              View All Properties
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container-custom py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-navy-600 bg-navy-50 rounded-full">
            WHY SHOA HOMES
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
            Why Choose Shoa Homes
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Experience the difference of working with Ethiopia&apos;s premier
            real estate developer, backed by 60+ years of excellence and
            innovation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => (
            <div
              key={index}
              className="group p-8 rounded-2xl bg-white border-2 border-gray-100 hover:border-gold-400 hover:shadow-premium transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-navy-900 group-hover:text-gold-600 transition-colors">
                {item.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About Us */}
      <section id="about" className="container-custom py-20 bg-gray-50">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-navy-600 bg-navy-50 rounded-full">
            ABOUT SHOA HOMES
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
            Ethiopia&apos;s Premier Real Estate Developer
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            With over 60 years of Shoa brand legacy, we deliver high-quality,
            sustainable, modern, and affordable housing solutions across Addis
            Ababa.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Company Overview */}
          <div className="bg-white p-8 rounded-2xl shadow-premium">
            <h3 className="text-2xl font-bold mb-4 text-navy-900">Our Story</h3>
            <p className="text-gray-600 mb-4">
              Shoa Homes is a proudly Ethiopian real estate company delivering
              high-quality, sustainable, modern, and affordable housing
              solutions. The company extends over 60+ years of the Shoa brand
              legacy, rooted in integrity, quality, and community trust.
            </p>
            <p className="text-gray-600">
              From our humble beginnings with Shoa Supermarket in 1957, through
              landmark developments like the Piassa Somali Tera Haji Buser
              Building, to our first residential project in Bole Bulbula (Mariam
              Mazoriya), we now develop multiple sites across Addis Ababa,
              including our 44,000 sq.m flagship project.
            </p>
          </div>

          {/* CEO Message */}
          <div className="bg-white p-8 rounded-2xl shadow-premium">
            <h3 className="text-2xl font-bold mb-4 text-navy-900">
              CEO Message
            </h3>
            <p className="text-gray-600 italic mb-4">
              &ldquo;At Shoa Homes, the goal is to build modern, affordable
              communities where families truly belong. Every project is rooted
              in excellence, integrity, long-term value, and community-focused
              development.&rdquo;
            </p>
            <p className="text-gray-600">
              We are committed to delivering timely, sustainable, and
              client-centered real estate solutions while creating lasting value
              for clients, partners, and communities.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Vision & Mission */}
          <div className="bg-white p-8 rounded-2xl shadow-premium">
            <h3 className="text-2xl font-bold mb-4 text-navy-900">
              Vision & Mission
            </h3>
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gold-600 mb-2">
                Our Mission
              </h4>
              <p className="text-gray-600">
                Deliver timely, sustainable, and client-centered real estate
                solutions while creating lasting value for clients, partners,
                and communities.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gold-600 mb-2">
                Our Vision
              </h4>
              <p className="text-gray-600">
                Become a national real estate leader known for modern,
                affordable, and high-quality living spaces.
              </p>
            </div>
          </div>

          {/* Core Values */}
          <div className="bg-white p-8 rounded-2xl shadow-premium">
            <h3 className="text-2xl font-bold mb-4 text-navy-900">
              Core Values
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-navy-900">Integrity</h4>
                  <p className="text-gray-600 text-sm">
                    Honest, transparent operations
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-navy-900">Quality</h4>
                  <p className="text-gray-600 text-sm">
                    Excellence in every detail
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-navy-900">Innovation</h4>
                  <p className="text-gray-600 text-sm">
                    Modern solutions for tomorrow
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-navy-900">
                    Sustainability
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Building for future generations
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <h4 className="font-semibold text-navy-900">
                    Customer Focus
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Your needs drive our approach
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Projects */}
      <section className="container-custom py-20">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-gold-600 bg-gold-50 rounded-full">
            OUR PROJECTS
          </span>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
            Premier Developments Across Addis Ababa
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our portfolio of modern, sustainable residential projects
            designed for contemporary Ethiopian living.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Jackros Flagship Project */}
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-r from-navy-600 to-navy-800 flex items-center justify-center">
              <span className="text-white text-6xl">🏢</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Jackros Flagship Project
              </h3>
              <p className="text-gray-600 mb-4">
                44,000 m² mixed-use development with premium amenities
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• G+2 Villas</p>
                <p>• Main Gate Apartments</p>
                <p>• Central Apartments</p>
                <p>• High-rise buildings (up to 2B+G+17)</p>
                <p>• Commercial center, gym, cafeteria, library</p>
              </div>
              <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Delivered
              </div>
            </div>
          </div>

          {/* Bole Matemiya */}
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-r from-gold-500 to-gold-600 flex items-center justify-center">
              <span className="text-white text-6xl">🏗️</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Bole Matemiya
              </h3>
              <p className="text-gray-600 mb-4">
                Modern residential complex with comprehensive amenities
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• 2 Basement + 16 floors</p>
                <p>• Gym, cafeteria, generator</p>
                <p>• Underground parking</p>
              </div>
              <div className="mt-4 inline-block px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                Under Design
              </div>
            </div>
          </div>

          {/* Wello Sefer */}
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-r from-navy-500 to-navy-600 flex items-center justify-center">
              <span className="text-white text-6xl">🏢</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Wello Sefer (Near Peacock)
              </h3>
              <p className="text-gray-600 mb-4">
                High-rise residential tower with premium facilities
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• 3 Basement + 19 floors</p>
                <p>• Gym, cafeteria, generator</p>
                <p>• Underground parking</p>
              </div>
              <div className="mt-4 inline-block px-3 py-1 bg-orange-100 text-orange-800 text-xs font-semibold rounded-full">
                Ongoing
              </div>
            </div>
          </div>

          {/* Bisrate Gabriel */}
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <span className="text-white text-6xl">🏠</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Bisrate Gabriel
              </h3>
              <p className="text-gray-600 mb-4">
                Contemporary residential building with modern amenities
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• 1 Basement + 14 floors</p>
                <p>• Gym, cafeteria, generator</p>
                <p>• Parking facilities</p>
              </div>
              <div className="mt-4 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                Under Construction
              </div>
            </div>
          </div>

          {/* Bulbula Site */}
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="h-48 bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-6xl">🏢</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Bulbula Site
              </h3>
              <p className="text-gray-600 mb-4">
                Our pioneering apartment project in Bole Bulbula
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• 1 Basement + 11 floors</p>
                <p>• First Shoa Homes apartment project</p>
                <p>• Modern residential units</p>
              </div>
              <div className="mt-4 inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full">
                Delivered
              </div>
            </div>
          </div>

          {/* Future Projects */}
          <div className="bg-white rounded-2xl shadow-premium overflow-hidden hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1 border-2 border-dashed border-gray-300">
            <div className="h-48 bg-gradient-to-r from-gray-400 to-gray-500 flex items-center justify-center">
              <span className="text-white text-6xl">🚀</span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Future Developments
              </h3>
              <p className="text-gray-600 mb-4">
                Expanding to new city-center sites for 10,000+ households
              </p>
              <div className="space-y-2 text-sm text-gray-500">
                <p>• Smart housing integration</p>
                <p>• Sustainability focus</p>
                <p>• National partnerships</p>
                <p>• Strategic expansion</p>
              </div>
              <div className="mt-4 inline-block px-3 py-1 bg-gray-100 text-gray-800 text-xs font-semibold rounded-full">
                Coming Soon
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products & Services */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-navy-600 bg-navy-50 rounded-full">
              OUR OFFERINGS
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
              Diverse Portfolio for Every Lifestyle
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              From functional studios to luxurious penthouses, we offer modern,
              affordable homes designed for contemporary Ethiopian living.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Apartments */}
            <div className="bg-white p-6 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-6xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-3 text-navy-900">
                Apartments
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 1 Bedroom - Functional, fully equipped</p>
                <p>• 2 Bedroom - Modern design, full amenities</p>
                <p>• 3 Bedroom - Spacious, family-friendly</p>
              </div>
            </div>

            {/* Villas */}
            <div className="bg-white p-6 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-xl font-bold mb-3 text-navy-900">Villas</h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• 175 m² villas (3 stories)</p>
                <p>• 175 m² villas with basement</p>
                <p>• 200 m² villas with basement</p>
                <p>• Built with precision and quality</p>
              </div>
            </div>

            {/* Penthouses */}
            <div className="bg-white p-6 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-6xl mb-4">🏙️</div>
              <h3 className="text-xl font-bold mb-3 text-navy-900">
                Penthouses
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Elegant penthouse units</p>
                <p>• Premium finishing</p>
                <p>• Exclusive living spaces</p>
                <p>• Premium amenities</p>
              </div>
            </div>

            {/* Services */}
            <div className="bg-white p-6 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-6xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3 text-navy-900">
                Our Services
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p>• Site selection & planning</p>
                <p>• Quality construction</p>
                <p>• Client handover support</p>
                <p>• Long-term maintenance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-gradient-to-br from-navy-900 to-navy-800 py-20 text-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-gold-400 bg-gold-400/10 rounded-full border border-gold-400/30">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              What Our Clients Say
            </h2>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Real stories from real people who found their dream properties
              with us
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="p-8 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4 border-2 border-gold-400"
                  />
                  <div>
                    <h4 className="font-bold text-lg">{testimonial.name}</h4>
                    <p className="text-gray-400 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 text-gold-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 leading-relaxed">
                  &ldquo;{testimonial.text}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1920&q=80)',
          }}
        />
        <div className="absolute inset-0 bg-navy-900/90" />

        <div className="container-custom relative z-10 text-center text-white">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Let our expert team help you discover the perfect property that
            matches your lifestyle and budget
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/properties"
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold rounded-lg hover:from-gold-400 hover:to-gold-500 transform hover:scale-105 transition-all duration-300 shadow-premium"
            >
              Browse Properties
            </Link>
            <Link
              to="/login"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transform hover:scale-105 transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
