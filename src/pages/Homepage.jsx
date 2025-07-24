import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHandshake, FaChartLine, FaComments, FaUserTie, FaLightbulb } from 'react-icons/fa';

const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FaLightbulb className="text-indigo-600 text-2xl" />
          <span className="text-xl font-bold text-gray-800">Business Nexus</span>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate('/login')}
            className="px-4 py-2 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Connecting <span className="text-indigo-600">Visionaries</span> with <span className="text-indigo-600">Investors</span>
        </h1>
        <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
          The premier platform where entrepreneurs meet investors to turn innovative ideas into successful businesses.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button 
            onClick={() => navigate('/register?role=entrepreneur')}
            className="px-8 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            I'm an Entrepreneur
          </button>
          <button 
            onClick={() => navigate('/register?role=investor')}
            className="px-8 py-3 border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors"
          >
            I'm an Investor
          </button>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Why Choose Business Nexus?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaHandshake className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Connections</h3>
              <p className="text-gray-600">
                Our matching algorithm ensures you connect with the most relevant investors or entrepreneurs for your needs.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaChartLine className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Growth Opportunities</h3>
              <p className="text-gray-600">
                Entrepreneurs gain access to funding while investors discover the next big opportunity.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-indigo-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FaComments className="text-indigo-600 text-xl" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Direct Communication</h3>
              <p className="text-gray-600">
                Built-in chat system allows seamless communication between matched users.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features */}
      <section className="py-16 max-w-6xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">How It Works</h2>
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">For Entrepreneurs</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Create a compelling profile showcasing your startup
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Get discovered by investors matching your industry
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Receive and manage collaboration requests
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Communicate directly with interested investors
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-indigo-50 p-8 rounded-xl">
              <FaUserTie className="text-indigo-600 text-5xl mx-auto mb-4" />
              <p className="text-center text-gray-700 italic">
                "Business Nexus helped me connect with the right investors who believed in my vision."
              </p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row-reverse items-center gap-8">
            <div className="md:w-1/2">
              <h3 className="text-2xl font-semibold mb-4">For Investors</h3>
              <ul className="space-y-3 text-gray-600">
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Browse vetted entrepreneurs in your areas of interest
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  View detailed profiles with pitch information
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Initiate collaboration requests with promising startups
                </li>
                <li className="flex items-start">
                  <span className="text-indigo-600 mr-2">•</span>
                  Communicate directly with entrepreneurs
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 bg-indigo-50 p-8 rounded-xl">
              <FaChartLine className="text-indigo-600 text-5xl mx-auto mb-4" />
              <p className="text-center text-gray-700 italic">
                "I've found three incredible startups to invest in through Business Nexus."
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-indigo-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join Business Nexus today and take the first step towards your entrepreneurial journey or next great investment.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={() => navigate('/register?role=entrepreneur')}
              className="px-8 py-3 bg-white text-indigo-600 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Sign Up as Entrepreneur
            </button>
            <button 
              onClick={() => navigate('/register?role=investor')}
              className="px-8 py-3 border-2 border-white text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Sign Up as Investor
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <FaLightbulb className="text-indigo-400 text-xl" />
            <span className="text-white font-medium">Business Nexus</span>
          </div>
          <div className="text-sm">
            © {new Date().getFullYear()} Business Nexus. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;