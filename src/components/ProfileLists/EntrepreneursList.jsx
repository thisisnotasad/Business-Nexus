import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Card from "../common/Card";
import Button from "../common/Button";

function InvestorDashboard() {
  const [entrepreneurs, setEntrepreneurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEntrepreneurs() {
      try {
        const response = await api.get("/users?role=entrepreneur");
        setEntrepreneurs(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load entrepreneurs.");
        setLoading(false);
        console.error(err);
      }
    }
    fetchEntrepreneurs();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Requests from Entrepreneurs</h1>
      {entrepreneurs.length === 0 ? (
        <p className="text-gray-500">No entrepreneurs found.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2  lg:grid-cols-2">
          {entrepreneurs.map((entrepreneur) => (
            <Card key={entrepreneur.id}>
              <h3 className="text-lg font-bold">{entrepreneur.name}</h3>
              <p className="text-gray-600">{entrepreneur.startupName}</p>
              <p className="text-sm text-gray-500 truncate">{entrepreneur.startupDescription}</p>
              <p className="mt-2">Funding Needed: ${entrepreneur.fundingNeed.toLocaleString()}</p>
              <Link to={`/profile/entrepreneur/${entrepreneur.id}`}>
                <Button className="mt-4 w-full">View Profile</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

export default InvestorDashboard;