import { HiOutlineChatAlt2, HiOutlineUserAdd, HiOutlineDocumentText } from "react-icons/hi";

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "message",
      user: "Alex Johnson",
      action: "sent you a message",
      time: "2 hours ago",
      icon: <HiOutlineChatAlt2 className="text-blue-500" />
    },
    {
      id: 2,
      type: "connection",
      user: "Sarah Miller",
      action: "requested to connect",
      time: "5 hours ago",
      icon: <HiOutlineUserAdd className="text-green-500" />
    },
    {
      id: 3,
      type: "document",
      user: "TechStart Inc.",
      action: "shared a pitch deck",
      time: "1 day ago",
      icon: <HiOutlineDocumentText className="text-purple-500" />
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map(activity => (
          <div key={activity.id} className="flex items-start gap-3">
            <div className="bg-gray-100 p-2 rounded-lg">
              {activity.icon}
            </div>
            <div className="flex-1">
              <p className="font-medium">{activity.user} <span className="font-normal text-gray-600">{activity.action}</span></p>
              <p className="text-sm text-gray-500">{activity.time}</p>
            </div>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path>
              </svg>
            </button>
          </div>
        ))}
      </div>
      <button className="mt-4 text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center">
        View all activity
        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
        </svg>
      </button>
    </div>
  );
}