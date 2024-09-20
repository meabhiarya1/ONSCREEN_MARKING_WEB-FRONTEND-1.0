import React, { useState } from "react";
import { toast } from "react-toastify";
import routes from "routes.js";
import { createUser } from "services/common";

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

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const response = await createUser(userDetails);

    if (response) {
      if (response.status === 201) {
        toast.success(response?.data?.message || "User created successfully!");
      } else {
        toast.error(
          response?.data?.message || "An error occurred. Please try again."
        );
      }
    } else {
      toast.error("No response from server.");
    }
    setUserDetails({
      name: "",
      email: "",
      password: "",
      mobile: "",
      role: "",
      permissions: [],
      password_confirmation: "",
    });
  };

  return (
    <div>
      <section className="bg-white">
        <div className=" w-full lg:min-h-screen">
          <main className="flex items-center justify-center px-8 py-8 sm:px-12 lg:col-span-7 lg:px-16 lg:py-12 xl:col-span-6">
            <div className="max-w-xl lg:max-w-3xl">
              <form
                className="mt-8 grid grid-cols-6 gap-6"
                onSubmit={handleFormSubmit}
              >
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="FullName"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Full Name
                  </label>

                  <input
                    type="text"
                    id="FullName"
                    name="full_name"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
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
                    className="block text-sm font-medium text-gray-700"
                  >
                    Mobile Number
                  </label>

                  <input
                    type="number"
                    id="mobile"
                    name="mobile"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, mobile: e.target.value })
                    }
                    value={userDetails.mobile}
                  />
                </div>
                <div className="col-span-6">
                  <label
                    htmlFor="Email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    Email{" "}
                  </label>

                  <input
                    type="email"
                    id="Email"
                    name="email"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        email: e.target.value,
                      })
                    }
                    value={userDetails.email}
                  />
                </div>

                {/* Role */}
                <div className="col-span-6">
                  <label
                    htmlFor="Role"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Role
                  </label>

                  <select
                    id="role"
                    name="role"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    onChange={(e) =>
                      setUserDetails({ ...userDetails, role: e.target.value })
                    }
                    value={userDetails.role}
                  >
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </div>

                {/* Permissions */}
                <div className="col-span-6 ">
                  <label
                    htmlFor="permissions"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Permissions
                  </label>

                  <div className="mt-1 flex items-center justify-center space-x-4 space-y-2">
                    {routes.map((route, index) => (
                      <div className="mt-2">
                        <input
                          type="checkbox"
                          id={route.name}
                          name="permissions"
                          value={route.name}
                          key={index}
                          className="cursor-pointer rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
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
                          className="ml-2 text-sm text-gray-700"
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
                    className="block text-sm font-medium text-gray-700"
                  >
                    {" "}
                    Password{" "}
                  </label>

                  <input
                    type="password"
                    id="Password"
                    name="password"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        password: e.target.value,
                      })
                    }
                    value={userDetails.password}
                  />
                </div>
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="PasswordConfirmation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Password Confirmation
                  </label>

                  <input
                    type="password"
                    id="PasswordConfirmation"
                    name="password_confirmation"
                    className="mt-1 w-full rounded-md border-gray-200 bg-white text-sm text-gray-700 shadow-sm"
                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        password_confirmation: e.target.value,
                      })
                    }
                    value={userDetails.password_confirmation}
                  />
                </div>
                <div className="col-span-6 sm:flex sm:items-center sm:gap-4">
                  <button className="hover:bg-transparent inline-block shrink-0 rounded-md border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white transition hover:text-blue-600 focus:outline-none focus:ring active:text-blue-500">
                    Create User
                  </button>
                </div>
              </form>
            </div>
          </main>
        </div>
      </section>
    </div>
  );
};

export default CreateUser;
