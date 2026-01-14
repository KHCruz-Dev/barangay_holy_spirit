import React, { useEffect, useState } from "react";
import { FaUsers, FaUserCheck, FaUserClock } from "react-icons/fa";

import SummaryCard from "./SummaryCard";
import UsersTable from "./UsersTable";
import UserManagementModal from "./UserManagementModal";
import InputFloatingLabel from "../../../Common/InputFloatingLabel";

import { getUsers } from "../../../../config/services/users/userService";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  async function loadUsers() {
    try {
      const data = await getUsers();

      const mapped = data.map((u) => ({
        ...u,
        fullName: `${u.first_name} ${u.last_name}`,
        role: u.role,
        status: u.status,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error("Failed to load users", err);
    }
  }

  const summaryData = [
    {
      title: "Total Users",
      value: users.length,
      icon: FaUsers,
    },
    {
      title: "Active Users",
      value: users.filter((u) => u.status === "Active").length,
      icon: FaUserCheck,
    },
    {
      title: "Pending Approval",
      value: users.filter((u) => u.status === "Pending").length,
      icon: FaUserClock,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">Users</h1>
      <p className="text-sm text-gray-600 mt-2">
        Manage registered user accounts within your department.
      </p>

      <hr className="my-4 border-gray-300" />

      <h2 className="text-lg font-medium text-gray-800">Quick Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2 pb-6">
        {summaryData.map((item, i) => (
          <SummaryCard key={i} {...item} />
        ))}
      </div>

      <hr className="my-1 border-gray-300" />

      <div className="mt-4 mb-4 w-full sm:w-96 bg-white border rounded-md p-4 shadow-sm">
        <InputFloatingLabel label="Search User" />
      </div>

      <hr className="my-1 border-gray-300" />

      <UsersTable users={users} onManage={setSelectedUser} />

      <UserManagementModal
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
        onUpdated={loadUsers}
      />
    </div>
  );
};

export default Users;
