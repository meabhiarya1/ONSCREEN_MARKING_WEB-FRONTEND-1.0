import React, { useEffect, useState } from "react";
import { getUserDetails } from "../../../services/common";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ProfileOverview = () => {
  const [userData, setUserData] = useState(null);
  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getUserDetails(token);
        setUserData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          // Redirect to sign-in page if unauthorized
          navigate("/auth/sign-in");
        } else {
          console.log(error);
        }
      }
    };
    fetchData();
  }, [token, navigate]);

  

  return (
    <div className="mt-12 flex h-[60vh] w-full items-center justify-center bg-gray-50 dark:bg-navy-900">
      <div className="relative block overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl p-8 sm:p-10 lg:p-12 dark:bg-navy-700 dark:text-white">
        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></span>
        <div className="flex flex-col items-center sm:flex-row sm:gap-8 sm:items-start">
          {/* Profile Picture */}
          <div className="relative flex h-24 w-24 sm:h-32 sm:w-32 items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-md">
            <span className="text-xl font-bold text-white">Profile</span>
          </div>
          {/* User Details */}
          <div className="mt-6 sm:mt-0 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
              {userData?.name || "N/A"}
            </h2>
            <p className="text-lg text-gray-600 mt-2 dark:text-white">Role: {userData?.role || "N/A"}</p>

            <div className="mt-4 space-y-2 text-base text-gray-700 dark:text-white">
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Email:</span> {userData?.email || "N/A"}
              </p>
              <p>
                <span className="font-semibold text-gray-900 dark:text-white">Mobile:</span> {userData?.mobile || "N/A"}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
