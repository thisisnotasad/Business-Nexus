import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Input from "../common/Input";
import Button from "../common/Button";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
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
      await login(formData.email, formData.password);
      navigate(`/dashboard/${JSON.parse(localStorage.getItem("currentUser")).role}`, { 
        replace: true 
      });
    } catch (err) {
      setError(err.message || "An error occurred. Please try again.");
      console.error('Login Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 p-6 rounded-2xl shadow-xl w-full max-w-[90vw] sm:max-w-md mx-auto mt-10 border border-blue-100 backdrop-blur-sm">
      <div className="flex flex-col items-center mb-4">
        <span className="text-2xl font-extrabold text-blue-700 tracking-tight font-montserrat mb-1">Business Nexus</span>
        <span className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Sign In</span>
      </div>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <Input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="mb-4"
        autoComplete="username"
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
        autoComplete="current-password"
        required
        disabled={isLoading}
      />
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
            Processing...
          </span>
        ) : "Login"}
      </Button>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <Link 
          to="/register" 
          className="text-blue-600 hover:underline font-medium"
          tabIndex={isLoading ? -1 : 0}
        >
          Register
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;