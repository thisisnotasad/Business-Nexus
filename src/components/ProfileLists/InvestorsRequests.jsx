import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Card from "../common/Card";
import Button from "../common/Button";

function InvestorsRequests() {
  const { user } = useAuth();
  const currentUser = useMemo(() => user || JSON.parse(localStorage.getItem("currentUser")), [user]);
  const [requests, setRequests] = useState([]);
  const [investorDetails, setInvestorDetails] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchRequestsAndInvestors() {
      if (!currentUser || !currentUser.id) {
        setError("User not logged in or invalid user data.");
        setLoading(false);
        console.error("No currentUser or currentUser.id:", currentUser);
        return;
      }

      try {
        console.log("Fetching requests for entrepreneurId:", currentUser.id);
        const response = await api.get(`/requests?entrepreneurId=${currentUser.id}`);
        const requestsData = response.data;
        console.log("Requests fetched:", requestsData);
        setRequests(requestsData);

        if (requestsData.length === 0) {
          console.log("No requests found for entrepreneurId:", currentUser.id);
          setLoading(false);
          return;
        }

        // Fetch investor details for each request
        const investorPromises = requestsData.map(async (request) => {
          console.log("Fetching investor:", request.investorId);
          try {
            const investorResponse = await api.get(`/users/${request.investorId}`);
            return { id: request.investorId, ...investorResponse.data };
          } catch (err) {
            console.error(`Failed to fetch investor ${request.investorId}:`, err);
            return { id: request.investorId, name: "Unknown Investor", bio: "N/A", interests: [] };
          }
        });
        const investors = await Promise.all(investorPromises);
        const investorMap = investors.reduce((map, investor) => {
          map[investor.id] = investor;
          return map;
        }, {});
        setInvestorDetails(investorMap);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching requests:", err);
        setError(
          err.response?.status === 404
            ? "Requests endpoint not found. Ensure JSON Server is running and db.json has a 'requests' array."
            : `Failed to load requests: ${err.message}`
        );
        setLoading(false);
      }
    }
    if (currentUser) fetchRequestsAndInvestors();
  }, [currentUser.id]); // Depend on currentUser.id to avoid re-renders

  const handleUpdateRequest = async (requestId, newStatus) => {
    try {
      console.log("Updating request:", requestId, newStatus);
      const request = requests.find((r) => r.id === requestId);
      if (!request) {
        throw new Error(`Request with ID ${requestId} not found.`);
      }
      await api.put(`/requests/${requestId}`, { ...request, status: newStatus });
      const response = await api.get(`/requests?entrepreneurId=${currentUser.id}`);
      setRequests(response.data);
      alert(`Request ${newStatus.toLowerCase()} successfully!`);
    } catch (err) {
      console.error("Error updating request:", err);
      setError(`Failed to update request: ${err.message}`);
    }
  };

  if (!currentUser) return <p className="text-red-500 text-center">Please log in.</p>;
  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold text-green-800 mb-4">Collaboration Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No collaboration requests yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          {requests.map((request) => {
            const investor = investorDetails[request.investorId] || {};
            return (
              <Card key={request.id} className="hover:shadow-lg transition-transform hover:scale-105">
                <h3 className="text-lg font-bold text-gray-800">{request.investorName}</h3>
                <p className="text-gray-600"><strong>Bio:</strong> {investor.bio || request.profileSnippet}</p>
                <p className="text-gray-600"><strong>Interests:</strong> {investor.interests?.join(", ") || "Not specified"}</p>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

export default InvestorsRequests;