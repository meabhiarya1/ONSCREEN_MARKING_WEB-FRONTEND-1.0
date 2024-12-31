import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { GiCrossMark } from "react-icons/gi";
import routes from "routes";

const Modal = ({ user, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    permissions: [],
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.mobile || "",
        role: user.role || "",
        permissions: user.permissions || [],
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}/api/auth/update/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setFormData((prevData) => ({
        ...prevData,
        ...response.data.updatedUser,
      }));

      toast.success("User updated successfully!");
      toggleModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update user.");
    }
  };

  const handleCheckboxChange = (routeName) => {
    if (formData.permissions.includes(routeName)) {
      setFormData({
        ...formData,
        permissions: formData.permissions.filter((perm) => perm !== routeName),
      });
    } else {
      setFormData({
        ...formData,
        permissions: [...formData.permissions, routeName],
      });
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-md"></div>
          <div className="relative w-full max-w-lg scale-95 transform rounded-xl bg-white p-3 sm:p-5 shadow-2xl transition-all duration-300 sm:scale-100 dark:bg-navy-700">
            <button
              className="absolute right-4 sm:top-4 p-2 text-2xl text-gray-700 hover:text-red-700 focus:outline-none"
              onClick={toggleModal}
            >
              <GiCrossMark />
            </button>

            <section className="sm:px-4 sm:py-4">
              <h2 className="mb-2 sm:mb-4 text-xl sm:text-3xl font-semibold text-gray-900 dark:text-white">
                Edit User Details
              </h2>
              <div className="rounded-xl bg-gray-100 p-3 sm:p-6 shadow-inner dark:bg-navy-800">
                <form className="space-y-1 sm:space-y-6" onSubmit={handleFormSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-white"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-gray-700 p-2 sm:p-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500  dark:bg-navy-900 dark:text-white"
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-1 sm:gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-white mt-2"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-700 p-2 sm:p-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:bg-navy-900 dark:text-white"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700 dark:text-white mt-2"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-700 p-2 sm:p-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:bg-navy-900 dark:text-white"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="role"
                      className="block text-sm font-medium text-gray-700 dark:text-white mt-2"
                    >
                      Role
                    </label>
                    <select
                      id="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-gray-700 p-2 sm:p-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 dark:bg-navy-900 dark:text-white"
                    >
                      <option value="">Select a role</option>
                      <option value="admin">Admin</option>
                      <option value="reviewer">Reviewer</option>
                      <option value="moderator">Moderator</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="permissions"
                      className="block text-sm font-medium text-gray-700 dark:text-white mt-2"
                    >
                      Permissions
                    </label>
                    <div className="mt-2 flex flex-wrap items-center gap-0.5 sm:gap-2">
                      {routes.map((route, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2"
                        >
                          <input
                            type="checkbox"
                            id={`route-${index}`}
                            name="permissions"
                            value={route.name}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                            checked={formData.permissions.includes(route.name)}
                            onChange={() =>
                              handleCheckboxChange(route.name)
                            }
                          />
                          <label
                            htmlFor={`route-${index}`}
                            className="text-sm text-gray-700 dark:text-white"
                          >
                            {route.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-indigo-600 py-1 sm:py-3 mt-2 font-medium text-white shadow-lg transition duration-300 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      UPDATE
                    </button>
                  </div>
                </form>
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modal;
