import { FaHandshake, FaLightbulb, FaUserFriends } from "react-icons/fa";

export default function QuickStats() {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
      <h3 className="text-lg font-semibold mb-4">Quick Stats</h3>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-blue-50 p-3 rounded-lg text-center">
          <div className="bg-blue-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaUserFriends className="text-blue-600" />
          </div>
          <p className="text-sm text-gray-600">Connections</p>
          <p className="font-bold text-lg">24</p>
        </div>
        <div className="bg-orange-50 p-3 rounded-lg text-center">
          <div className="bg-orange-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaHandshake className="text-orange-600" />
          </div>
          <p className="text-sm text-gray-600">Collaborations</p>
          <p className="font-bold text-lg">5</p>
        </div>
        <div className="bg-green-50 p-3 rounded-lg text-center">
          <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2">
            <FaLightbulb className="text-green-600" />
          </div>
          <p className="text-sm text-gray-600">Opportunities</p>
          <p className="font-bold text-lg">12</p>
        </div>
      </div>
    </div>
  );
}