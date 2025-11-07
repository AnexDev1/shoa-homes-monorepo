import { Link } from 'react-router-dom';

const PropertyCard = ({ property }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Link to={`/properties/${property.id}`} className="card group">
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        <img
          src={property.images?.[0] || 'https://via.placeholder.com/400x300?text=No+Image'}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute top-4 right-4">
          <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
            {property.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {property.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-primary-600">
            {formatPrice(property.price)}
          </span>
          <span className="text-sm text-gray-500">
            {property.priceType}
          </span>
        </div>

        {/* Property Details */}
        <div className="flex items-center justify-between text-gray-600 text-sm border-t pt-4">
          <div className="flex items-center space-x-1">
            <span>🛏️</span>
            <span>{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>🚿</span>
            <span>{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>📐</span>
            <span>{property.area} m²</span>
          </div>
        </div>

        {/* Location */}
        <div className="mt-4 flex items-center text-gray-600 text-sm">
          <span className="mr-2">📍</span>
          <span className="line-clamp-1">{property.location}</span>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
