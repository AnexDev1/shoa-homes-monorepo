import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Home,
  Check,
  Phone,
  Mail,
  Share2,
} from 'lucide-react';
import { propertiesAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';

const PropertyDetailPage = () => {
  const { id } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  // Inquiry modal removed — direct contact by email/phone

  const { data: property, isLoading } = useQuery({
    queryKey: ['property', id],
    queryFn: () => propertiesAPI.getById(id),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center px-4">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            Property Not Found
          </h2>
          <Link to="/properties" className="btn-primary inline-block">
            Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const DEFAULT_800_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'><rect width='800' height='600' fill='%23E5E7EB'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23737475' font-family='Arial' font-size='24'>No Image Available</text></svg>")}`;
  const DEFAULT_200_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'><rect width='200' height='150' fill='%23E5E7EB'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23737475' font-family='Arial' font-size='14'>Image Not Available</text></svg>")}`;

  const getImageUrl = (img) => {
    if (!img) return DEFAULT_800_PLACEHOLDER;
    if (typeof img === 'string') {
      const API_BASE = import.meta.env.VITE_API_BASE_URL || '';
      if (img.startsWith('/uploads/')) {
        // Normalize base and append upload path
        const base = API_BASE.replace(/\/$/, '');
        return `${base}${img}`;
      }
      return img;
    }
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img === 'object')
      return (
        img.imageUrl ||
        img.url ||
        img.path ||
        'https://via.placeholder.com/800x600?text=No+Image'
      );
    return DEFAULT_800_PLACEHOLDER;
  };

  const getImagesArray = () => {
    const data = property?.data || property;
    if (data.images?.length > 0) return data.images.map(getImageUrl);
    if (data.imageUrl) return [getImageUrl(data.imageUrl)];
    return [DEFAULT_800_PLACEHOLDER];
  };

  const images = getImagesArray();

  // Defensive parse of amenities if backend returns a JSON string
  const amenities = Array.isArray(property.data.amenities)
    ? property.data.amenities
    : typeof property.data.amenities === 'string'
      ? (() => {
          try {
            return JSON.parse(property.data.amenities);
          } catch (e) {
            return property.data.amenities
              .split(',')
              .map((a) => a.trim())
              .filter(Boolean);
          }
        })()
      : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto py-4 sm:py-6 lg:py-8 px-4">
        {/* Breadcrumb could go here */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative h-[300px] sm:h-[400px] lg:h-[500px]">
                <img
                  src={images[selectedImage]}
                  alt={property.data.title || 'Property Image'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = DEFAULT_800_PLACEHOLDER;
                  }}
                />
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                  <span className="bg-primary-600 text-white px-3 py-1 sm:px-4 sm:py-2 rounded-full font-semibold text-sm">
                    {property.data.status}
                  </span>
                </div>
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-3 sm:p-4 flex gap-2 overflow-x-auto">
                  {images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(idx)}
                      className={`flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden border-2 transition-all ${
                        selectedImage === idx
                          ? 'border-primary-600'
                          : 'border-transparent'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${property.data.title} - ${idx + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_200_PLACEHOLDER;
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4">
                {property.data.title}
              </h1>

              <div className="flex items-center text-gray-600 mb-4 sm:mb-6">
                <MapPin className="mr-2 h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                <span className="text-sm sm:text-base">
                  {property.data.location}
                </span>
              </div>

              <div className="mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                {/* Price section removed */}
              </div>

              {/* Key Features */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b">
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Bed className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary-600" />
                  <div className="font-semibold text-sm sm:text-base">
                    {property.data.bedrooms}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Bedrooms
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Bath className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary-600" />
                  <div className="font-semibold text-sm sm:text-base">
                    {property.data.bathrooms}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">
                    Bathrooms
                  </div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Square className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary-600" />
                  <div className="font-semibold text-sm sm:text-base">
                    {property.data.area} m²
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Area</div>
                </div>
                <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-lg">
                  <Home className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-primary-600" />
                  <div className="font-semibold text-sm sm:text-base capitalize">
                    {property.data.type}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600">Type</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4 sm:mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                  {property.data.description}
                </p>
              </div>

              {/* Amenities */}
              {amenities && amenities.length > 0 && (
                <div className="mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                    Amenities
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {amenities.map((amenity, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-2 text-gray-700"
                      >
                        <Check className="h-4 w-4 text-primary-600 flex-shrink-0" />
                        <span className="text-sm sm:text-base">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">
                Location
              </h2>
              <div className="h-[300px] sm:h-[350px] lg:h-[400px] rounded-lg overflow-hidden">
                {(() => {
                  // Use saved coordinates if available; otherwise default to Addis Ababa
                  const lat = property?.data?.latitude ?? 9.03;
                  const lng = property?.data?.longitude ?? 38.74;
                  const center = [lat, lng];
                  return (
                    <MapContainer
                      key={`${lat}-${lng}-${property.data.id}`}
                      center={center}
                      zoom={13}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      />
                      <Marker position={center}>
                        <Popup>{property.data.title}</Popup>
                      </Marker>
                    </MapContainer>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 mt-6 lg:mt-0">
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 lg:sticky lg:top-24">
              <h3 className="text-lg sm:text-xl font-bold mb-4 sm:mb-6">
                Interested in this property?
              </h3>
              <a
                href={`mailto:info@shoahomes.com?subject=Inquiry about ${encodeURIComponent(property.data.title)}`}
                className="btn-primary w-full mb-3 sm:mb-4 inline-flex items-center justify-center text-sm sm:text-base"
              >
                Contact via Email
              </a>
              <a
                href={`tel:+251111234567`}
                className="btn-secondary w-full inline-flex items-center justify-center text-sm sm:text-base"
              >
                Call +251 11 123 4567
              </a>

              <div className="space-y-3 sm:space-y-4 pt-4 border-t">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Call Us
                    </div>
                    <div className="font-semibold text-sm sm:text-base">
                      +251 11 123 4567
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <Mail className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Email Us
                    </div>
                    <div className="font-semibold text-sm sm:text-base">
                      info@shoahomes.com
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3 text-gray-700">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600 flex-shrink-0" />
                  <div>
                    <div className="text-xs sm:text-sm text-gray-600">
                      Visit Office
                    </div>
                    <div className="font-semibold text-sm sm:text-base">
                      Addis Ababa, Ethiopia
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t mt-4">
                <h4 className="font-semibold mb-3 flex items-center text-sm sm:text-base">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share this property
                </h4>
                <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2">
                  <button className="flex-1 btn-secondary text-sm py-2 px-3">
                    Facebook
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2 px-3">
                    Twitter
                  </button>
                  <button className="flex-1 btn-secondary text-sm py-2 px-3">
                    WhatsApp
                  </button>
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
