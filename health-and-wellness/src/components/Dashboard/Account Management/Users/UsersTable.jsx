import React from "react";

const UsersTable = ({ users, onManage }) => {
  return (
    <div className="bg-white rounded-xl shadow border overflow-hidden">
      <table className="min-w-full text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-gray-50 transition">
              <td className="px-4 py-3 font-medium">{user.fullName}</td>
              <td className="px-4 py-3">{user.email}</td>
              <td className="px-4 py-3">{user.role}</td>

              <td className="px-4 py-3">
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    user.status === "Active"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}
                >
                  {user.status}
                </span>
              </td>

              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onManage(user)}
                  className="px-4 py-1.5 text-xs rounded-md border border-green-700 text-green-700 hover:bg-green-700 hover:text-white transition"
                >
                  Manage
                </button>
              </td>
            </tr>
          ))}

          {users.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-6 text-gray-400">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
