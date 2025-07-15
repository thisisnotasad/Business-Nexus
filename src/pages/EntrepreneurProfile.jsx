import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../utils/api";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import EditProfileForm from "../components/profiles/EditProfileForm";
import {
  FaLinkedin,
  FaTwitter,
  FaGlobe,
  FaUser,
  FaTachometerAlt,
  FaSignOutAlt,
} from "react-icons/fa";

function EntrepreneurProfile() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [hasRequested, setHasRequested] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchEntrepreneurAndRequests = async () => {
    try {
      console.log("Fetching entrepreneur:", id);
      const response = await api.get(`/users/${id}`);
      if (response.data.role !== "entrepreneur") {
        throw new Error("User is not an entrepreneur");
      }
      setEntrepreneur(response.data);

      if (user && user.role === "investor") {
        console.log(
          "Checking existing request for investorId:",
          user.id,
          "entrepreneurId:",
          id
        );
        const requestResponse = await api.get(
          `/requests?investorId=${user.id}&entrepreneurId=${id}`
        );
        console.log("Request check response:", requestResponse.data);
        setHasRequested(requestResponse.data.length > 0);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(
        err.response?.status === 404
          ? "User not found"
          : "Failed to load profile"
      );
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrepreneurAndRequests();
  }, [id, user]);

  const handleRequestCollaboration = async () => {
    if (!user || user.role !== "investor") {
      alert("Only investors can send collaboration requests.");
      return;
    }
    try {
      console.log("Sending collaboration request:", {
        investorId: user.id,
        entrepreneurId: id,
      });
      await api.post("/requests", {
        id: Date.now().toString(),
        investorId: user.id,
        entrepreneurId: id,
        investorName: user.name,
        profileSnippet: `Interested in ${entrepreneur.startupName}`,
        status: "Pending",
      });
      setHasRequested(true);
      alert("Collaboration request sent!");
    } catch (err) {
      console.error(
        "Error sending request:",
        err.response?.data || err.message
      );
      setError("Failed to send collaboration request");
    }
  };

  if (loading)
    return (
      <p className="text-center animate-pulse text-gray-600 text-lg">
        Loading...
      </p>
    );
  if (error)
    return (
      <p className="text-red-500 text-center text-lg font-medium">{error}</p>
    );
  if (!entrepreneur)
    return (
      <p className="text-red-500 text-center text-lg font-medium">
        Entrepreneur not found
      </p>
    );

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4 hidden md:block sticky top-0 h-screen">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <img
              src={
                user?.avatar ||
                "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
              }
              alt={user?.name}
              className="w-10 h-10 rounded-full"
            />
            <h2 className="text-lg font-semibold text-gray-800">
              {user?.name}
            </h2>
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
              src={
                entrepreneur.avatar ||
                "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
              }
              alt={entrepreneur.name}
              className="w-40 h-40 rounded-full border-4 border-white shadow-lg animate__bounceIn"
              onError={(e) =>
                (e.target.src =
                  "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")
              }
            />
            <div>
              <h1 className="text-4xl font-bold tracking-tight">
                {entrepreneur.name}
              </h1>
              <p className="text-lg font-medium">{entrepreneur.startupName}</p>
              <p className="text-lg opacity-90 mt-1">
                {entrepreneur.location || "Location not specified"}
              </p>
              <div className="flex gap-4 mt-3">
                {entrepreneur.socialLinks?.linkedin && (
                  <a
                    href={entrepreneur.socialLinks.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <FaLinkedin size={48} />
                  </a>
                )}
                {entrepreneur.socialLinks?.twitter && (
                  <a
                    href={entrepreneur.socialLinks.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-blue-300 transition-colors"
                  >
                    <FaTwitter size={48} />
                  </a>
                )}
                {entrepreneur.socialLinks?.website && (
                  <a
                    href={entrepreneur.socialLinks.website}
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
            <EditProfileForm
              user={entrepreneur}
              onUpdate={fetchEntrepreneurAndRequests}
            />
          </Card>
        )}

        {!isEditing && (
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl animate__fadeIn hover:shadow-2xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                About
              </h2>
              <p className="text-gray-600 text-lg">
                <strong>Bio:</strong> {entrepreneur.bio || "Not specified"}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Experience:</strong>{" "}
                {entrepreneur.experience || "Not specified"}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Industry:</strong>{" "}
                {entrepreneur.industry || "Not specified"}
              </p>
            </Card>

            <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl animate__fadeIn hover:shadow-2xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Startup Details
              </h2>
              <p className="text-gray-600 text-lg">
                <strong>Name:</strong>{" "}
                {entrepreneur.startupName || "Not specified"}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Description:</strong>{" "}
                {entrepreneur.startupDescription || "Not specified"}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Funding Need:</strong> $
                {entrepreneur.fundingNeed?.toLocaleString() || "Not specified"}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Pitch Deck:</strong>{" "}
                {entrepreneur.pitchDeck ? (
                  <a
                    href={entrepreneur.pitchDeck}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    View Pitch
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
            </Card>

            <Card className="bg-white bg-opacity-80 backdrop-blur-md shadow-xl rounded-xl animate__fadeIn hover:shadow-2xl transition-shadow">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                Key Metrics
              </h2>
              <p className="text-gray-600 text-lg">
                <strong>Stage:</strong> {entrepreneur.stage || "Not specified"}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Traction:</strong>{" "}
                {entrepreneur.traction || "Not specified"}
              </p>
              <p className="text-gray-600 text-lg">
                <strong>Team Size:</strong>{" "}
                {entrepreneur.teamSize || "Not specified"}
              </p>
            </Card>
          </div>
        )}
        <div className="mt-8 flex gap-4">
          {user && user.role === "investor" && (
            <Button
              onClick={handleRequestCollaboration}
              disabled={hasRequested}
              className={`font-semibold py-2 px-6 rounded-lg transition-transform hover:scale-105 shadow-md ${
                hasRequested
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {hasRequested ? "Request Already Sent" : "Request Collaboration"}
            </Button>
          )}
          {user && user.role === "investor" && (
            <Button
              onClick={() => navigate(`/chat/entrepreneur/${id}`)}
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

export default EntrepreneurProfile;
