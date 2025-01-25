import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import routes from "routes.js";
import { createUser } from "services/common";
import { MdOutlineVisibility, MdOutlineVisibilityOff } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import ReactSelect from "react-select";

const CreateUser = () => {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    role: "",
    permissions: [],
    password_confirmation: "",
    subjectCode: [],
    maxBooklets: "",
  });
  const [loading, setLoading] = useState(false);
  const [visibility, setVisibility] = useState(false);
  const [subjects, setSubjects] = useState([]);
  const [selectedChips, setSelectedChips] = useState([]);
  const [showSubjects, setShowSubjects] = useState(false);
  const [showMaximumAllot, setShowMaximumAllot] = useState(false);

  const hardcodedPermissions = {
    evaluator: ["Evaluator Dashboard", "Assigned Tasks", "Profile"],
    moderator: ["Evaluator Dashboard", "Assigned Tasks", "Profile"],
  };

  useEffect(() => {
    if (userDetails.role) {
      if (userDetails.role === "admin") {
        setUserDetails({
          ...userDetails,
          permissions: routes.map((route) => route.name),
        });
        setShowSubjects(false);
        setShowMaximumAllot(false);
      } else if (userDetails?.role === "evaluator") {
        setUserDetails({
          ...userDetails,
          subjectCode: selectedChips,
          permissions: hardcodedPermissions[userDetails?.role] || [],
        });
        setShowSubjects(true);
        setShowMaximumAllot(true);
      } else {
        setUserDetails({
          ...userDetails,
          permissions: hardcodedPermissions[userDetails?.role] || [],
        });
        setShowSubjects(false);
        setShowMaximumAllot(false);
      }
    }
  }, [userDetails.role, selectedChips, setUserDetails]);

  useEffect(() => {
    const fetchedSubjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/getall/subject`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        // console.log(response);
        setSubjects(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedSubjects();
  }, []);

  // const handleChipClick = (chip) => {
  //   if (selectedChips.some((selected) => selected === chip._id)) {
  //     // Remove from array if already selected
  //     setSelectedChips(
  //       selectedChips.filter((selected) => selected !== chip._id)
  //     );
  //   } else {
  //     // Add to array if not selected
  //     setSelectedChips([...selectedChips, chip?._id]);
  //   }
  // };
  // console.log(selectedChips);
  // console.log(routes); // only show major block

  const subjectOptions = subjects.map((subject) => ({
    value: subject._id,
    label: `${subject.name} (${subject.code})`,
  }));

  const handleSubjectChange = (selectedOptions) => {
    // Convert selected options back to the subject IDs
    setSelectedChips(
      selectedOptions ? selectedOptions.map((option) => option.value) : []
    );
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (userDetails.role === "evaluator" && !userDetails.maxBooklets) {
      toast.error("Please enter max allocation");
      setLoading(false);
      return;
    }

    if (userDetails.role === "evaluator" && selectedChips.length === 0) {
      toast.error("Please select at least one subject");
      setLoading(false);
      return;
    }

    // Check if required fields are filled
    if (
      !userDetails?.name ||
      !userDetails?.email ||
      !userDetails?.mobile ||
      !userDetails?.role ||
      !userDetails?.password ||
      userDetails?.permissions?.length === 0
    ) {
      toast.error("All fields are required!");
      setLoading(false);
      return;
    }

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
          setSubjects([]);
          setShowSubjects(false);
          setShowMaximumAllot(false);
        } else {
          toast.error(data?.message || "An error occurred. Please try again.");
        }
      } else {
        toast.error("No response from the server.");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error(
        error?.response?.data?.message ||
          "Failed to create user. Please try again later."
      );
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
        subjectCode: [],
        maxBooklets: "",
      });
      setLoading(false);
    }
  };

  console.log(userDetails);

  return (
    <section>
      <div className="h-full w-full">
        <main className="flex items-center justify-center dark:bg-navy-900">
          <div
            className={`w-full max-w-xl lg:max-w-3xl ${
              showSubjects ? "mt-2" : "mt-6"
            }`}
          >
            <form
              className={`grid max-h-[80vh] grid-cols-6 overflow-y-auto rounded-md border border-gray-700 bg-white p-2 px-6 pb-3 pt-4 shadow-lg dark:bg-navy-700 lg:pt-6 3xl:mt-8 ${
                showSubjects ? "gap-2" : "gap-6"
              }`}
              onSubmit={(e) => handleFormSubmit(e)}
            >
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="FullName"
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="FullName"
                  name="full_name"
                  placeholder="Enter the Name"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white sm:p-2"
                  //                   className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"

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
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Mobile Number
                </label>
                <input
                  type="text"
                  id="mobile"
                  name="mobile"
                  placeholder="Enter Mobile Number"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white sm:p-2"
                  //                   className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"

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
              <div
                className={`${
                  showMaximumAllot
                    ? "col-span-6 sm:col-span-3"
                    : "col-span-6 sm:col-span-6"
                }`}
              >
                <label
                  htmlFor="Email"
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="Email"
                  name="email"
                  placeholder="Enter Email"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white sm:p-2"
                  //                   className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"

                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      email: e.target.value,
                    })
                  }
                  value={userDetails.email}
                />
              </div>
              {showMaximumAllot ? (
                <div className="col-span-6 sm:col-span-3">
                  <label
                    htmlFor="Email"
                    className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                  >
                    Maximum Booklet:
                  </label>
                  <input
                    type="text"
                    id="maxBooklets"
                    name="maxBooklets"
                    placeholder="Enter Max Booklets"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white sm:p-2"
                    //                   className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"
                    // disabled={!showMaximumAllot}

                    onChange={(e) =>
                      setUserDetails({
                        ...userDetails,
                        maxBooklets: e.target.value,
                      })
                    }
                    value={userDetails.maxBooklets}
                  />
                </div>
              ) : (
                ""
              )}
              <div className="col-span-6">
                <label
                  htmlFor="Role"
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white sm:p-2"
                  //                   className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-indigo-500 focus:ring focus:ring-indigo-500 dark:bg-navy-900 dark:text-white sm:p-2"

                  onChange={(e) =>
                    setUserDetails({ ...userDetails, role: e.target.value })
                  }
                  value={userDetails.role}
                >
                  <option value="">Select a role</option>
                  <option value="admin">Admin</option>
                  <option value="moderator">Moderator</option>
                  <option value="evaluator">Evaluator</option>
                </select>
              </div>

              {/* {showSubjects ? (
                <div className="col-span-6">
                  <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                    Subjects:
                  </span>
                  <ul className="m-0 flex list-none flex-wrap justify-center rounded-lg p-1 bg-gray-100 dark:bg-navy-900 h-14 overflow-auto">
                    {subjects.map((data) => {
                      const isSelected = selectedChips.includes(data._id); // Check if the chip is selected
                      return (
                        <li
                          key={data?._id}
                          className="m-2 rounded-2xl border border-gray-200"
                        >
                          <Chip
                            label={data?.name}
                            onClick={() => handleChipClick(data)}
                            color={isSelected ? "success" : "default"} // Green for selected
                            className={`cursor-pointer shadow-md transition-all dark:text-white ${isSelected ? "":"dark:bg-navy-700"}`}
                          />
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : (
                ""
              )} */}

              {showSubjects && (
                <div className="col-span-6">
                  <span className="mb-2 block text-sm font-medium text-gray-700 dark:text-white">
                    Subjects:
                  </span>
                  {/* <ul className="m-0 flex h-auto list-none flex-wrap justify-start overflow-auto rounded-lg bg-gray-100 p-1 dark:bg-navy-900"> */}
                  {/* {selectedChips.map((chipId) => {
                    const subject = subjects.find((s) => s._id === chipId);
                    return (
                      // <li key={chipId} className="m-2 rounded-2xl border border-gray-200">
                        <Chip
                          label={subject?.name}
                          onDelete={() => handleChipClick(chipId)}
                          color="success"
                          className="cursor-pointer shadow-md transition-all dark:bg-navy-700 dark:text-white"
                        />
                      // </li>
                    );
                  })} */}
                  {/* <li className="m-2"> */}
                  <div className="bg-gray-50 dark:bg-[#0b1437]">
                    <ReactSelect
                      isMulti
                      options={subjectOptions}
                      value={subjectOptions.filter((option) =>
                        selectedChips.includes(option.value)
                      )}
                      onChange={handleSubjectChange}
                      className="basic-multi-select"
                      classNamePrefix="select"
                      placeholder="+ Add"
                      closeMenuOnSelect={false}
                      noOptionsMessage={() => "No subjects found"}
                      menuPosition="absolute"
                      styles={{
                        control: (base) => ({
                          ...base,
                          borderRadius: "8px",
                          backgroundColor: "transparent",
                          padding: "2px", // Padding around the input
                          height: "45px",
                          overflow: "auto",
                        }),
                        multiValue: (base) => ({
                          ...base,
                          backgroundColor: "#4caf50", // Chip background color
                          borderRadius: "50px", // Rounded chip
                          padding: "0px 5px", // Padding for chip
                        }),
                        multiValueLabel: (base) => ({
                          ...base,
                          color: "white", // Text color inside chip
                        }),
                        multiValueRemove: (base) => ({
                          ...base,
                          color: "lightgreen", // "X" icon color
                          borderRadius: "50%", // Make "X" button round
                          ":hover": {
                            backgroundColor: "#e57373", // Hover color for "X" button
                            color: "white",
                          },
                        }),
                        menu: (base) => ({
                          ...base,
                          backgroundColor: "white",
                        }),
                      }}
                    />
                  </div>
                  {/* </li> */}
                  {/* </ul> */}
                </div>
              )}

              <div className="col-span-6">
                <label
                  htmlFor="permissions"
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Permissions
                </label>
                <div className="grid grid-cols-2 p-1 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
                  {routes.map((route, index) => (
                    <div className="flex items-center" key={index}>
                      <input
                        type="checkbox"
                        id={route.name}
                        name="permissions"
                        value={route.name}
                        //                         className="sm:h-5 sm:w-5 rounded border-2 border-gray-300 bg-gray-50 text-indigo-600 focus:ring-indigo-500"

                        className="rounded border-2 border-gray-300 bg-gray-50 text-blue-600 focus:ring-blue-500 sm:h-5 sm:w-5"
                        checked={
                          userDetails?.role === "admin"
                            ? userDetails.permissions
                            : hardcodedPermissions[userDetails.role]?.includes(
                                route.name
                              )
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
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Password
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type={visibility ? "text" : "password"}
                    id="Password"
                    name="password"
                    placeholder="Enter Password"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white sm:p-2"
                    //                     className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:p-2"

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
                  className="sm:text-md block text-sm font-medium text-gray-700 dark:text-white"
                >
                  Password Confirmation
                </label>
                <div className="relative flex items-center justify-center">
                  <input
                    type={visibility ? "text" : "password"}
                    id="PasswordConfirmation"
                    name="password_confirmation"
                    placeholder="Confirm Password"
                    className="mt-1 w-full rounded-md border border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-none focus:border-indigo-500 focus:outline-none focus:ring focus:ring-indigo-500 dark:border-gray-700 dark:bg-navy-900 dark:text-white sm:p-2"
                    //                     className="mt-1 w-full rounded-md border-gray-300 bg-gray-50 p-1 text-gray-700 focus:border-blue-500 focus:ring focus:ring-blue-500 dark:bg-navy-900 dark:text-white sm:p-2"

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
              <div className="col-span-6 flex items-center justify-center gap-2 sm:flex-row sm:gap-5">
                <button
                  className={`rounded-md px-2 py-1 text-lg text-white transition sm:px-2 sm:py-1 lg:px-4 lg:py-2 ${
                    loading
                      ? "cursor-not-allowed bg-indigo-400"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-5 w-5 animate-spin text-white"
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
                <h2 className="rounded-md bg-indigo-600 px-2 py-1 text-lg text-white transition-all duration-300 hover:bg-indigo-700 sm:px-2 sm:py-1 lg:px-4 lg:py-2">
                  <Link to={"/admin/uploadcsv"}>Create user by CSV</Link>
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
