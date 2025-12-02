import { Link } from 'react-router-dom';
import { MapPin, Bed, Bath, Maximize2, Star } from 'lucide-react';

// Helper function to get image URL from different formats
const DEFAULT_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='400' height='300' fill='%23E5E7EB'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23737475' font-family='Arial' font-size='18'>No Image Available</text></svg>")}`;
const getImageUrl = (img) => {
  if (!img) return DEFAULT_PLACEHOLDER;
  // If it's a full URL, return as is
  if (
    typeof img === 'string' &&
    (img.startsWith('http') || img.startsWith('blob:'))
  ) {
    return img;
  }
  // If it's a file object with a preview (from file upload)
  if (img instanceof File) {
    return URL.createObjectURL(img);
  }
  // If it's an object with a path or url
  if (typeof img === 'object' && (img.path || img.url)) {
    return img.path || img.url;
  }
  // Fallback to placeholder
  return DEFAULT_PLACEHOLDER;
};

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    if (property.status === 'Sold') {
      return `${(price / 1000).toFixed(0)}K ETB/mo`;
    }
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M ETB`;
    }
    return `${(price / 1000).toFixed(0)}K ETB`;
  };

  // Defensive amenities parsing: ensure we have an array
  const amenities = Array.isArray(property.amenities)
    ? property.amenities
    : typeof property.amenities === 'string'
      ? (() => {
          try {
            return JSON.parse(property.amenities);
          } catch (e) {
            return property.amenities
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean);
          }
        })()
      : [];

  return (
    <Link to={`/properties/${property.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <img
            src={getImageUrl(property.images?.[0])}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = DEFAULT_PLACEHOLDER;
            }}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Status Badge */}
          <div className="absolute top-4 right-4">
            <span
              className={`px-4 py-2 rounded-full text-xs font-bold backdrop-blur-sm border ${
                property.status === 'For Sale'
                  ? 'bg-gold-500/90 text-navy-900 border-gold-300'
                  : 'bg-navy-700/90 text-white border-navy-500'
              }`}
            >
              {property.status}
            </span>
          </div>

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-red-500 text-white rounded-full text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-current" />
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
            <MapPin className="w-4 h-4 mr-2 text-gold-500" />
            <span className="line-clamp-1 font-medium">
              {property.location}
            </span>
          </div>

          {/* Property Details */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <Bed className="w-5 h-5 mr-1 text-navy-600" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <Bath className="w-5 h-5 mr-1 text-navy-600" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="flex items-center text-gray-700 text-sm font-medium">
              <Maximize2 className="w-5 h-5 mr-1 text-navy-600" />
              <span>{property.area} m²</span>
            </div>
          </div>

          {/* Amenities Preview */}
          {amenities && amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {amenities.slice(0, 3).map((amenity, index) => (
                <span
                  key={index}
                  className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                >
                  {amenity}
                </span>
              ))}
              {amenities.length > 3 && (
                <span className="text-xs bg-gold-100 text-gold-700 px-2 py-1 rounded font-medium">
                  +{amenities.length - 3} more
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
