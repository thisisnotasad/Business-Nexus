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
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isLoading) return;
    
    setIsLoading(true);
    setError("");

    try {
      // Email check
      const response = await api.get(`/users/email/${encodeURIComponent(formData.email)}`);
      if (response.data) {
        setError("Email already registered.");
        return;
      }
    } catch (err) {
      if (err.response?.status !== 404) {
        setError(err.response?.data?.error || "Error checking email. Please try again.");
        console.error('Email Check Error:', err);
        return;
      }
    }

    try {
      // User creation
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
      
      await api.post("/users", newUser);
      await login(newUser.email, newUser.password);
      navigate(`/dashboard/${newUser.role}`, { replace: true });
    } catch (createErr) {
      setError(createErr.response?.data?.error || "Failed to create user. Please try again.");
      console.error('Registration Error:', createErr);
    } finally {
      setIsLoading(false);
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
        disabled={isLoading}
      />
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="mb-4"
        required
        disabled={isLoading}
      />
      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="mb-4"
        required
        disabled={isLoading}
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        className="w-full p-2 mb-4 border rounded"
        disabled={isLoading}
      >
        <option value="entrepreneur">Entrepreneur</option>
        <option value="investor">Investor</option>
      </select>
      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating account...
          </span>
        ) : "Register"}
      </Button>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Already have an account? </span>
        <Link 
          to="/login" 
          className="text-blue-600 hover:underline font-medium"
          tabIndex={isLoading ? -1 : 0}
        >
          Login
        </Link>
      </div>
    </form>
  );
}

export default RegisterForm;