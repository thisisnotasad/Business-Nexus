import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import { FiSearch, FiBriefcase, FiDollarSign, FiUser, FiClock } from "react-icons/fi";
import { HiOutlineLightBulb, HiOutlineSparkles } from "react-icons/hi";

function EntrepreneursList() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");

  useEffect(() => {
    async function fetchEntrepreneurs() {
      try {
        setLoading(true);
        const response = await api.get("/users?role=entrepreneur");
        setEntrepreneurs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load entrepreneurs. Please try again later.");
        setLoading(false);
        console.error("Error fetching entrepreneurs:", err);
      }
    }
    fetchEntrepreneurs();
  }, []);

  const filteredEntrepreneurs = entrepreneurs.filter(entrepreneur => {
    const matchesSearch = entrepreneur.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         entrepreneur.startupName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === "all" || 
                         entrepreneur.industry?.toLowerCase() === filter.toLowerCase();
    
    return matchesSearch && matchesFilter;
  });

  const sortedEntrepreneurs = [...filteredEntrepreneurs].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (sortBy === "funding") {
      return b.fundingNeed - a.fundingNeed;
    } else if (sortBy === "name") {
      return a.name.localeCompare(b.name);
    }
    return 0;
  });

  const industries = [...new Set(entrepreneurs.map(e => e.industry))].filter(Boolean);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header Section */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Discover Promising Startups</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Connect with innovative entrepreneurs and explore investment opportunities
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search entrepreneurs or startups..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Industries</option>
              {industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-lg"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Recently Added</option>
              <option value="funding">Highest Funding</option>
              <option value="name">Alphabetical</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Entrepreneurs</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{entrepreneurs.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <FiUser className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Active Startups</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {entrepreneurs.filter(e => e.status === 'active').length}
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <HiOutlineLightBulb className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Avg. Funding Need</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                ${Math.round(entrepreneurs.reduce((acc, e) => acc + e.fundingNeed, 0) / entrepreneurs.length || 0).toLocaleString()}
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-lg">
              <FiDollarSign className="text-purple-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Entrepreneurs Grid */}
      {sortedEntrepreneurs.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 flex flex-col items-center justify-center text-center border border-gray-100">
          <HiOutlineSparkles className="text-gray-400 text-5xl mb-4" />
          <h3 className="text-xl font-medium text-gray-900 mb-2">No matching entrepreneurs found</h3>
          <p className="text-gray-500 max-w-md">
            Try adjusting your search or filter criteria to find what you're looking for.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {sortedEntrepreneurs.map((entrepreneur) => (
            <div key={entrepreneur.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 hover:shadow-md transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="relative">
                    <img
                      src={entrepreneur.avatar || "/default-avatar.png"}
                      alt={entrepreneur.name}
                      className="w-14 h-14 rounded-full border-2 border-white shadow-sm object-cover"
                    />
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{entrepreneur.name}</h3>
                    <p className="text-sm text-gray-500 capitalize">{entrepreneur.role}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Startup</p>
                    <p className="text-gray-700">{entrepreneur.startupName}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Industry</p>
                    <p className="text-gray-700 capitalize">{entrepreneur.industry || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Funding Need</p>
                    <p className="text-blue-600 font-semibold">${entrepreneur.fundingNeed?.toLocaleString() || "Not specified"}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium text-gray-500">Overview</p>
                    <p className="text-gray-700 line-clamp-2">{entrepreneur.startupDescription}</p>
                  </div>
                </div>
                
                <div className="mt-6 flex space-x-3">
                  <Link 
                    to={`/profile/entrepreneur/${entrepreneur.id}`}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors duration-200"
                  >
                    View Profile
                  </Link>
                  <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 py-2 px-4 rounded-lg transition-colors duration-200">
                    <FiBriefcase />
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <FiClock className="mr-1" />
                  <span>Joined {new Date(entrepreneur.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                </div>
                {entrepreneur.status === 'active' && (
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default EntrepreneursList;