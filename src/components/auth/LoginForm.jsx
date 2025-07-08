import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import api from "../../utils/api";
import Input from "../common/Input";
import Button from "../common/Button";

function LoginForm() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const {login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if user exists
      const response = await api.get(`/users?email=${formData.email}`);
      const users = response.data;
      console.log('Respone: ',response );
      console.log('Users: ',users);

      if (users.length === 0) {
        setError("No account found with this email.");
        return;
      }

      const user = users[0];
      console.log('User: ',user);
      if (user.password !== formData.password) {
        setError("Incorrect password.");
        return;
      }

      // Successful login
      localStorage.setItem("currentUser", JSON.stringify(user));
      login(user); // set user in context

      navigate(`/dashboard/${user.role}`,{replace: true}); // Redirect to dashboard based on role 
    } catch (err) {
      setError("An error occurred. Please try again.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/90 p-6 rounded-2xl shadow-xl w-full max-w-[90vw] sm:max-w-md mx-auto mt-10 border border-blue-100 backdrop-blur-sm">
      <div className="flex flex-col items-center mb-4">
        <span className="text-2xl font-extrabold text-blue-700 tracking-tight font-montserrat mb-1">Business Nexus</span>
        <span className="text-xs text-blue-400 font-semibold uppercase tracking-widest">Sign In</span>
      </div>
      {/* <h2 className="text-3xl font-bold text-blue-700 mb-6 text-center font-montserrat drop-shadow">Login</h2> */}
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
      />
      <Input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        className="mb-4"
        autoComplete="password"
        required
      />
      <Button type="submit" className="w-full">Login</Button>
      <div className="mt-4 text-center">
        <span className="text-gray-600">Don't have an account? </span>
        <Link to="/register" className="text-blue-600 hover:underline font-medium">Register</Link>
      </div>
    </form>
  );
}

export default LoginForm;