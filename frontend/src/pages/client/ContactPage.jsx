import { useState } from 'react';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa';
import { contactAPI } from '../../services/api';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setSubmitError('');
    setSubmitSuccess(false);

    try {
      const messageData = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      };

      const response = await contactAPI.sendMessage(messageData);

      if (response.success) {
        setSubmitSuccess(true);
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
      } else {
        setSubmitError(response.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setSubmitError(
        error.response?.data?.error ||
          'Failed to send message. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-navy-900 to-navy-800 text-white py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Get in touch with Shoa Homes - Your trusted real estate partner in
              Addis Ababa
            </p>
          </div>
        </div>
      </section>

      {/* Contact Information & Form */}
      <section className="container-custom py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h2 className="text-3xl font-bold mb-8 text-navy-900">
              Get In Touch
            </h2>

            <div className="space-y-8">
              {/* Headquarters */}
              <div className="bg-white p-6 rounded-2xl shadow-premium">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-navy-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🏢</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-navy-900">
                      Headquarters
                    </h3>
                    <p className="text-gray-600 mb-2">
                      Bole, Addis Ababa
                      <br />
                      Ethiopia
                    </p>
                    <p className="text-gray-600">
                      Serving clients across Addis Ababa and surrounding areas
                    </p>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="bg-white p-6 rounded-2xl shadow-premium">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">📞</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-navy-900">
                      Phone
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <strong>Sales Inquiries:</strong> +251 911 123 456
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Customer Support:</strong> +251 911 234 567
                    </p>
                    <p className="text-gray-600">
                      <strong>Business Hours:</strong> Mon-Fri 8:00 AM - 6:00 PM
                      EAT
                    </p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="bg-white p-6 rounded-2xl shadow-premium">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-navy-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">✉️</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-navy-900">
                      Email
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <strong>General Inquiries:</strong> info@shoahomes.com
                    </p>
                    <p className="text-gray-600 mb-1">
                      <strong>Sales:</strong> sales@shoahomes.com
                    </p>
                    <p className="text-gray-600">
                      <strong>Support:</strong> support@shoahomes.com
                    </p>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white p-6 rounded-2xl shadow-premium">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gold-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🌐</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-navy-900">
                      Follow Us
                    </h3>
                    <div className="flex space-x-4">
                      <a
                        href="https://www.tiktok.com/@shoa.homes.real.e?_r=1&_t=ZM-91kbY2bbRKC"
                        className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center hover:bg-navy-200 transition-colors"
                      >
                        <FaTiktok className="text-navy-600 w-5 h-5" />
                      </a>
                      <a
                        href="https://wa.me/message/SDB2K275RXQAB1"
                        className="w-10 h-10 bg-navy-100 rounded-full flex items-center justify-center hover:bg-navy-200 transition-colors"
                      >
                        <FaWhatsapp className="text-navy-600 w-5 h-5" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-2xl shadow-premium">
            <h2 className="text-3xl font-bold mb-6 text-navy-900">
              Send Us a Message
            </h2>
            <p className="text-gray-600 mb-8">
              Have questions about our properties or services? We&#39;d love to
              hear from you. Fill out the form below and we&#39;ll get back to
              you as soon as possible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
              {submitSuccess && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-6">
                  <p>
                    Thank you for your message! We will get back to you soon.
                  </p>
                </div>
              )}

              {submitError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
                  <p>{submitError}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors"
                    placeholder="+251 911 123 456"
                  />
                </div>
                <div>
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors"
                  >
                    <option value="">Select a subject</option>
                    <option value="property-inquiry">Property Inquiry</option>
                    <option value="investment">Investment Opportunity</option>
                    <option value="partnership">Partnership</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-gold-500 focus:outline-none transition-colors resize-vertical"
                  placeholder="Tell us about your inquiry..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full bg-gradient-to-r from-navy-600 to-navy-700 text-white font-bold py-4 px-6 rounded-lg hover:from-navy-700 hover:to-navy-800 transform hover:scale-105 transition-all duration-300 shadow-premium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Office Locations */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-navy-600 bg-navy-50 rounded-full">
              OUR LOCATIONS
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
              Visit Our Offices
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Find us in prime locations across Addis Ababa for personalized
              service.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Main Office */}
            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Main Office
              </h3>
              <p className="text-gray-600 mb-3">
                Bole Bulbula Area
                <br />
                Addis Ababa, Ethiopia
              </p>
              <p className="text-gray-600 text-sm">
                Our headquarters and primary sales office
              </p>
            </div>

            {/* Sales Office */}
            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🏬</div>
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Sales Center
              </h3>
              <p className="text-gray-600 mb-3">
                Kazanchis Area
                <br />
                Addis Ababa, Ethiopia
              </p>
              <p className="text-gray-600 text-sm">
                Dedicated to property consultations and viewings
              </p>
            </div>

            {/* Project Sites */}
            <div className="bg-gray-50 p-6 rounded-2xl hover:shadow-premium transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-4xl mb-4">🏗️</div>
              <h3 className="text-xl font-bold mb-2 text-navy-900">
                Project Sites
              </h3>
              <p className="text-gray-600 mb-3">
                Multiple Locations
                <br />
                Addis Ababa, Ethiopia
              </p>
              <p className="text-gray-600 text-sm">
                Visit our ongoing and completed projects
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-gold-600 bg-gold-50 rounded-full">
              FAQ
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-navy-900">
                What types of properties do you offer?
              </h3>
              <p className="text-gray-600">
                We offer a wide range of properties including modern apartments,
                spacious villas, elegant penthouses, and commercial spaces
                across Addis Ababa.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-navy-900">
                Do you provide financing options?
              </h3>
              <p className="text-gray-600">
                We work with trusted financial institutions to help our clients
                explore various financing options. Contact us to discuss your
                specific needs.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-navy-900">
                How can I schedule a property viewing?
              </h3>
              <p className="text-gray-600">
                You can contact us directly through phone, email, or by filling
                out the contact form above. We&rsquo;ll arrange a convenient
                time for your property viewing.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-lg font-bold mb-3 text-navy-900">
                What areas of Addis Ababa do you serve?
              </h3>
              <p className="text-gray-600">
                We serve clients across all major areas of Addis Ababa including
                Bole, Kazanchis, CMC, Piazza, and many other prime locations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy-900 to-navy-800 py-20 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Find Your Dream Home?
          </h2>
          <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Browse our extensive collection of premium properties in Addis
            Ababa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/properties"
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold rounded-lg hover:from-gold-400 hover:to-gold-500 transform hover:scale-105 transition-all duration-300 shadow-premium"
            >
              Browse Properties
            </a>
            <a
              href="/about"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transform hover:scale-105 transition-all duration-300"
            >
              Learn More About Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
