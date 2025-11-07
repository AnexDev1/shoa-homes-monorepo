import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const LandingPage = () => {
  const { data: properties, isLoading } = useQuery({
    queryKey: ['featured-properties'],
    queryFn: () => propertiesAPI.getAll({ featured: true, limit: 6 }),
  });

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
        <div className="container-custom py-20">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6 text-balance">
              Find Your Dream Home in Ethiopia
            </h1>
            <p className="text-xl mb-8 text-primary-100">
              Discover luxury properties, apartments, and commercial spaces with Shoa Homes Real Estate PLC
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/properties" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
                Browse Properties
              </Link>
              <a href="#featured" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
                View Featured
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Search */}
      <section className="bg-white shadow-lg -mt-8 mx-4 md:mx-8 rounded-xl relative z-10">
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Location..."
              className="input-field"
            />
            <select className="input-field">
              <option>Property Type</option>
              <option>Apartment</option>
              <option>House</option>
              <option>Villa</option>
              <option>Commercial</option>
            </select>
            <select className="input-field">
              <option>Price Range</option>
              <option>Under 1M ETB</option>
              <option>1M - 5M ETB</option>
              <option>5M - 10M ETB</option>
              <option>10M+ ETB</option>
            </select>
            <Link to="/properties" className="btn-primary">
              Search
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container-custom py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">500+</div>
            <div className="text-gray-600">Properties</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">1,200+</div>
            <div className="text-gray-600">Happy Clients</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">15+</div>
            <div className="text-gray-600">Years Experience</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-primary-600 mb-2">50+</div>
            <div className="text-gray-600">Expert Agents</div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section id="featured" className="bg-gray-50 py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Properties</h2>
            <p className="text-gray-600 text-lg">
              Handpicked properties just for you
            </p>
          </div>

          {isLoading ? (
            <div className="py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {properties?.data?.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>

              <div className="text-center mt-12">
                <Link to="/properties" className="btn-primary">
                  View All Properties
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="container-custom py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Shoa Homes?</h2>
          <p className="text-gray-600 text-lg">
            We're committed to helping you find the perfect property
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center p-6">
            <div className="text-5xl mb-4">🏆</div>
            <h3 className="text-xl font-bold mb-2">Trusted Expertise</h3>
            <p className="text-gray-600">
              Over 15 years of experience in Ethiopian real estate market
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-bold mb-2">Wide Selection</h3>
            <p className="text-gray-600">
              Hundreds of verified properties to choose from
            </p>
          </div>

          <div className="text-center p-6">
            <div className="text-5xl mb-4">🤝</div>
            <h3 className="text-xl font-bold mb-2">Personalized Service</h3>
            <p className="text-gray-600">
              Dedicated agents to guide you through every step
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Find Your Dream Home?</h2>
          <p className="text-xl mb-8 text-primary-100">
            Let us help you find the perfect property that matches your needs
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/properties" className="btn-primary bg-white text-primary-600 hover:bg-gray-100">
              Browse Properties
            </Link>
            <a href="#contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Contact Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
