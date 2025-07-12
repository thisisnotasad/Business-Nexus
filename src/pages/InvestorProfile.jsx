import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";
import { BriefcaseIcon, LightBulbIcon } from "@heroicons/react/24/outline";

function InvestorProfile() {
  const { id } = useParams();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchInvestor() {
      try {
        const response = await api.get(`/users/${parseInt(id)}`);
        setInvestor(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load investor profile.");
        setLoading(false);
        console.error("Error fetching investor:", err);
      }
    }
    if (id) fetchInvestor();
  }, [id]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!investor) return <p className="text-center text-gray-500 mt-8">Investor not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center overflow-hidden">
              {investor.avatar ? (
                <img
                  src={investor.avatar}
                  alt={investor.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">{investor.name.charAt(0)}</span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">{investor.name}</h1>
              <p className="text-white/80 mb-4">{investor.tagline || "Investing in the future"}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
            <p className="text-gray-600">{investor.bio || "No bio available."}</p>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Investment Focus</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <LightBulbIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-gray-700">Interests</h3>
                </div>
                <p className="text-gray-600">{investor.interests?.join(", ") || "Not specified"}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <BriefcaseIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="font-medium text-gray-700">Portfolio</h3>
                </div>
                <p className="text-gray-600">{investor.portfolio?.join(", ") || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Key Details</h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-lg font-medium">{investor.location || "Not specified"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvestorProfile;