import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { getAllUsers } from "services/common";
import Modal from "../../../components/modal/Modal";
import axios from "axios";
import { toast } from "react-toastify";
const Index = () => {
  const [users, setUsers] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getAllUsers();
        setUsers(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to sign-in page if unauthorized
          navigate("/auth/sign-in");
        } else {
          console.log(error);
        }
      }
    };
    fetchUsers();
  }, [isOpen, navigate]); // Add navigate to the dependency array

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
                        ? new Date(user[field]).toLocaleDateString()
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
                  {user._id !== localStorage.getItem("userId") && (
                    <td className="whitespace-nowrap px-4 py-2">
                      <button
                        className="inline-block rounded bg-red-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
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
      </div>
      {/* Render the modal when isOpen is true */}
      {isOpen && (
        <Modal user={selectedUser} isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
};

export default Index;
