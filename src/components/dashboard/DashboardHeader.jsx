function DashboardHeader({ title, subtitle, user }) {
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{title}</h1>
        {subtitle && (
          <p className="text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>
        )}
      </div>
      
      {user && (
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 px-4 py-2 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow transition-shadow">
          <div className="relative">
            <img 
              src={user.avatar || "/default-avatar.png"} 
              alt="User" 
              className="h-10 w-10 rounded-full border-2 border-slate-200 dark:border-slate-600"
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800"></span>
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-slate-100">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
          </div>
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;