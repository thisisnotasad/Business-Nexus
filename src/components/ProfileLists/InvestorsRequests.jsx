import { useState, useEffect } from "react";
import api from "../../utils/api";
import Card from "../common/Card";
import Button from "../common/Button";

function EntrepreneurDashboard() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user = JSON.parse(localStorage.getItem("currentUser"));

  useEffect(() => {
    async function fetchRequests() {
      try {
        const response = await api.get(`/requests?entrepreneurId=${user.id}`);
        setRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load requests.");
        setLoading(false);
        console.error("Error fetching requests:", err);
      }
    }
    if (user) fetchRequests();
  }, [user]);

  const handleUpdateRequest = async (requestId, newStatus) => {
    try {
      await api.put(`/requests/${requestId}`, { status: newStatus });
      const response = await api.get(`/requests?entrepreneurId=${user.id}`);
      setRequests(response.data);
      alert(`Request ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      setError("Failed to update request.");
      console.error("Error updating request:", err);
    }
  };

  if (!user) return <p className="text-red-500 text-center">Please log in.</p>;
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Requests From Investors</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">No collaboration requests yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {requests.map((request) => (
            <Card key={request.id} className="hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-bold">{request.investorName}</h3>
              <p className="text-gray-600">{request.profileSnippet}</p>
              <p className="mt-2">
                Status: <span className={
                  request.status === "Pending" ? "text-yellow-500" :
                  request.status === "Accepted" ? "text-green-500" : "text-red-500"
                }>{request.status}</span>
              </p>
              {request.status === "Pending" && (
                <div className="mt-4 flex gap-2">
                  <Button
                    onClick={() => handleUpdateRequest(request.id, "Accepted")}
                    className="bg-green-500 hover:bg-green-600 text-white"
                  >
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleUpdateRequest(request.id, "Rejected")}
                    className="bg-red-500 hover:bg-red-600 text-white"
                  >
                    Reject
                  </Button>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default EntrepreneurDashboard;