import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";
import Button from "../components/common/Button";

function EntrepreneurProfile() {
  const { id } = useParams();
  const [entrepreneur, setEntrepreneur] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    async function fetchEntrepreneur() {
      try {
        const response = await api.get(`/users/${parseInt(id)}`);
        setEntrepreneur(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load entrepreneur profile.");
        setLoading(false);
        console.error("Error fetching entrepreneur:", err);
      }
    }
    if (id) fetchEntrepreneur();
  }, [id]);

  const handleSendRequest = async () => {
    if (!currentUser || currentUser.role !== "investor") {
      setError("Only investors can send requests.");
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
      alert("Collaboration request sent successfully!");
    } catch (err) {
      setError("Failed to send request.");
      console.error("Error sending request:", err);
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;  if (!entrepreneur) return <p className="text-center">Entrepreneur not found.</p>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{entrepreneur.name}'s Profile</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        <p><strong>Bio:</strong> {entrepreneur.bio}</p>
        <p><strong>Startup:</strong> {entrepreneur.startupName}</p>
        <p><strong>Description:</strong> {entrepreneur.startupDescription}</p>
        <p><strong>Funding Needed:</strong> ${entrepreneur.fundingNeed.toLocaleString()}</p>
        <p><strong>Pitch Deck:</strong> <a href={entrepreneur.pitchDeck} className="text-blue-500">Download</a></p>
        {currentUser && currentUser.role === "investor" && currentUser.id !== parseInt(id) && (
          <Button 
            onClick={handleSendRequest} 
            className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            Send Collaboration Request
          </Button>
        )}
      </div>
    </div>
  );
}

export default EntrepreneurProfile;