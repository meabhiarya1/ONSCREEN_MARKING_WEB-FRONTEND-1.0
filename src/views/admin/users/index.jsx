import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getAllUsers } from "services/common";
import Modal from "../../../components/modal/Modal";
import axios from "axios";
import { toast } from "react-toastify";
const Index = () => {
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();
  }, [isOpen, navigate]);

  // Specify the keys you want to display
  const visibleFields = ["name", "email", "mobile", "role", "date"];

  // Updated handleClick to store the selected user and open the modal
  const handleClick = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const onClickRemove = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/auth/removeUser/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.filter((user) => user._id !== id));
      toast.success(response.data.message);
      console.log(response.data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  };

  return (
    <div className="mt-12 overflow-x-auto">
      <table className="min-w-full table-auto divide-y divide-gray-300 bg-white text-sm">
        <thead className="bg-gray-100">
          <tr>
            {visibleFields.map((key) => (
              <th
                key={key}
                className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </th>
            ))}
            <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Edit
            </th>
            <th className="whitespace-nowrap px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Remove
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200 bg-white">
          {users &&
            users.map((user) => (
              <tr key={user._id} className="bg-white hover:bg-gray-50">
                {visibleFields.map((field) => (
                  <td key={field} className="whitespace-nowrap px-6 py-4 text-sm text-gray-700">
                    {field === "date"
                      ? new Date(user[field]).toLocaleDateString()
                      : user[field]}
                  </td>
                ))}

                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    onClick={() => handleClick(user)}
                  >
                    Edit
                  </button>
                </td>

                {user._id !== localStorage.getItem("userId") && (
                  <td className="whitespace-nowrap px-6 py-4">
                    <button
                      className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-red-700"
                      onClick={() => onClickRemove(user._id)}
                    >
                      Remove
                    </button>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>

      {/* Render the modal when isOpen is true */}
      {isOpen && (
        <Modal user={selectedUser} isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>

  );
};

export default Index;
