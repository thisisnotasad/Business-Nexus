import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaTwitter, FaGlobe, FaUser, FaTachometerAlt, FaSignOutAlt, FaChevronDown } from "react-icons/fa";

function DashboardHeader({ user }) {
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <header className="bg-white dark:bg-slate-900 bg-opacity-90 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-xl mb-6 flex items-center justify-between border border-indigo-100/50 dark:border-slate-800/50 transition-all duration-300 animate__fadeIn">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          {user?.role === "investor" ? "Investor Dashboard" : "Entrepreneur Dashboard"}
        </h1>
      </div>

      {user && (
        <div className="hidden relative ">
          <button
            onClick={toggleDropdown}
            className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-indigo-100/50 dark:border-slate-700/50 hover:shadow-md transition-all duration-200"
          >
            <div className="relative">
              <img
                src={user.avatar || "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
                alt={user.name}
                className="h-10 w-10 rounded-full border-2 border-indigo-200 dark:border-slate-600 animate__bounceIn"
                onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")}
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-teal-500 rounded-full border-2 border-white dark:border-slate-800"></span>
            </div>
            <div className="hidden sm:block">
              <p className="font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
            </div>
            <FaChevronDown className="text-indigo-600 dark:text-indigo-400" size={16} />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-indigo-100/50 dark:border-slate-700/50 animate__fadeIn z-50">
              <div className="p-3">
                <div className="flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded transition-colors">
                  <img
                    src={user.avatar || "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
                    alt={user.name}
                    className="h-8 w-8 rounded-full"
                    onError={(e) => (e.target.src = "https://images.unsplash.com/photo-1502685104226-ee32379f453f?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150")}
                  />
                  <div>
                    <p className="font-medium text-sm text-slate-800 dark:text-slate-100">{user.name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                  </div>
                </div>
                <hr className="border-indigo-100 dark:border-slate-700 my-2" />
                <button
                  onClick={() => navigate(`/dashboard/${user.role}`)}
                  className="w-full flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <FaTachometerAlt size={16} /> Dashboard
                </button>
                <button
                  onClick={() => navigate(`/profile/${user.role}/${user.id}`)}
                  className="w-full flex items-center gap-2 p-2 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <FaUser size={16} /> Profile
                </button>
                <div className="flex gap-3 p-2">
                  {user.socialLinks?.linkedin && (
                    <a
                      href={user.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      <FaLinkedin size={20} />
                    </a>
                  )}
                  {user.socialLinks?.twitter && (
                    <a
                      href={user.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      <FaTwitter size={20} />
                    </a>
                  )}
                  {user.socialLinks?.website && (
                    <a
                      href={user.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    >
                      <FaGlobe size={20} />
                    </a>
                  )}
                </div>
                <hr className="border-indigo-100 dark:border-slate-700 my-2" />
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 p-2 text-red-500 dark:text-red-400 hover:bg-indigo-50 dark:hover:bg-slate-700 rounded transition-colors"
                >
                  <FaSignOutAlt size={16} /> Logout
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;