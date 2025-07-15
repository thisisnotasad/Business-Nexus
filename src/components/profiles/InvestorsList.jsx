import { useState, useEffect } from "react";
import api from "../../utils/api";
import Card from "../../components/common/Card";

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
        console.error(err);
      }
    }
    if (user) fetchRequests();
  }, [user]);

  if (!user) return <p className="text-red-500 text-center">Please log in.</p>;
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Requests from Investors</h1>
      {requests.length === 0 ? (
        <p className="text-gray-500">No collaboration requests yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {requests.map((request) => (
            <Card key={request.id}>
              <h3 className="text-lg font-bold">{request.investorName}</h3>
              <p className="text-gray-600">{request.profileSnippet}</p>
              <p className="mt-2">Status: <span className={request.status === "Pending" ? "text-yellow-500" : "text-green-500"}>{request.status}</span></p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default EntrepreneurDashboard;