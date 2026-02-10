import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { newsEventsAPI } from '../../services/api';
import { resolveImageUrl } from '../../utils/imageUrl';
import LoadingSpinner from '../../components/LoadingSpinner';

const NewsEventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['news-event', id],
    queryFn: () => newsEventsAPI.getById(id),
    enabled: !!id,
  });

  const item = response?.data;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !item) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-400 mb-4">404</h1>
          <p className="text-gray-500 mb-6">Article not found</p>
          <button
            onClick={() => navigate('/news')}
            className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Back to News & Events
          </button>
        </div>
      </div>
    );
  }

  const imageUrl = resolveImageUrl(item.image);
  const formattedDate = new Date(item.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero image */}
      {imageUrl ? (
        <div className="w-full h-64 sm:h-80 md:h-[28rem] relative bg-gray-900">
          <img
            src={imageUrl}
            alt={item.title}
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 text-white container-custom">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                {item.type === 'event' ? '📅 Event' : '📰 News'}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {item.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              {item.title}
            </h1>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
          <div className="container-custom">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                {item.type === 'event' ? '📅 Event' : '📰 News'}
              </span>
              <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                {item.category}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              {item.title}
            </h1>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="container-custom py-8 md:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            to="/news"
            className="inline-flex items-center text-primary-600 hover:text-primary-800 mb-6 font-medium"
          >
            <svg
              className="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to News & Events
          </Link>

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-4 text-gray-500 text-sm mb-8 border-b border-gray-200 pb-6">
            <div className="flex items-center">
              <svg
                className="w-4 h-4 mr-1.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {formattedDate}
            </div>
            {item.time && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
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
            {item.location && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
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
            {item.createdBy?.name && (
              <div className="flex items-center">
                <svg
                  className="w-4 h-4 mr-1.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                {item.createdBy.name}
              </div>
            )}
          </div>

          {/* Excerpt */}
          <p className="text-lg text-gray-700 font-medium mb-6 leading-relaxed">
            {item.excerpt}
          </p>

          {/* Full content — render paragraphs */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {item.content.split('\n').map((paragraph, idx) =>
              paragraph.trim() ? (
                <p key={idx} className="mb-4">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>

          {/* Share / CTA area for events */}
          {item.type === 'event' && (item.time || item.location) && (
            <div className="mt-10 bg-primary-50 rounded-xl p-6 border border-primary-100">
              <h3 className="text-lg font-semibold text-primary-900 mb-3">
                Event Details
              </h3>
              <div className="space-y-2 text-primary-800">
                <p>
                  <span className="font-medium">Date:</span> {formattedDate}
                </p>
                {item.time && (
                  <p>
                    <span className="font-medium">Time:</span> {item.time}
                  </p>
                )}
                {item.location && (
                  <p>
                    <span className="font-medium">Location:</span>{' '}
                    {item.location}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsEventDetailPage;
