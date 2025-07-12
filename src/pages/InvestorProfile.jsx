import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../utils/api";

function InvestorProfile() {
  const { id } = useParams();
  const [investor, setInvestor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInvestor() {
      try {
        const response = await api.get(`/users/${id}`);
        setInvestor(response.data);
        console.log(response.data)
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
    fetchInvestor();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!investor) return <p>User not found.</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">{investor.name}'s Profile</h1>
      <p>Bio: {investor.bio}</p>
      <p>Interests: {investor.interests.join(", ")}</p>
      <p>Portfolio: {investor.portfolio.join(", ")}</p>
    </div>
  );
}

export default InvestorProfile;