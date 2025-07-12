import React from 'react'
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import InvestorsList from '../components/ProfileLists/InvestorsList';
import InvestorsRequests from '../components/ProfileLists/InvestorsRequests';


const EntrepreneurDashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow p-8">
      <div className="w-full flex justify-between items-center mb-2">
        <button onClick={() => navigate('/dashboard')} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 font-semibold">Main Dashboard</button>
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300 font-semibold">Logout</button>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-green-900 mb-2 font-montserrat drop-shadow">Welcome, Entrepreneur!</h1>
      <p className="text-lg text-green-700 mb-6 text-center max-w-xl">Manage your business, pitch to investors, and grow your network.</p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl">
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">🏢</span>
          <h2 className="font-semibold text-lg mb-1">My Business</h2>
          <p className="text-gray-500 text-sm mb-3 text-center">View and update your business profile and details.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">View Business</button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">💡</span>
          <h2 className="font-semibold text-lg mb-1">Pitch Ideas</h2>
          <p className="text-gray-500 text-sm mb-3 text-center">Submit new business ideas and proposals to investors.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Pitch Now</button>
        </div>
        <div className="bg-white rounded-lg shadow p-6 flex flex-col items-center">
          <span className="text-4xl mb-2">💬</span>
          <h2 className="font-semibold text-lg mb-1">Messages</h2>
          <p className="text-gray-500 text-sm mb-3 text-center">Chat and connect with potential investors.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition duration-300">Go to Chat</button>
        </div>
      </div>
      <div className='w-full flex justify-center items-center mt-2'>
        {/* <InvestorsList/> */}
      <InvestorsRequests/>
      </div>
      
    </div>
  )
}

export default EntrepreneurDashboard
