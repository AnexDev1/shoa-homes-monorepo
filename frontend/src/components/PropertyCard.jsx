import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    if (property.status === 'For Rent') {
      return `${(price / 1000).toFixed(0)}K ETB/mo`;
    }
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M ETB`;
    }
    return `${(price / 1000).toFixed(0)}K ETB`;
  };

  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm border ${
              property.status === 'For Sale' 
                ? 'bg-gold-500/90 text-navy-900 border-gold-300' 
                : 'bg-navy-700/90 text-white border-navy-500'
            }`}>
              {property.status}
            </span>
          </div>

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                FEATURED
              </span>
            </div>
          )}

          {/* Quick View Button - Shows on Hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="bg-white/90 backdrop-blur-sm text-navy-900 px-6 py-3 rounded-lg font-semibold transform scale-90 group-hover:scale-100 transition-transform duration-300">
              View Details →
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Property Type */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold text-navy-600 bg-navy-50 px-3 py-1 rounded-full">
              {property.type}
            </span>
            <div className="text-3xl font-display font-bold text-navy-900">
              {formatPrice(property.price)}
            </div>
          </div>

          <h3 className="text-xl font-bold text-navy-900 mb-2 line-clamp-2 group-hover:text-gold-600 transition-colors">
            {property.title}
          </h3>
          
          {/* Location */}
          <div className="flex items-center text-gray-600 text-sm mb-4">
            <svg className="w-4 h-4 mr-2 text-gold-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span className="line-clamp-1 font-medium">{property.location}</span>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <svg className="w-5 h-5 mr-1 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <svg className="w-5 h-5 mr-1 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <svg className="w-5 h-5 mr-1 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
              </svg>
              <span>{property.area} m²</span>
            </div>
          </div>

          {/* Amenities Preview */}
          {property.amenities && property.amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {property.amenities.slice(0, 3).map((amenity, index) => (
                <span 
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {amenity}
                </span>
              ))}
              {property.amenities.length > 3 && (
                <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded font-medium">
                  +{property.amenities.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
