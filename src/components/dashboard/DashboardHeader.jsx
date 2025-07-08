
function DashboardHeader({ title, subtitle, user }) {
  let avatarSrc = "/src/assets/images/logo.png";
  if (user && user.avatar) {
    avatarSrc = user.avatar.startsWith("http") ? user.avatar : `/src/assets/images/${user.avatar}`;
  }
  return (
    <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-2">
      <div>
        <h1 className="text-3xl font-extrabold text-blue-800 font-montserrat drop-shadow mb-1">{title}</h1>
        {subtitle && <p className="text-gray-500 font-medium text-base">{subtitle}</p>}
      </div>
      {user && (
        <div className="flex items-center gap-3 bg-blue-50 px-4 py-2 rounded-lg shadow">
          <img src={avatarSrc} alt="User Avatar" className="h-10 w-10 rounded-full border border-blue-200 object-cover" />
          <div>
            <div className="font-bold text-blue-900">{user.name}</div>
            <div className="text-xs text-blue-500">{user.role}</div>
          </div>
        </div>
      )}
    </header>
  );
}

export default DashboardHeader;
