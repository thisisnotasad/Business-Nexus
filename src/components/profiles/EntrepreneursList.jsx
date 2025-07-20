import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../utils/api";
import Card from "../common/Card";
import Button from "../common/Button";

function EntrepreneursList() {
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
        console.error("Error fetching entrepreneurs:", err);
      }
    }
    fetchEntrepreneurs();
  }, []);

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-red-500 text-center">{error}</p>;

  return (
    <>
      <div className="w-full mt-8">
        <h2 className="text-2xl font-semibold text-slate-800 mb-4 text-center">Discover Entrepreneurs</h2>
        <div className="w-full">
          {entrepreneurs.length === 0 ? (
            <p className="text-gray-500">No entrepreneurs found.</p>
          ) : (
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {entrepreneurs.map((entrepreneur) => (
                <Card key={entrepreneur.id} className="hover:shadow-lg transition-transform hover:scale-105">
                  <h3 className="text-lg font-bold text-gray-800">{entrepreneur.name}</h3>
                  <p className="text-gray-600"><strong>Startup:</strong> {entrepreneur.startupName}</p>
                  <p className="text-sm text-gray-500 truncate"><strong>Overview:</strong> {entrepreneur.startupDescription}</p>
                  <p className="mt-2"><strong>Funding:</strong> ${entrepreneur.fundingNeed.toLocaleString()}</p>
                  <Link to={`/profile/entrepreneur/${entrepreneur.id}`}>
                    <Button className="mt-4 w-full bg-blue-500 hover:bg-blue-600 text-white">
                      View Profile
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default EntrepreneursList;