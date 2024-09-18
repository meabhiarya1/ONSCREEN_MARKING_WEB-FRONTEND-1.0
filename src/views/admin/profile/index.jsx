import React, { useEffect, useState } from "react";
import { getUserDetails } from "../../../services/common";
import { useSelector } from "react-redux";

const ProfileOverview = () => {
  const [userData, setUserData] = useState(null);
  const token =
    useSelector((state) => state.auth.token) || localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getUserDetails(token);
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="mt-12 flex h-[50vh] w-full items-center justify-center">
      <div className="relative block overflow-hidden rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
        <span className="absolute inset-x-0 bottom-0 h-2 bg-gradient-to-r from-green-300 via-blue-500 to-purple-600"></span>

        <div className="sm:flex sm:justify-between sm:gap-4 ">
          <div className="my-8 text-center sm:text-left">
            <h3 className="text-lg font-bold text-gray-900 sm:text-xl">
              Building a SaaS product as a software developer
            </h3>

            <p className=" mt-4 text-lg font-medium text-gray-600">
              By {userData?.name}
            </p>
            <p className="mt-1 text-lg font-medium text-gray-600">
              Email: {userData?.email}
            </p>
            <p className="mt-1 text-lg font-medium text-gray-600">
              Mobile: {userData?.mobile}
            </p>
            <p className="mt-1 text-lg font-medium text-gray-600">
              Role: {userData?.role}
            </p>
          </div>

          {/* Image */}
          <div className="hidden sm:block sm:shrink-0">
            <img
              alt=""
              src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1180&q=80"
              className="size-32 rounded-lg object-cover shadow-sm md:size-64"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;
