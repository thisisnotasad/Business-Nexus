import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import EditProfileForm from "../components/profiles/EditProfileForm";
import { FaLinkedin, FaTwitter, FaGlobe, FaUser, FaTachometerAlt, FaSignOutAlt } from "react-icons/fa";

function InvestorProfile() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [investor, setInvestor] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchInvestor = async () => {
    try {
      console.log("Fetching investor:", id);
      const response = await api.get(`/users/${id}`);
      if (response.data.role !== "investor") {
        throw new Error("User is not an investor");
      }
      setInvestor(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.status === 404 ? "User not found" : "Failed to load profile");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvestor();
  }, [id]);

  if (loading) return <p className="text-center animate-pulse text-gray-600 text-lg">Loading...</p>;
  if (error) return <p className="text-red-500 text-center text-lg font-medium">{error}</p>;
  if (!investor) return <p className="text-red-500 text-center text-lg font-medium">Investor not found</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 hidden md:block sticky top-0 h-screen">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              src={user?.avatar || "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-lg font-semibold text-gray-800">{user?.name}</h2>
          </div>
          <nav className="flex flex-col gap-2">
            <button
              onClick={() => navigate(`/dashboard/${user?.role}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <FaTachometerAlt /> Dashboard
            </button>
            <button
              onClick={() => navigate(`/profile/${user?.role}/${user?.id}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-blue-500 transition-colors"
            >
              <FaUser /> Profile
            </button>
            <button
              onClick={logout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-8 rounded-xl shadow-2xl mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-opacity-10 bg-black backdrop-blur-sm"></div>
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <img
              src={investor.avatar || "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
              alt={investor.name}
              className="w-40 h-40 rounded-full border-4 border-white shadow-lg animate__bounceIn"
              onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")}
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">{investor.name}</h1>
              <p className="text-lg opacity-90 mt-1">{investor.location || "Location not specified"}</p>
              <div className="flex gap-4 mt-3">
                {investor.socialLinks?.linkedin && (
                  <a
                    href={investor.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <FaLinkedin size={48} />
                  </a>
                )}
                {investor.socialLinks?.twitter && (
                  <a
                    href={investor.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <FaTwitter size={48} />
                  </a>
                )}
                {investor.socialLinks?.website && (
                  <a
                    href={investor.socialLinks.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <FaGlobe size={48} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {user && user.id === id && (
          <div className="mb-8">
            <Button
              onClick={() => setIsEditing(!isEditing)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-transform hover:scale-105 shadow-md"
            >
              {isEditing ? "Cancel Edit" : "Edit Profile"}
            </Button>
          </div>
        )}

        {isEditing && user && user.id === id && (
          <Card className="mb-8 bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl animate__fadeIn">
            <EditProfileForm user={investor} onUpdate={fetchInvestor} />
          </Card>
        )}

        {!isEditing && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl animate__fadeIn hover:shadow-2xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">About</h2>
            <p className="text-gray-600 text-lg"><strong>Bio:</strong> {investor.bio || "Not specified"}</p>
            <p className="text-gray-600 text-lg"><strong>Experience:</strong> {investor.experience || "Not specified"}</p>
            <p className="text-gray-600 text-lg"><strong>Interests:</strong> {investor.interests?.join(", ") || "Not specified"}</p>
          </Card>

          <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl animate__fadeIn hover:shadow-2xl transition-shadow">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Investment Portfolio</h2>
            <p className="text-gray-600 text-lg"><strong>Portfolio:</strong> {investor.portfolio?.join(", ") || "Not specified"}</p>
          </Card>
        </div>
        )}

        <div className="mt-8">
          {user && user.role === "entrepreneur" && (
            <Button
              onClick={() => navigate(`/chat/investor/${id}`)}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition-transform hover:scale-105 shadow-md"
            >
              Go to Chat
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default InvestorProfile;