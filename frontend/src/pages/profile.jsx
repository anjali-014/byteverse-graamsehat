import Navbar from "../components/Navbar";
import { getCurrentUser } from "./utils/auth.js";

export default function Profile() {
  const user = getCurrentUser();

  return (
    <div className="bg-green-50 min-h-screen">
      <Navbar user={user} />

      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">👤 Profile</h1>

        <div className="bg-white p-4 rounded-xl shadow">
          <p><strong>Name:</strong> {user?.name || 'Unknown'}</p>
          <p><strong>ASHA ID:</strong> {user?.ashaId || user?.id || 'N/A'}</p>
          <p><strong>Phone:</strong> {user?.phone || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
}