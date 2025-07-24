function DashboardHeader({ user }) {
  const bgGradient = user?.role === "investor" 
    ? "from-orange-400 to-amber-400" 
    : "from-blue-400 to-cyan-400";

  return (
    <header className={`bg-gradient-to-r ${bgGradient} bg-opacity-90 backdrop-blur-md p-4 sm:p-6 rounded-2xl shadow-lg mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between border border-white/20 transition-all duration-300`}>
      <div className="flex items-center gap-4 mb-4 sm:mb-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {user?.role === "investor" ? "Investor Dashboard" : "Entrepreneur Dashboard"}
        </h1>
      </div>
      <div className="flex items-center gap-3">
        <div className="bg-white/20 px-4 py-2 rounded-full text-white text-sm font-medium">
          <span className="hidden sm:inline">Last login: </span>
          Today, 10:42 AM
        </div>
        <button className="bg-white/20 hover:bg-white/30 p-2 rounded-full text-white transition-colors duration-200">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
          </svg>
        </button>
      </div>
    </header>
  );
}

export default DashboardHeader;