import { useState, useRef, useMemo, useEffect } from 'react';
const DEFAULT_SMALL_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent("<svg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 50 50'><rect width='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='%23737475' font-family='Arial' font-size='8'>No Image</text></svg>")}`;
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import PlaceSearch from '../../components/PlaceSearch';
import SortablePropertiesList from '../../components/SortablePropertiesList';
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
    type: 'apartment',
    status: 'For Sale',
    location: '',
    bedrooms: '',
    bathrooms: '',
    area: '',
    amenities: '',
    latitude: null,
    longitude: null,
  });
  const [images, setImages] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [viewMode, setViewMode] = useState('sortable'); // 'sortable' or 'table'
  const fileInputRef = useRef(null);

  const { data: properties, isLoading } = useQuery({
    queryKey: ['admin-properties'],
    queryFn: () => propertiesAPI.getAll({ limit: 100, sort: 'order' }),
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
      type: 'apartment',
      status: 'For Sale',
      location: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      amenities: '',
      latitude: null,
      longitude: null,
    });
    setImages([]);
    setRemovedImageIds([]);
  };

  const handleToggleFeatured = async (id, isFeatured) => {
    try {
      await propertiesAPI.update(id, {
        featured: isFeatured,
        // Include required fields to prevent validation errors
        title: 'Updating featured status',
        status: 'For Sale',
        location: 'Temporary',
        bedrooms: 1,
        bathrooms: 1,
        area: 1,
        amenities: [],
      });
      await Promise.all([
        queryClient.invalidateQueries(['admin-properties']),
        queryClient.invalidateQueries({
          queryKey: ['properties'],
          exact: false,
        }),
      ]);
      toast.success(
        `Property ${isFeatured ? 'marked as featured' : 'removed from featured'}`
      );
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to update featured status'
      );
      // The toggle will automatically revert if the update fails
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Ensure a location is selected via the search box or map
    if (!formData.location) {
      toast.error('Please select a location using the search box or map');
      return;
    }
    try {
      setIsUploading(true);

      // Prepare property data with proper type conversion
      const propertyData = {
        title: formData.title,
        description: formData.description,
        type: formData.type,
        status: formData.status, // 'For Sale' or 'Sold'
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
          setUploadProgress(0);
          const result = await propertiesAPI.uploadImages(
            propertyId,
            uploadFormData,
            (p) => setUploadProgress(p)
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
                id: img.id,
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
          setUploadProgress(0);
        } catch (uploadError) {
          // eslint-disable-next-line no-console
          console.error('Image upload failed: ', uploadError);
          // Prefer server-provided message when available
          const serverMsg = uploadError?.response?.data;
          const message =
            (serverMsg && (serverMsg.message || JSON.stringify(serverMsg))) ||
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

      // Delete any images the user removed while editing
      if (editingProperty && removedImageIds.length > 0) {
        await Promise.all(
          removedImageIds.map((imageId) =>
            propertiesAPI
              .deleteImage(editingProperty.id, imageId)
              .catch((e) => {
                // Failed to delete image - silently ignore
              })
          )
        );
        // Invalidate queries so UI reflects deletions
        await queryClient.invalidateQueries(['property', editingProperty.id]);
        await queryClient.invalidateQueries({
          queryKey: ['properties'],
          exact: false,
        });
      }

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
      setUploadProgress(0);
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
    const removedImage = images[index];
    // Optimistically remove from UI
    setImages((prev) => {
      const newImages = [...prev];
      const removed = newImages.splice(index, 1)[0];
      if (removed?.preview) URL.revokeObjectURL(removed.preview);
      return newImages;
    });

    // If editing an existing property and the image exists in DB, delete immediately
    if (editingProperty && removedImage && !removedImage.isNew && removedImage.id) {
      propertiesAPI
        .deleteImage(editingProperty.id, removedImage.id)
        .then(() => {
          // invalidate queries so other UI updates reflect deletion
          queryClient.invalidateQueries(['property', editingProperty.id]);
          queryClient.invalidateQueries({ queryKey: ['properties'], exact: false });
          toast.success('Image deleted');
        })
        .catch((err) => {
          // Revert removal on error
          setImages((prev) => {
            const copy = [...prev];
            copy.splice(index, 0, removedImage);
            return copy;
          });
          toast.error(
            err.response?.data?.message || err.message || 'Failed to delete image'
          );
        });
    } else if (removedImage && !removedImage.isNew && removedImage.id) {
      // If not editing (shouldn't normally happen), mark for deletion on submit
      setRemovedImageIds((ids) => [...ids, removedImage.id]);
    }
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
        property.images.map((img) => ({
          id: img.id,
          url: img.url,
          publicId: img.publicId,
        }))
      );
    }
    setRemovedImageIds([]);
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
        {/* View Toggle */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">View:</span>
            <div className="flex rounded-lg border border-gray-300">
              <button
                onClick={() => setViewMode('sortable')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                  viewMode === 'sortable'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                📋 Sortable List
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                  viewMode === 'table'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                📊 Table View
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : viewMode === 'sortable' ? (
          <div className="p-6">
            <SortablePropertiesList
              properties={properties?.data || []}
              onEdit={(property) => {
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
                setEditingProperty(property);
                setFormData({
                  title: property.title,
                  description: property.description,
                  type: property.type,
                  status: property.status,
                  location: property.location,
                  bedrooms: property.bedrooms,
                  bathrooms: property.bathrooms,
                  area: property.area,
                  amenities: amenityString || '',
                  latitude: property.latitude || null,
                  longitude: property.longitude || null,
                  order: property.order || 0,
                });
                setImages(
                  property.images?.map((img) => ({
                    id: img.id,
                    url: img.url,
                    publicId: img.publicId,
                  })) || []
                );
                setIsModalOpen(true);
              }}
              onDelete={(id) => {
                if (
                  window.confirm(
                    'Are you sure you want to delete this property?'
                  )
                ) {
                  deleteMutation.mutate(id);
                }
              }}
            />
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
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Featured
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
                          src={(() => {
                            const img = property.images?.[0]?.url;
                            if (!img) return DEFAULT_SMALL_PLACEHOLDER;
                            if (
                              img.startsWith('http') ||
                              img.startsWith('blob:')
                            )
                              return img;
                            return 'https://api.shoahomes.com' + img;
                          })()}
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
                    <td className="px-6 py-4">{property.status}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {property.location}
                    </td>
                    <td className="px-6 py-4">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={property.featured || false}
                          onChange={() =>
                            handleToggleFeatured(
                              property.id,
                              !property.featured
                            )
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
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
                    <option value="For Sale">For Sale</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                {/* Location/map picker: single input is the place search */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>

                  {/* Place search (Geocoding) - this is the primary location input */}
                  <PlaceSearch
                    value={formData.location}
                    onSelect={(place) =>
                      setFormData({
                        ...formData,
                        location: place.display_name,
                        latitude: parseFloat(place.lat),
                        longitude: parseFloat(place.lon),
                      })
                    }
                  />

                  <div className="text-sm text-gray-500 mb-1">
                    Search for a place above or click on the map to pick a
                    location. The search box serves as the single location
                    field.
                  </div>

                  <LocationPicker
                    lat={formData.latitude}
                    lng={formData.longitude}
                    onChange={(coords) =>
                      setFormData({ ...formData, ...coords })
                    }
                  />
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
                  {isUploading && uploadProgress > 0 ? (
                    <div className="w-full bg-gray-200 rounded h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  ) : isUploading ? (
                    <p className="text-gray-500 text-sm mt-1">Preparing...</p>
                  ) : null}
                  {images.length > 0 && (
                    <div className="flex flex-wrap mt-2 gap-2">
                      {images.map((img, index) => (
                        <div
                          key={index}
                          className="relative w-24 h-24 border rounded overflow-hidden"
                        >
                          <img
                            src={(() => {
                              // Use preview for newly uploaded images
                              if (img.preview) return img.preview;
                              // For existing images from server
                              if (img.url) {
                                if (
                                  img.url.startsWith('http') ||
                                  img.url.startsWith('blob:')
                                )
                                  return img.url;
                                return 'https://api.shoahomes.com' + img.url;
                              }
                              // Fallback for file objects
                              if (img.file)
                                return URL.createObjectURL(img.file);
                              return DEFAULT_SMALL_PLACEHOLDER;
                            })()}
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
