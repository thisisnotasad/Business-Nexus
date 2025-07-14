import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../../utils/api";
import Input from "../common/Input";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";

function RegisterForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "entrepreneur",
    name: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check for existing email using GET /users/email/:email
      const response = await api.get(`/users/email/${encodeURIComponent(formData.email)}`);
      if (response.data) {
        setError("Email already registered.");
        return;
      }

      // Create new user
      const newUser = {
        id: `${Math.floor(Math.random() * 1000000)}`, // Generate unique ID
        email: formData.email,
        password: formData.password,
        role: formData.role,
        name: formData.name || `User${Math.floor(Math.random() * 1000)}`,
        bio: "", // Add default fields required by backend
        interests: [],
        portfolio: []
      };
      const createResponse = await api.post("/users", newUser);

      // Successful registration
      localStorage.setItem("currentUser", JSON.stringify(createResponse.data));
      login(createResponse.data); // Set user in context
      navigate(`/dashboard/${newUser.role}`, { replace: true });
    } catch (err) {
      if (err.response?.status === 404) {
        // Email not found, proceed with registration
        try {
          const newUser = {
            id: `${Math.floor(Math.random() * 1000000)}`,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            name: formData.name || `User${Math.floor(Math.random() * 1000)}`,
            bio: "",
            interests: [],
            portfolio: []
          };
          const createResponse = await api.post("/users", newUser);
          localStorage.setItem("currentUser", JSON.stringify(createResponse.data));
          login(createResponse.data);
          navigate(`/dashboard/${newUser.role}`, { replace: true });
        } catch (createErr) {
          setError(createErr.response?.data?.error || "Failed to create user. Please try again.");
          console.error('Registration Error:', createErr);
        }
      } else {
        setError(err.response?.data?.error || "An error occurred. Please try again.");
        console.error('Registration Error:', err);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 p-6 rounded-2xl shadow-xl w-full max-w-[90vw] sm:max-w-md mx-auto mt-10 border border-green-100 backdrop-blur-sm">
      <div className="flex flex-col items-center mb-4">
        <span className="text-2xl font-extrabold text-blue-700 tracking-tight font-montserrat mb-1">Business Nexus</span>
        <span className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Sign Up</span>
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <Input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Full Name"
        className="mb-4"
      />
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="mb-4"
        required
      />
      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="mb-4"
        required
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
      >
        <option value="entrepreneur">Entrepreneur</option>
        <option value="investor">Investor</option>
      </select>
      <Button type="submit" className="w-full">Register</Button>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Already have an account? </span>
        <Link to="/login" className="text-blue-600 hover:underline font-medium">Login</Link>
      </div>
    </form>
  );
}

export default RegisterForm;