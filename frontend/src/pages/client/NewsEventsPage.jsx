import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { newsEventsAPI } from '../../services/api';
import { resolveImageUrl } from '../../utils/imageUrl';
import LoadingSpinner from '../../components/LoadingSpinner';

const NewsEventsPage = () => {
  const [activeTab, setActiveTab] = useState('news');

  // Fetch published news/events
  const { data: response, isLoading } = useQuery({
    queryKey: ['news-events', activeTab],
    queryFn: () =>
      newsEventsAPI.getAll({
        type: activeTab === 'all' ? undefined : activeTab,
        limit: 50,
      }),
  });

  const items = response?.data || [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Events</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Stay updated with the latest property news, market insights, and
            upcoming events from Shoa Homes
          </p>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="container-custom py-8">
        <div className="flex border-b border-gray-200 mb-8">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-6 py-3 font-semibold text-lg ${
              activeTab === 'news'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab('event')}
            className={`px-6 py-3 font-semibold text-lg ${
              activeTab === 'event'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Events
          </button>
        </div>

        {/* Content Section */}
        {items.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-5xl mb-4">
              {activeTab === 'news' ? '📰' : '📅'}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              No {activeTab === 'news' ? 'news' : 'events'} available
            </h3>
            <p className="text-gray-500 mt-1">Check back later for updates</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <article
                key={item.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {resolveImageUrl(item.image) ? (
                  <img
                    src={resolveImageUrl(item.image)}
                    alt={item.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400 text-4xl">
                      {item.type === 'event' ? '📅' : '📰'}
                    </span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>{new Date(item.date).toLocaleDateString()}</span>
                    <span className="mx-2">•</span>
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  {item.type === 'event' && item.time && (
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {item.time}
                    </div>
                  )}
                  {item.type === 'event' && item.location && (
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                      {item.location}
                    </div>
                  )}
                  <Link
                    to={`/news/${item.id}`}
                    className="inline-flex items-center text-primary-600 hover:text-primary-800 font-medium"
                  >
                    Read More
                    <svg
                      className="w-4 h-4 ml-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEventsPage;
