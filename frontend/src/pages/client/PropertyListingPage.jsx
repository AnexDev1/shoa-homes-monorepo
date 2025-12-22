import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { propertiesAPI } from '../../services/api';
import PropertyCard from '../../components/PropertyCard';
import LoadingSpinner from '../../components/LoadingSpinner';

const PropertyListingPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    bedrooms: '',
    location: '',
    status: '',
  });
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const limit = 12;

  // Initialize filters and sort from URL params
  useEffect(() => {
    const urlFilters = {
      search: searchParams.get('search') || '',
      type: searchParams.get('type') || '',
      bedrooms: searchParams.get('bedrooms') || '',
      location: searchParams.get('location') || '',
      status: searchParams.get('status') || '',
    };
    setFilters(urlFilters);
    setSortBy(searchParams.get('sort') || 'newest');
    setPage(1); // Reset to first page when filters change
  }, [searchParams]);

  const { data, isLoading } = useQuery({
    queryKey: ['properties', filters, sortBy, page],
    queryFn: () => {
      // Filter out empty values before sending to API
      const cleanFilters = Object.fromEntries(
        Object.entries(filters).filter(
          ([_, value]) => value !== '' && value !== null && value !== undefined
        )
      );
      return propertiesAPI.getAll({
        ...cleanFilters,
        sort: sortBy,
        page,
        limit,
      });
    },
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change

    // Update URL params - only include non-empty values
    const params = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val && val !== '') params.set(key, val);
    });
    if (sortBy !== 'newest') params.set('sort', sortBy);
    setSearchParams(params);
  };

  const handleSortChange = (value) => {
    setSortBy(value);
    setPage(1);

    // Update URL params - only include non-empty values
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val && val !== '') params.set(key, val);
    });
    if (value !== 'newest') params.set('sort', value);
    setSearchParams(params);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      type: '',
      bedrooms: '',
      location: '',
      status: '',
    };
    setFilters(clearedFilters);
    setSortBy('newest');
    setPage(1);
    setSearchParams(new URLSearchParams()); // Clear URL params
  };

  const totalPages = data ? Math.ceil(data.total / limit) : 0;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="container-custom py-8">
          <h1 className="text-4xl font-bold mb-2">Browse Properties</h1>
          <p className="text-gray-600">
            Find your perfect home from our collection of {data?.total || 0}{' '}
            properties
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 shrink-0">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <button
                  onClick={clearFilters}
                  className="text-primary-600 text-sm hover:underline"
                >
                  Clear All
                </button>
              </div>

              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search
                  </label>
                  <input
                    type="text"
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search properties..."
                    className="input-field"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">All Types</option>
                    <option value="apartment">Apartment</option>
                    <option value="house">House</option>
                    <option value="villa">Villa</option>
                    <option value="commercial">Commercial</option>
                    <option value="land">Land</option>
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">All</option>
                    <option value="For Sale">For Sale</option>
                    <option value="Sold">Sold</option>
                  </select>
                </div>

                {/* Bedrooms */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bedrooms
                  </label>
                  <select
                    name="bedrooms"
                    value={filters.bedrooms}
                    onChange={handleFilterChange}
                    className="input-field"
                  >
                    <option value="">Any</option>
                    <option value="1">1+</option>
                    <option value="2">2+</option>
                    <option value="3">3+</option>
                    <option value="4">4+</option>
                    <option value="5">5+</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={filters.location}
                    onChange={handleFilterChange}
                    placeholder="Enter location..."
                    className="input-field"
                  />
                </div>
              </div>
            </div>
          </aside>

          {/* Properties Grid */}
          <div className="flex-1">
            {/* Sort and Results Header */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="text-gray-600">
                  {data?.total || 0} properties found
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Sort by:
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => handleSortChange(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:border-primary-500 focus:outline-none text-sm"
                  >
                    <option value="newest">Newest First</option>
                    <option value="area">Area: Largest First</option>
                    <option value="order">Custom Order</option>
                  </select>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <LoadingSpinner size="lg" />
              </div>
            ) : data?.data?.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <div className="text-6xl mb-4">🏠</div>
                <h3 className="text-2xl font-bold mb-2">No Properties Found</h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your filters to find more properties
                </p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                {/* Properties Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {data?.data?.map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    {/* Page Numbers with Ellipsis */}
                    {(() => {
                      const pages = [];
                      const maxVisible = 5;
                      const halfVisible = Math.floor(maxVisible / 2);

                      let startPage = Math.max(1, page - halfVisible);
                      let endPage = Math.min(totalPages, page + halfVisible);

                      // Adjust if we're near the beginning or end
                      if (endPage - startPage + 1 < maxVisible) {
                        if (startPage === 1) {
                          endPage = Math.min(
                            totalPages,
                            startPage + maxVisible - 1
                          );
                        } else if (endPage === totalPages) {
                          startPage = Math.max(1, endPage - maxVisible + 1);
                        }
                      }

                      // Add first page and ellipsis if needed
                      if (startPage > 1) {
                        pages.push(
                          <button
                            key={1}
                            onClick={() => setPage(1)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                          >
                            1
                          </button>
                        );
                        if (startPage > 2) {
                          pages.push(
                            <span
                              key="start-ellipsis"
                              className="px-2 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                      }

                      // Add visible pages
                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(
                          <button
                            key={i}
                            onClick={() => setPage(i)}
                            className={`px-4 py-2 rounded-lg ${
                              page === i
                                ? 'bg-primary-600 text-white'
                                : 'border hover:bg-gray-50'
                            }`}
                          >
                            {i}
                          </button>
                        );
                      }

                      // Add ellipsis and last page if needed
                      if (endPage < totalPages) {
                        if (endPage < totalPages - 1) {
                          pages.push(
                            <span
                              key="end-ellipsis"
                              className="px-2 py-2 text-gray-500"
                            >
                              ...
                            </span>
                          );
                        }
                        pages.push(
                          <button
                            key={totalPages}
                            onClick={() => setPage(totalPages)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                          >
                            {totalPages}
                          </button>
                        );
                      }

                      return pages;
                    })()}

                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyListingPage;
