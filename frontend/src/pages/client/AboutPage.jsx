import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-navy-900 to-navy-800 text-white py-24">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
              About Shoa Homes
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-8">
              Ethiopia&apos;s Premier Real Estate Developer with 60+ Years of
              Excellence
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/properties"
                className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold rounded-lg hover:from-gold-400 hover:to-gold-500 transform hover:scale-105 transition-all duration-300 shadow-premium"
              >
                View Our Properties
              </Link>
              <a
                href="#story"
                className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transform hover:scale-105 transition-all duration-300"
              >
                Our Story
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section id="story" className="container-custom py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-navy-600 bg-navy-50 rounded-full">
              OUR STORY
            </span>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
              A Legacy of Excellence Since 1957
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6 text-navy-900">
                Company Overview
              </h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Shoa Homes is a proudly Ethiopian real estate company delivering
                high-quality, sustainable, modern, and affordable housing
                solutions. The company extends over 60+ years of the Shoa brand
                legacy, rooted in integrity, quality, and community trust.
              </p>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Our journey began with Shoa Supermarket in 1957, followed by
                landmark developments like the Piassa Somali Tera Haji Buser
                Building. We expanded into real estate with our first project in
                Bole Bulbula (Mariam Mazoriya) and now develop multiple
                residential sites across Addis Ababa, including our 44,000 sq.m
                flagship project.
              </p>
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-gold-600">60+</div>
                  <div className="text-gray-600">Years of Legacy</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <div className="text-3xl font-bold text-gold-600">10+</div>
                  <div className="text-gray-600">Projects Delivered</div>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-premium">
              <h4 className="text-2xl font-bold mb-4 text-navy-900">
                CEO Message
              </h4>
              <blockquote className="text-gray-600 italic text-lg leading-relaxed mb-4">
                &ldquo;At Shoa Homes, the goal is to build modern, affordable
                communities where families truly belong. Every project is rooted
                in excellence, integrity, long-term value, and community-focused
                development.&rdquo;
              </blockquote>
              <p className="text-gray-600">
                We are committed to delivering timely, sustainable, and
                client-centered real estate solutions while creating lasting
                value for clients, partners, and communities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-gold-600 bg-gold-50 rounded-full">
                OUR PURPOSE
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
                Vision & Mission
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-gradient-to-br from-navy-50 to-white p-8 rounded-2xl border border-navy-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-navy-600 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900">
                    Our Mission
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Deliver timely, sustainable, and client-centered real estate
                  solutions while creating lasting value for clients, partners,
                  and communities.
                </p>
              </div>

              <div className="bg-gradient-to-br from-gold-50 to-white p-8 rounded-2xl border border-gold-100">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center mr-4">
                    <svg
                      className="w-8 h-8 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-navy-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Become a national real estate leader known for modern,
                  affordable, and high-quality living spaces.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-navy-600 bg-navy-50 rounded-full">
                OUR VALUES
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
                Core Values That Drive Us
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                Our foundation is built on principles that guide every decision
                and action we take.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-navy-600 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🤝</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Integrity
                </h3>
                <p className="text-gray-600">
                  Honest, transparent operations in all our dealings
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">⭐</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Quality
                </h3>
                <p className="text-gray-600">
                  Excellence in every detail of our work
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-navy-600 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🚀</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Innovation
                </h3>
                <p className="text-gray-600">
                  Modern solutions for tomorrow&apos;s needs
                </p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🌱</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Sustainability
                </h3>
                <p className="text-gray-600">Building for future generations</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-navy-600 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">👥</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Customer Focus
                </h3>
                <p className="text-gray-600">Your needs drive our approach</p>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-premium hover:shadow-premium-lg transition-all duration-300 transform hover:-translate-y-1">
                <div className="w-16 h-16 bg-gold-600 rounded-full flex items-center justify-center mb-6">
                  <span className="text-white text-2xl">🏆</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Excellence
                </h3>
                <p className="text-gray-600">
                  Striving for the highest standards in everything we do
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competence & Strengths */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-gold-600 bg-gold-50 rounded-full">
                OUR STRENGTHS
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
                Why Shoa Homes Stands Out
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-navy-900">
                  Competence & Strengths
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">
                      A trusted national brand with 60+ years of excellence
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">
                      A track record of reliable delivery
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">
                      Focus on modern, affordable homes
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">
                      Expanding presence across Addis Ababa
                    </span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                    <span className="text-gray-600">
                      Skilled multidisciplinary teams
                    </span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-6 text-navy-900">
                  Unique Selling Points
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">
                      Fair Pricing
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Competitive and transparent pricing
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">
                      Diverse Portfolio
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Villas, apartments, penthouses
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">
                      Strong Legacy
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Under Shoa Supermarket heritage
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">
                      Quality Commitment
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Excellence in every project
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">
                      Modern Designs
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Customer-focused architecture
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-navy-900 mb-2">
                      Prime Locations
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Strategic Addis Ababa sites
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="bg-gradient-to-br from-gray-50 to-white py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-navy-600 bg-navy-50 rounded-full">
                OUR PROCESS
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
                Our Development Process
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                A systematic approach ensuring quality and client satisfaction
                at every step.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-navy-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Site Selection
                </h3>
                <p className="text-gray-600">
                  Prime Addis Ababa locations chosen for optimal value
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Design & Planning
                </h3>
                <p className="text-gray-600">
                  Modern architecture with local relevance
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-navy-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Quality Construction
                </h3>
                <p className="text-gray-600">
                  Timely execution at the highest standards
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gold-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl font-bold">4</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-navy-900">
                  Client Handover
                </h3>
                <p className="text-gray-600">
                  Seamless transition with satisfaction focus
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Future Plans */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-gold-600 bg-gold-50 rounded-full">
                FUTURE VISION
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
                Building Tomorrow&apos;s Communities
              </h2>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h3 className="text-2xl font-bold mb-6 text-navy-900">
                  Future Plans & Vision Forward
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Shoa Homes aims to integrate smart housing and sustainability
                  into all future developments. We plan to expand to new
                  city-center sites for 10,000+ households while strengthening
                  national partnerships.
                </p>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Our strategic pillars guide our growth: Build Smart, Deliver
                  Excellence, Grow Together, and Expand Horizons. We are
                  committed to delivering all ongoing projects with top-tier
                  quality.
                </p>
              </div>

              <div className="bg-gradient-to-br from-navy-50 to-white p-8 rounded-2xl">
                <h4 className="text-xl font-bold mb-4 text-navy-900">
                  Strategic Pillars
                </h4>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gold-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 font-medium">
                      Build Smart
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gold-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 font-medium">
                      Deliver Excellence
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gold-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 font-medium">
                      Grow Together
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gold-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 font-medium">
                      Expand Horizons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients & Partners */}
      <section className="bg-gray-50 py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-navy-600 bg-navy-50 rounded-full">
                OUR PARTNERS
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
                Trusted Partners & Clients
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                We collaborate with industry leaders to deliver exceptional
                results.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">🏪</div>
                <h4 className="font-bold text-navy-900">Shoa Supermarket</h4>
                <p className="text-gray-600 text-sm">Sister Company</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">🏗️</div>
                <h4 className="font-bold text-navy-900">
                  SINOMA International
                </h4>
                <p className="text-gray-600 text-sm">Construction Partner</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">🏢</div>
                <h4 className="font-bold text-navy-900">China Construction</h4>
                <p className="text-gray-600 text-sm">Development Partner</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">👷</div>
                <h4 className="font-bold text-navy-900">
                  Daniel Tsegaye Contractor
                </h4>
                <p className="text-gray-600 text-sm">Construction Expert</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">📐</div>
                <h4 className="font-bold text-navy-900">Archie Architects</h4>
                <p className="text-gray-600 text-sm">Design Partner</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">🎨</div>
                <h4 className="font-bold text-navy-900">ATM Designers</h4>
                <p className="text-gray-600 text-sm">Interior Design</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Organizational Structure */}
      <section className="bg-white py-20">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <span className="inline-block px-4 py-2 mb-4 text-sm font-semibold tracking-wider text-gold-600 bg-gold-50 rounded-full">
                OUR TEAM
              </span>
              <h2 className="text-4xl md:text-5xl font-display font-bold mb-4 text-navy-900">
                Organizational Structure
              </h2>
              <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                A dedicated team working together to achieve excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-navy-900 mb-3">Management</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• CEO</li>
                  <li>• Board of Directors</li>
                  <li>• Secretariat</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-navy-900 mb-3">
                  Finance & Admin
                </h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Finance Manager</li>
                  <li>• Cashier</li>
                  <li>• Auditors</li>
                  <li>• HR Manager</li>
                  <li>• Legal Advisor</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-navy-900 mb-3">Technical Team</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Engineers</li>
                  <li>• Architects</li>
                  <li>• Surveyors</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-navy-900 mb-3">Construction</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Site Engineers</li>
                  <li>• Contractors</li>
                  <li>• Supervisors</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-navy-900 mb-3">
                  Sales & Marketing
                </h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Sales Consultants</li>
                  <li>• Telemarketers</li>
                  <li>• Digital Marketing</li>
                </ul>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-bold text-navy-900 mb-3">Operations</h4>
                <ul className="text-gray-600 text-sm space-y-1">
                  <li>• Procurement</li>
                  <li>• Logistics</li>
                  <li>• Store Keeping</li>
                  <li>• R&D</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-navy-900 to-navy-800 py-20 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-10 text-gray-200 max-w-2xl mx-auto">
            Discover modern, affordable homes designed for contemporary
            Ethiopian living.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/properties"
              className="px-8 py-4 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-900 font-bold rounded-lg hover:from-gold-400 hover:to-gold-500 transform hover:scale-105 transition-all duration-300 shadow-premium"
            >
              Explore Properties
            </Link>
            <Link
              to="/"
              className="px-8 py-4 bg-white/10 text-white font-bold rounded-lg hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 transform hover:scale-105 transition-all duration-300"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
