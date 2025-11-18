import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Award,
  Gem,
  MapPin,
  Handshake,
  Star,
  Phone,
  ChevronRight,
  Search,
} from 'lucide-react';
import {
  whyChooseUs,
  mockTestimonials,
  companyStats,
} from '../../data/mockData';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const LandingPage = () => {
  const [scrolled, setScrolled] = useState(false);
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    type: '',
    priceRange: '',
  });
  const navigate = useNavigate();

  // Fetch featured properties
  const {
    data: featuredProperties = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => propertiesAPI.getAll({ featured: true, limit: 6 }),
    select: (data) => data.data || [],
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchFilterChange = (field, value) => {
    setSearchFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchFilters.location) {
      params.set('location', searchFilters.location);
    }

    if (searchFilters.type) {
      params.set('type', searchFilters.type.toLowerCase());
    }

    // Convert price range to min/max
    if (searchFilters.priceRange) {
      switch (searchFilters.priceRange) {
        case 'Under 5M ETB':
          params.set('priceMax', '5000000');
          break;
        case '5M - 15M ETB':
          params.set('priceMin', '5000000');
          params.set('priceMax', '15000000');
          break;
        case '15M - 30M ETB':
          params.set('priceMin', '15000000');
          params.set('priceMax', '30000000');
          break;
        case '30M+ ETB':
          params.set('priceMin', '30000000');
          break;
      }
    }

    navigate(`/properties?${params.toString()}`);
  };

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
              Discover luxury properties, modern apartments, and premium
              commercial spaces with Ethiopia&apos;s most trusted real estate
              partner
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
              value={searchFilters.location}
              onChange={(e) =>
                handleSearchFilterChange('location', e.target.value)
              }
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors"
            />
            <select
              value={searchFilters.type}
              onChange={(e) => handleSearchFilterChange('type', e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors"
            >
              <option value="">Property Type</option>
              <option value="Apartment">Apartment</option>
              <option value="House">House</option>
              <option value="Villa">Villa</option>
              <option value="Condo">Condo</option>
              <option value="Commercial">Commercial</option>
            </select>
            <select
              value={searchFilters.priceRange}
              onChange={(e) =>
                handleSearchFilterChange('priceRange', e.target.value)
              }
              className="px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors"
            >
              <option value="">Price Range</option>
              <option value="Under 5M ETB">Under 5M ETB</option>
              <option value="5M - 15M ETB">5M - 15M ETB</option>
              <option value="15M - 30M ETB">15M - 30M ETB</option>
              <option value="30M+ ETB">30M+ ETB</option>
            </select>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-gradient-to-r from-navy-700 to-navy-900 text-white font-semibold rounded-lg hover:from-navy-600 hover:to-navy-800 transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Search className="h-4 w-4" />
              Search Properties
            </button>
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

          {isLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              Error loading featured properties. Please try again later.
            </div>
          ) : featuredProperties.length > 0 ? (
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
          ) : (
            <div className="text-center py-12 text-gray-500">
              No featured properties available at the moment.
            </div>
          )}

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
            Your Trusted Real Estate Partner
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            We combine local expertise with world-class service to deliver
            exceptional results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUs.map((item, index) => {
            const iconMap = {
              Award: Award,
              Gem: Gem,
              MapPin: MapPin,
              Handshake: Handshake,
            };
            const IconComponent = iconMap[item.icon];

            return (
              <div
                key={index}
                className="group p-8 rounded-2xl bg-white border-2 border-gray-100 hover:border-gold-400 hover:shadow-premium transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center mb-6 transform group-hover:scale-110 transition-transform duration-300">
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900 group-hover:text-gold-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            );
          })}
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
                    <Star
                      key={i}
                      className="w-5 h-5 text-gold-400 fill-gold-400"
                    />
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
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold rounded-lg hover:from-gold-400 hover:to-gold-500 transform hover:scale-105 transition-all duration-300 shadow-premium flex items-center gap-2"
            >
              Browse Properties
              <ChevronRight className="w-5 h-5" />
            </Link>
            <a
              href="tel:+251911000000"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call Us Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
