import { useState, useRef, useMemo, useEffect } from 'react';
const DEFAULT_SMALL_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'><rect width='50' height='50' fill='%23E5E7EB'/><text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23737475' font-family='Arial' font-size='8'>No Image</text></svg>")}`;
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertiesAPI } from '../../services/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast, { Toaster } from 'react-hot-toast';

const PropertyManagement = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    priceType: 'total',
    type: 'apartment',
    status: 'for-sale',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: '',
    latitude: null,
    longitude: null,
  });
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: () => propertiesAPI.getAll({ limit: 100 }),
  });

  const createMutation = useMutation({
    mutationFn: propertiesAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-properties']);
      queryClient.invalidateQueries({ queryKey: ['properties'], exact: false });
      queryClient.invalidateQueries(['dashboard-stats']);
      setIsModalOpen(false);
      resetForm();
      toast.success('Property created successfully!');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => propertiesAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-properties']);
      queryClient.invalidateQueries({ queryKey: ['properties'], exact: false });
      queryClient.invalidateQueries(['dashboard-stats']);
      setIsModalOpen(false);
      setEditingProperty(null);
      resetForm();
      toast.success('Property updated successfully!');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: propertiesAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['admin-properties']);
      queryClient.invalidateQueries(['dashboard-stats']);
    },
  });

  const resetForm = () => {
    // Clean up object URLs to prevent memory leaks
    images.forEach((image) => {
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    });

    setFormData({
      title: '',
      description: '',
      price: '',
      priceType: 'total',
      type: 'apartment',
      status: 'for-sale',
      location: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      amenities: '',
    });
    setImages([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsUploading(true);

      // Prepare property data with proper type conversion
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price) || 0,
        priceType: formData.priceType,
        type: formData.type,
        status: formData.status,
        location: formData.location,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseInt(formData.bathrooms) || 0,
        area: parseFloat(formData.area) || 0,
        amenities: formData.amenities
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
      };

      // First, create or update the property
      let propertyId;
      if (editingProperty) {
        const { data } = await updateMutation.mutateAsync({
          id: editingProperty.id,
          data: propertyData,
        });
        propertyId = data.id;
      } else {
        const { data } = await createMutation.mutateAsync(propertyData);
        propertyId = data.id;
      }

      // Upload new images if any (send using FormData 'images[]')
      const newImages = images.filter((img) => img.isNew);
      let uploadSuccessful = newImages.length === 0; // If no images, consider successful
      if (newImages.length > 0) {
        const uploadFormData = new FormData();
        newImages.forEach((img) => uploadFormData.append('images[]', img.file));
        try {
          const result = await propertiesAPI.uploadImages(
            propertyId,
            uploadFormData
          );
          if (result?.errors?.length) {
            // eslint-disable-next-line no-console
            console.warn('Some images failed to upload:', result.errors);
            toast(
              `Partial upload: ${result.errors.length} image(s) failed to upload.`,
              { icon: '⚠️' }
            );
          }
          // Append successfully uploaded images to the current images state
          if (result?.data?.length) {
            setImages((prev) => [
              ...prev,
              ...result.data.map((img) => ({
                url: img.url,
                publicId: img.publicId,
              })),
            ]);
          }
          // refresh public properties grid and property detail
          await queryClient.invalidateQueries({
            queryKey: ['properties'],
            exact: false,
          });
          await queryClient.invalidateQueries(['property', propertyId]);
          uploadSuccessful = true;
        } catch (uploadError) {
          // eslint-disable-next-line no-console
          console.error('Image upload failed: ', uploadError);
          const message =
            uploadError.response?.data?.message ||
            uploadError.message ||
            'Failed to upload images';
          toast.error(message);
          uploadSuccessful = false;
          // Property was created/updated successfully, but images failed
        }
      }

      // Refresh the properties list and dashboard stats
      await queryClient.invalidateQueries(['admin-properties']);
      await queryClient.invalidateQueries(['dashboard-stats']);

      // Reset form and close modal only if upload was successful or no images
      if (uploadSuccessful) {
        resetForm();
        setIsModalOpen(false);
        setEditingProperty(null);
        toast.success(
          `Property ${editingProperty ? 'updated' : 'created'} successfully!`
        );
      }
    } catch (error) {
      // Log to error tracking service in production
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error saving property:', error);
      }
      toast.error(
        error.response?.data?.message ||
          error.message ||
          'Error saving property'
      );
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      toast.error('Maximum 10 images allowed');
      return;
    }

    setIsUploading(true);
    try {
      // Create preview URLs for the selected files
      const newImages = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isNew: true,
      }));

      setImages((prev) => [...prev, ...newImages]);
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        // eslint-disable-next-line no-console
        console.error('Error creating image previews:', error);
      }
      toast.error('Error processing images');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setIsUploading(false);
    }
  };

  const removeImage = (index) => {
    setImages((prev) => {
      const newImages = [...prev];
      // Revoke the object URL to prevent memory leaks
      if (newImages[index]?.preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return newImages;
    });
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    const amenityString = Array.isArray(property.amenities)
      ? property.amenities.join(', ')
      : typeof property.amenities === 'string'
        ? (() => {
            try {
              return JSON.parse(property.amenities).join(', ');
            } catch (e) {
              return property.amenities;
            }
          })()
        : '';

    setFormData({
      title: property.title,
      description: property.description,
      price: property.price,
      priceType: property.priceType,
      type: property.type,
      status: property.status,
      location: property.location,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area: property.area,
      amenities: amenityString || '',
      latitude: property.latitude || null,
      longitude: property.longitude || null,
    });
    if (property.images?.length) {
      setImages(
        property.images.map((img) => ({ url: img.url, publicId: img.publicId }))
      );
    }
    setIsModalOpen(true);
  };

  // Location picker for the admin modal
  const LocationPicker = ({ lat, lng, onChange }) => {
    const initialPosition = useMemo(
      () => [lat ?? 9.03, lng ?? 38.74],
      [lat, lng]
    );
    const [currentPosition, setCurrentPosition] = useState(initialPosition);

    useEffect(() => {
      setCurrentPosition([lat ?? 9.03, lng ?? 38.74]);
    }, [lat, lng]);

    const MapEvents = () => {
      useMapEvents({
        click(e) {
          const newPos = [e.latlng.lat, e.latlng.lng];
          setCurrentPosition(newPos);
          onChange({ latitude: e.latlng.lat, longitude: e.latlng.lng });
        },
      });
      return null;
    };

    return (
      <div className="h-[250px] rounded overflow-hidden">
        <MapContainer
          center={currentPosition}
          zoom={12}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={currentPosition}
            draggable={true}
            eventHandlers={{
              dragend: (e) => {
                const newPos = e.target.getLatLng();
                const newPosition = [newPos.lat, newPos.lng];
                setCurrentPosition(newPosition);
                onChange({ latitude: newPos.lat, longitude: newPos.lng });
              },
            }}
          />
          <MapEvents />
        </MapContainer>
      </div>
    );
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      toast.promise(deleteMutation.mutateAsync(id), {
        loading: 'Deleting property...',
        success: 'Property deleted!',
        error: 'Failed to delete property',
      });
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="space-y-6">
      <Toaster position="top-right" />
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Property Management</h1>
          <p className="text-gray-600">Manage your property listings</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setEditingProperty(null);
            setIsModalOpen(true);
          }}
          className="btn-primary"
        >
          + Add Property
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-3 text-right text-sm font-semibold text-gray-900">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {properties?.data?.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={
                            property.images?.[0]?.url ||
                            DEFAULT_SMALL_PLACEHOLDER
                          }
                          alt={property.title}
                          className="w-12 h-12 rounded object-cover mr-3"
                        />
                        <div>
                          <div className="font-semibold">{property.title}</div>
                          <div className="text-sm text-gray-600">
                            {property.bedrooms}BR • {property.area}m²
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{property.type}</td>
                    <td className="px-6 py-4 font-semibold">
                      {property.price} ETB
                    </td>
                    <td className="px-6 py-4">{property.status}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {property.location}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => handleEdit(property)}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(property.id)}
                        className="text-red-600 hover:text-red-800 font-semibold"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 mt-12 max-h-[calc(100vh-6rem)] overflow-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingProperty(null);
                  resetForm();
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {/* Title & Description */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="input-field"
                  />
                </div>

                {/* Type & Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status *
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="for-sale">For Sale</option>
                    <option value="for-rent">Sold</option>
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (ETB) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price Type *
                  </label>
                  <select
                    name="priceType"
                    value={formData.priceType}
                    onChange={handleChange}
                    required
                    className="input-field"
                  >
                    <option value="total">Total</option>
                    <option value="per-month">Per Month</option>
                    <option value="per-year">Per Year</option>
                  </select>
                </div>

                {/* Location */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location / Map Picker
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="input-field mb-2"
                  />
                  <div className="text-sm text-gray-500 mb-1">
                    Click on the map to set the precise latitude & longitude for
                    the property.
                  </div>
                  <LocationPicker
                    lat={formData.latitude}
                    lng={formData.longitude}
                    onChange={(coords) =>
                      setFormData({ ...formData, ...coords })
                    }
                  />
                  <div className="mt-2 flex gap-2">
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600">
                        Latitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="latitude"
                        value={formData.latitude ?? ''}
                        onChange={(e) =>
                          setFormData({ ...formData, latitude: e.target.value })
                        }
                        className="input-field"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-xs text-gray-600">
                        Longitude
                      </label>
                      <input
                        type="number"
                        step="any"
                        name="longitude"
                        value={formData.longitude ?? ''}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            longitude: e.target.value,
                          })
                        }
                        className="input-field"
                      />
                    </div>
                  </div>
                </div>

                {/* Bedrooms, Bathrooms, Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <input
                    type="number"
                    name="bedrooms"
                    value={formData.bedrooms}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms *
                  </label>
                  <input
                    type="number"
                    name="bathrooms"
                    value={formData.bathrooms}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area (m²) *
                  </label>
                  <input
                    type="number"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    required
                    className="input-field"
                  />
                </div>
                {/* Image Upload */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Images (Max 10)
                  </label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
           file:rounded file:border-0 file:text-sm file:font-semibold
           file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {isUploading && (
                    <p className="text-gray-500 text-sm mt-1">Uploading...</p>
                  )}
                  {images.length > 0 && (
                    <div className="flex flex-wrap mt-2 gap-2">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 border rounded overflow-hidden"
                        >
                          <img
                            src={img.url || URL.createObjectURL(img.file)}
                            alt="Property"
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Amenities */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amenities (comma-separated)
                  </label>
                  <input
                    type="text"
                    name="amenities"
                    value={formData.amenities}
                    onChange={handleChange}
                    placeholder="Pool, Gym, Parking"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Submit */}
              <div className="flex justify-end space-x-4 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingProperty(null);
                    resetForm();
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="btn-primary"
                >
                  {createMutation.isPending || updateMutation.isPending
                    ? 'Saving...'
                    : editingProperty
                      ? 'Update Property'
                      : 'Create Property'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
