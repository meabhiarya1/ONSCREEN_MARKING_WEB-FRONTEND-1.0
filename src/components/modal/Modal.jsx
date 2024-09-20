import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Modal = ({ user, isOpen, setIsOpen }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    permissions: [],
  });

  const [newPermission, setNewPermission] = useState("");

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

  const handlePermissionChange = (e) => {
    setNewPermission(e.target.value);
  };

  const addPermission = (e) => {
    if (e.key === "Enter" || e.type === "click") {
      if (newPermission && !formData.permissions.includes(newPermission)) {
        setFormData((prevData) => ({
          ...prevData,
          permissions: [...prevData.permissions, newPermission],
        }));
        setNewPermission("");
      }
    }
  };

  const removePermission = (permission) => {
    setFormData((prevData) => ({
      ...prevData,
      permissions: prevData.permissions.filter((perm) => perm !== permission),
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

      // Log the response to ensure it contains the updated data
      console.log("Update response:", response.data);

      // Manually update the formData with the updated data from the response
      setFormData((prevData) => ({
        ...prevData,
        ...response.data.updatedUser, // Assuming response contains updated user
      }));

      toast.success("User updated successfully!");
      toggleModal();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to update user.");
    }
  };

  return (
    <div>
      {isOpen && (
        <div className="bg-black fixed inset-0 z-50 flex items-center justify-center bg-opacity-50 transition-opacity duration-300">
          <div className="relative w-full max-w-lg scale-95 transform rounded-lg bg-white p-8 shadow-lg transition-all duration-300 sm:scale-100">
            <button
              className="absolute right-4 top-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={toggleModal}
            >
              ✖
            </button>

            <section className="px-6 py-8">
              <h2 className="mb-4 text-2xl font-bold text-gray-900">
                Edit User Details
              </h2>
              <div className="rounded-lg bg-gray-100 p-6 shadow-inner">
                <form className="space-y-6" onSubmit={handleFormSubmit}>
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                      placeholder="Enter name"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter email"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Phone
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="mt-1 w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Enter phone number"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="permissions"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Permissions
                    </label>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      {formData.permissions.map((permission, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 rounded-full bg-indigo-100 px-3 py-1 text-sm text-indigo-600"
                        >
                          <span>{permission}</span>
                          <button
                            type="button"
                            className="text-indigo-500 hover:text-indigo-700"
                            onClick={() => removePermission(permission)}
                          >
                            ✖
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <input
                        type="text"
                        id="permissions"
                        value={newPermission}
                        onChange={handlePermissionChange}
                        onKeyDown={addPermission} // Replace onKeyPress with onKeyDown
                        className="w-full rounded-lg border border-gray-300 p-3 text-sm shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
                        placeholder="Add new permission"
                      />
                      <button
                        type="button"
                        onClick={addPermission} // Add permission on button click
                        className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-md hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
                      >
                        Add
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      type="submit"
                      className="w-full rounded-lg bg-indigo-600 py-3 font-medium text-white shadow-lg transition duration-300 hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                    >
                      Save Changes
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
