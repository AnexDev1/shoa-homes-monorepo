import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { propertiesAPI } from '../../services/api';
import { useModalStore } from '../../store/modalStore';
import LoadingSpinner from '../../components/LoadingSpinner';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const { openInquiryModal } = useModalStore();

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesAPI.getById(id),
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'ETB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Property Not Found</h2>
          <Link to="/properties" className="btn-primary">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const images = property.images?.length > 0 
    ? property.images 
    : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className="bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container-custom py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-primary-600">Properties</Link>
            <span>/</span>
            <span className="text-gray-900">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-[500px]">
                <img
                  src={images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4">
                  <span className="bg-primary-600 text-white px-4 py-2 rounded-full font-semibold">
                    {property.status}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-primary-600'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`View ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h1 className="text-3xl font-bold mb-4">{property.title}</h1>
              
              <div className="flex items-center text-gray-600 mb-6">
                <span className="mr-2">📍</span>
                <span>{property.location}</span>
              </div>

              <div className="flex items-center justify-between mb-6 pb-6 border-b">
                <div className="text-3xl font-bold text-primary-600">
                  {formatPrice(property.price)}
                </div>
                <div className="text-gray-600">
                  {property.priceType}
                </div>
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 pb-6 border-b">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🛏️</div>
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-gray-600">Bedrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🚿</div>
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-gray-600">Bathrooms</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">📐</div>
                  <div className="font-semibold">{property.area} m²</div>
                  <div className="text-sm text-gray-600">Area</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🏠</div>
                  <div className="font-semibold capitalize">{property.type}</div>
                  <div className="text-sm text-gray-600">Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Description</h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-4">Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.amenities.map((amenity, idx) => (
                      <div key={idx} className="flex items-center space-x-2 text-gray-700">
                        <span className="text-primary-600">✓</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold mb-4">Location</h2>
              <div className="h-[400px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[9.03, 38.74]} // Addis Ababa coordinates
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={[9.03, 38.74]}>
                    <Popup>{property.title}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-6">Interested in this property?</h3>
              
              <button
                onClick={() => openInquiryModal(property)}
                className="btn-primary w-full mb-4"
              >
                Send Inquiry
              </button>

              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-3 text-gray-700">
                  <span className="text-xl">📞</span>
                  <div>
                    <div className="text-sm text-gray-600">Call Us</div>
                    <div className="font-semibold">+251 11 123 4567</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <span className="text-xl">✉️</span>
                  <div>
                    <div className="text-sm text-gray-600">Email Us</div>
                    <div className="font-semibold">info@shoahomes.com</div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <span className="text-xl">📍</span>
                  <div>
                    <div className="text-sm text-gray-600">Visit Office</div>
                    <div className="font-semibold">Addis Ababa, Ethiopia</div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <h4 className="font-semibold mb-2">Share this property</h4>
                <div className="flex space-x-2">
                  <button className="flex-1 btn-secondary text-sm py-2">Facebook</button>
                  <button className="flex-1 btn-secondary text-sm py-2">Twitter</button>
                  <button className="flex-1 btn-secondary text-sm py-2">WhatsApp</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetailPage;
