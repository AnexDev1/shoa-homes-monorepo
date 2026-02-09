import { useState } from 'react';
import { mockProperties } from '../../data/mockData';

const NewsEventsPage = () => {
  const [activeTab, setActiveTab] = useState('news');

  // Property-related news from company information
  const newsItems = [
    {
      id: 'news-1',
      title: 'Bole Bulbula Project Successfully Delivered',
      excerpt: 'Our first apartment project in Bole Bulbula has been successfully delivered to owners. The development features 1 basement & 11 stories with modern amenities.',
      content: 'We are pleased to announce the successful delivery of our first apartment project in Bole Bulbula. This landmark development features 1 basement and 11 stories with diverse housing options, representing our commitment to quality and timely delivery. This project marks a significant milestone in Shoa Homes\' journey of providing modern, affordable housing solutions in Addis Ababa.',
      date: 'December 15, 2025',
      image: '/images/bulbula.jpg',
      category: 'Project Delivery'
    },
    {
      id: 'news-2',
      title: 'Jackros Site: Flagship 44,000 Sq.m Development Underway',
      excerpt: 'Our flagship project at Jackros site spans 44,000 square meters with diverse housing options including apartments and villas.',
      content: 'The Jackros site represents our flagship development project, spanning 44,000 square meters of prime real estate featuring diverse housing options. This comprehensive development includes multiple apartment buildings and villa typologies, showcasing our commitment to creating sustainable communities with modern standards and customer satisfaction as our priority.',
      date: 'December 10, 2025',
      image: '/images/jacros.jpg',
      category: 'Development News'
    },
    {
      id: 'news-3',
      title: 'Wello Sefer Site Progress Update',
      excerpt: 'Construction continues at our Wello Sefer site with an apartment building featuring 3 basements and 19 stories.',
      content: 'Construction is progressing well at our Wello Sefer site where we\'re developing a substantial apartment building featuring 3 basements and 19 stories. This project exemplifies our commitment to creating modern, affordable homes rooted in trust, quality, and a vision to create communities where families truly belong.',
      date: 'December 5, 2025',
      image: '/images/wello.png',
      category: 'Construction Update'
    },
    {
      id: 'news-4',
      title: 'New Villa Typologies Available',
      excerpt: 'Shoa Homes introduces new villa designs including 175 and 200 square meter options with 3 stories and premium amenities.',
      content: 'We\'re excited to announce the availability of new villa typologies in our developments. These include 175 and 200 square meter options with 3 stories, featuring fenced compounds, private parking, private greenery, and gym facilities. These spacious and precisely built villas are designed for your future accommodation with comfort and elegance in mind.',
      date: 'November 28, 2025',
      image: '/images/flagship.png',
      category: 'Product Launch'
    },
    {
      id: 'news-5',
      title: 'Bisrate Gabriel Project in Construction',
      excerpt: 'Our Bisrate Gabriel site is currently under construction with an apartment building featuring 1 basement and 14 stories.',
      content: 'The Bisrate Gabriel site is currently under construction with an apartment building featuring 1 basement and 14 stories. This development continues our expansion across Addis Ababa with multiple residential projects, maintaining our commitment to quality and community-centered urban development.',
      date: 'November 20, 2025',
      image: '/images/hero.webp',
      category: 'Construction News'
    },
    {
      id: 'news-6',
      title: 'Bole Matemiya Site in Design Phase',
      excerpt: 'Our Bole Matemiya site is currently in the design phase with plans for an apartment building featuring 2 basements and 16 stories.',
      content: 'The Bole Matemiya site is currently in the design phase with plans for an apartment building featuring 2 basements and 16 stories. This upcoming project represents our continued commitment to developing contemporary, affordable, and sustainable residential developments across Addis Ababa, following our vision of building communities that stand the test of time.',
      date: 'November 15, 2025',
      image: '/images/bole.jpg',
      category: 'Project Planning'
    }
  ];

  // Sample events data
  const events = [
    {
      id: 'event-1',
      title: 'Open House: Luxury Villa with Pool & Garden',
      description: 'Join us for an exclusive viewing of our luxury villa with private pool and landscaped garden. Light refreshments will be served.',
      date: 'December 30, 2025',
      time: '10:00 AM - 2:00 PM',
      location: 'Bole, Addis Ababa',
      image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&q=80'
    },
    {
      id: 'event-2',
      title: 'Property Investment Seminar',
      description: 'Learn about current market trends and investment opportunities in Addis Ababa real estate. Expert speakers and Q&A session included.',
      date: 'January 5, 2026',
      time: '2:00 PM - 4:00 PM',
      location: 'Shoa Homes Office, Bole',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=1200&q=80'
    },
    {
      id: 'event-3',
      title: 'Homeowners Meetup',
      description: 'Connect with fellow homeowners and property investors. Share experiences and network with industry professionals.',
      date: 'January 12, 2026',
      time: '6:00 PM - 8:00 PM',
      location: 'Grand Hotel, Bole',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=1200&q=80'
    },
    {
      id: 'event-4',
      title: 'New Project Launch: Bole Bulbula Development',
      description: 'Official launch of our newest development project in Bole Bulbula. Discover modern living spaces designed for contemporary families.',
      date: 'January 18, 2026',
      time: '11:00 AM - 3:00 PM',
      location: 'Bole Bulbula Site',
      image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">News & Events</h1>
          <p className="text-xl text-primary-100 max-w-3xl">
            Stay updated with the latest property news, market insights, and upcoming events from Shoa Homes
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
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 font-semibold text-lg ${
              activeTab === 'events'
                ? 'text-primary-600 border-b-2 border-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Events
          </button>
        </div>

        {/* News Section */}
        {activeTab === 'news' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Latest News</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {newsItems.map((news) => (
                <article
                  key={news.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={news.image}
                    alt={news.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <span>{news.date}</span>
                      <span className="mx-2">•</span>
                      <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-xs">
                        {news.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {news.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{news.excerpt}</p>
                    
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Events Section */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{event.description}</p>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <svg className="w-5 h-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-semibold">
                      Register Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsEventsPage;