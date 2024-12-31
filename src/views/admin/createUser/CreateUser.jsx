import React, { useState } from "react";
import { toast } from "react-toastify";
import routes from "routes.js";
import { createUser } from "services/common";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";

const CreateUser = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "",
    permissions: [],
    password_confirmation: "",
  });
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Check if password is empty or less than 8 characters
    if (!userDetails?.password?.trim()) {
      toast.error("Please enter a new password.");
      setLoading(false);
      return;
    }

    if (userDetails?.password.length < 8) {
      toast.error("Password must be at least 8 characters.");
      setLoading(false);
      return;
    }

    // Check if password confirmation matches
    if (userDetails?.password !== userDetails?.password_confirmation) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }

    // Check if required fields are filled
    if (!userDetails?.name || !userDetails?.email || !userDetails?.mobile || !userDetails?.role || !userDetails?.password) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

    // Mobile number validation
    if (userDetails.mobile.length !== 10 || isNaN(userDetails.mobile)) {
      toast.error("Mobile number must be 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await createUser(userDetails);

      if (response) {
        const { status, data } = response;
        if (status === 201) {
          toast.success(data?.message || "User created successfully!");
        } else {
          toast.error(data?.message || "An error occurred. Please try again.");
        }
      } else {
        toast.error("No response from the server.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(error?.response?.data?.message || "Failed to create user. Please try again later.");
    } finally {
      // Reset form fields
      setUserDetails({
        name: "",
        email: "",
        password: "",
        mobile: "",
        role: "",
        permissions: [],
        password_confirmation: "",
      });
      setLoading(false);
    }
  };


  return (
    <section>
      <div className="w-full h-full">
        <main className="flex items-center justify-center dark:bg-navy-900">
          <div className="max-w-xl lg:max-w-3xl w-full mt-8">
            <form
              className="grid grid-cols-6 gap-6 rounded-md border border-gray-700 p-6 bg-white shadow-lg overflow-y-auto max-h-[80vh] dark:bg-navy-700"
              onSubmit={handleFormSubmit}
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FullName"
                  className="text-sm sm:text-md block font-medium text-gray-700 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="FullName"
                  name="full_name"
                  placeholder="Enter the Name"
                  className="mt-1 w-full rounded-md border-gray-300 p-1 sm:p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      name: e.target.value,
                    })
                  }
                  value={userDetails.name}
                />
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="mobile"
                  className="text-sm sm:text-md block font-medium text-gray-700 dark:text-white"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  className="mt-1 w-full rounded-md border-gray-300 p-1 sm:p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
                  maxLength="10"
                  pattern="\d*"
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    if (value.length <= 10) {
                      setUserDetails({ ...userDetails, mobile: value });
                    }
                  }}
                  value={userDetails.mobile}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Email"
                  className="text-sm sm:text-md block font-medium text-gray-700 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  placeholder="Enter Email"
                  className="mt-1 w-full rounded-md border-gray-300 p-1 sm:p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      email: e.target.value,
                    })
                  }
                  value={userDetails.email}
                />
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="Role"
                  className="text-sm sm:text-md block font-medium text-gray-700 dark:text-white"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 w-full rounded-md border-gray-300 p-1 sm:p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-indigo-500 focus:border-indigo-500 dark:bg-navy-900 dark:text-white"
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, role: e.target.value })
                  }
                  value={userDetails.role}
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="reviewer">Reviewer</option>
                  <option value="moderator">Moderator</option>
                </select>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="permissions"
                  className="text-sm sm:text-md block font-medium text-gray-700 dark:text-white"
                >
                  Permissions
                </label>
                <div className="grid grid-cols-2 sm:gap-4 p-1 sm:grid-cols-3 lg:grid-cols-4">
                  {routes.map((route, index) => (
                    <div className="flex items-center" key={index}>
                      <input
                        type="checkbox"
                        id={route.name}
                        name="permissions"
                        value={route.name}
                        className="sm:h-5 sm:w-5 rounded border-2 border-gray-300 bg-gray-50 text-blue-600 focus:ring-blue-500"
                        checked={
                          userDetails?.role === "admin"
                            ? userDetails.permissions
                            : userDetails.permissions.includes(route.name)
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setUserDetails({
                              ...userDetails,
                              permissions: [
                                ...userDetails.permissions,
                                e.target.value,
                              ],
                            });
                          } else {
                            setUserDetails({
                              ...userDetails,
                              permissions: userDetails.permissions.filter(
                                (permission) => permission !== e.target.value
                              ),
                            });
                          }
                        }}
                      />
                      <label
                        htmlFor={route.name}
                        className="ml-2 text-sm text-gray-700 dark:text-white"
                      >
                        {route.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="Password"
                  className="text-sm sm:text-md block font-medium text-gray-700 dark:text-white"
                >
                  Password
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type={visibility ? "text" : "password"}
                    id="Password"
                    name="password"
                    placeholder="Enter Password"
                    className="mt-1 w-full rounded-md border-gray-300 p-1 sm:p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-navy-900 dark:text-white"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        password: e.target.value,
                      })
                    }
                    value={userDetails.password}
                  />
                  {visibility ? (
                    <MdOutlineVisibility
                      className="absolute right-2 cursor-pointer text-gray-600"
                      onClick={() => setVisibility(!visibility)}
                    />
                  ) : (
                    <MdOutlineVisibilityOff
                      className="absolute right-2 cursor-pointer text-gray-600"
                      onClick={() => setVisibility(!visibility)}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="PasswordConfirmation"
                  className="text-sm sm:text-md block font-medium text-gray-700 dark:text-white"
                >
                  Password Confirmation
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type={visibility ? "text" : "password"}
                    id="PasswordConfirmation"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    className="mt-1 w-full rounded-md border-gray-300 p-1 sm:p-2 bg-gray-50 text-gray-700 focus:ring focus:ring-blue-500 focus:border-blue-500 dark:bg-navy-900 dark:text-white"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        password_confirmation: e.target.value,
                      })
                    }
                    value={userDetails.password_confirmation}
                  />
                  {visibility ? (
                    <MdOutlineVisibility
                      className="absolute right-2 cursor-pointer text-gray-600"
                      onClick={() => setVisibility(!visibility)}
                    />
                  ) : (
                    <MdOutlineVisibilityOff
                      className="absolute right-2 cursor-pointer text-gray-600"
                      onClick={() => setVisibility(!visibility)}
                    />
                  )}
                </div>
              </div>

              <div className="col-span-6 flex sm:flex-row justify-center items-center gap-2 sm:gap-5">
                <button
                  className={`rounded-md bg-indigo-600 px-2 py-1 sm:px-2 sm:py-1 lg:px-4 lg:py-2 text-lg text-white transition hover:bg-indigo-700 ${loading ? 'cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin h-5 w-5 mr-2 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      Creating...
                    </div>
                  ) : (
                    "Create User"
                  )}
                </button>
                <h2 className="text-lg rounded-md bg-indigo-600 hover:bg-indigo-700 text-white px-2 py-1 sm:px-2 sm:py-1 lg:px-4 lg:py-2 transition-all duration-300">
                  <Link to={'/admin/uploadcsv'}>
                    Create user by CSV
                  </Link>
                </h2>

              </div>
            </form>
          </div>
        </main>
      </div>
    </section>
  );
};

export default CreateUser;
