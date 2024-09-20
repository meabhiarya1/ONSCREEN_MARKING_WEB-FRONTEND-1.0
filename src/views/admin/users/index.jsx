import React, { useEffect, useState } from "react";
import { getAllUsers } from "services/common";
import Modal from "../../../components/modal/Modal";

const Index = () => {
  const [users, setUsers] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // New state for selected user

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, []);

  // Specify the keys you want to display
  const visibleFields = ["name", "email", "mobile", "role", "date"];

  // Updated handleClick to store the selected user and open the modal
  const handleClick = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  return (
    <div>
      <div className="mt-12 overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-300 bg-white text-sm">
          <thead>
            <tr>
              {visibleFields.map((key) => (
                <th
                  key={key}
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                  {/* Capitalize the first letter */}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300 ">
            {users &&
              users.map((user) => (
                <tr key={user._id}>
                  {visibleFields.map((field) => (
                    <td
                      key={field}
                      className="whitespace-nowrap px-4 py-2 text-gray-700"
                    >
                      {field === "date"
                        ? new Date(user[field]).toLocaleDateString() // Format the date field
                        : user[field]}
                    </td>
                  ))}
                 
                  <td className="whitespace-nowrap px-4 py-2">
                    <button
                      className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                      onClick={() => handleClick(user)}
                    >
                      Edit
                    </button>
                  </td>
                  <td className="whitespace-nowrap px-4 py-2">
                    <button className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700">
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Render the modal when isOpen is true */}
      {isOpen && (
        <Modal user={selectedUser} isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};

export default Index;
