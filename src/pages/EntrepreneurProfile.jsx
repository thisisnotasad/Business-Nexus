import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";
import Button from "../components/common/Button";
import {
  EnvelopeIcon,
  LinkIcon,
  BuildingOfficeIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";

function EntrepreneurProfile() {
  const { id } = useParams();
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    async function fetchEntrepreneurAndRequests() {
      try {
        // Fetch entrepreneur data
        const response = await api.get(`/users/${parseInt(id)}`);
        setEntrepreneur(response.data);

        // Check for existing requests
        if (currentUser && currentUser.role === "investor") {
          const requestsResponse = await api.get(
            `/requests?investorId=${currentUser.id}&entrepreneurId=${parseInt(id)}`
          );
          setHasSentRequest(requestsResponse.data.length > 0);
        }

        setLoading(false);
      } catch (err) {
        setError("Failed to load profile or check requests.");
        setLoading(false);
        console.error("Error:", err);
      }
    }
    if (id) fetchEntrepreneurAndRequests();
  }, [id, currentUser]);

  const handleSendRequest = async () => {
    if (!currentUser || currentUser.role !== "investor") {
      setError("Only investors can send requests.");
      return;
    }
    if (hasSentRequest) {
      setError("You have already sent a request to this entrepreneur.");
      return;
    }
    try {
      await api.post("/requests", {
        investorId: currentUser.id,
        entrepreneurId: parseInt(id),
        investorName: currentUser.name,
        profileSnippet: currentUser.bio || "Interested in your startup.",
        status: "Pending",
      });
      setHasSentRequest(true);
      alert("Collaboration request sent successfully!");
    } catch (err) {
      setError("Failed to send request.");
      console.error("Error sending request:", err);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (!entrepreneur)
    return <p className="text-center text-gray-500 mt-8">User not found.</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Profile Header */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="p-6 md:p-8 text-white">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white/20 bg-white/10 flex items-center justify-center overflow-hidden">
              {entrepreneur.avatar ? (
                <img
                  src={entrepreneur.avatar}
                  alt={entrepreneur.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl font-bold">
                  {entrepreneur.name.charAt(0)}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                {entrepreneur.name}
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <BuildingOfficeIcon className="h-5 w-5" />
                <p className="text-white/90">{entrepreneur.startupName}</p>
              </div>
              <p className="text-white/80 mb-4">
                {entrepreneur.tagline || "Innovating for a better future"}
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  variant="outline-white"
                  className="flex items-center gap-2"
                >
                  <EnvelopeIcon className="h-4 w-4" />
                  Contact
                </Button>
                {currentUser && currentUser.role === "investor" && currentUser.id !== parseInt(id) && (
                  <Button
                    onClick={handleSendRequest}
                    disabled={hasSentRequest}
                    className={`flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white ${hasSentRequest ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {hasSentRequest ? "Request Already Sent" : "Request Collaboration"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - About & Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* About Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">About</h2>
            <p className="text-gray-600">
              {entrepreneur.bio || "No bio available."}
            </p>
          </div>

          {/* Startup Details */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Startup Details
            </h2>
            <p className="text-gray-600 mb-4">
              {entrepreneur.startupDescription}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <CurrencyDollarIcon className="h-5 w-5 text-indigo-600" />
                  <h3 className="font-medium text-gray-700">Funding Needed</h3>
                </div>
                <p className="text-2xl font-bold text-gray-900">
                  ${entrepreneur.fundingNeed?.toLocaleString() || "Not specified"}
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-2">
                  <DocumentTextIcon className="h-5 w-5 text-purple-600" />
                  <h3 className="font-medium text-gray-700">Pitch Deck</h3>
                </div>
                {entrepreneur.pitchDeck ? (
                  <a
                    href={entrepreneur.pitchDeck}
                    className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <LinkIcon className="h-4 w-4" />
                    Download Pitch Deck
                  </a>
                ) : (
                  <p className="text-gray-500">Not available</p>
                )}
              </div>
            </div>
          </div>

          {/* Additional Fields Section */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              More Information
            </h2>
            <div className="space-y-4">
              <div className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-gray-700 mb-1">Industry</h3>
                <p className="text-gray-600">
                  {entrepreneur.industry || "Not specified"}
                </p>
              </div>
              <div className="border-b pb-4 last:border-0 last:pb-0">
                <h3 className="font-medium text-gray-700 mb-1">Stage</h3>
                <p className="text-gray-600">
                  {entrepreneur.stage || "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Stats & Quick Actions */}
        <div className="space-y-6">
          {/* Stats Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Key Metrics
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Team Size</p>
                <p className="text-lg font-medium">
                  {entrepreneur.teamSize || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Traction</p>
                <p className="text-lg font-medium">
                  {entrepreneur.traction || "Not specified"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Location</p>
                <p className="text-lg font-medium">
                  {entrepreneur.location || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Button variant="outline-indigo">Schedule Meeting</Button>
              <Button variant="outline-purple">Request Financials</Button>
              <Button variant="outline-gray">Save to Watchlist</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EntrepreneurProfile;