import React, { useEffect, useState } from "react";
import { getAllUsers } from "services/common";

const Index = () => {
  const [users, setUsers] = useState(null);

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

  return (
    <div>
      <div className="mt-12 overflow-x-auto">
        <table className="min-w-full divide-y-2 divide-gray-300 bg-white text-sm">
          <thead className="">
            <tr >
              {visibleFields.map((key) => (
                <th
                  key={key}
                  className="whitespace-nowrap px-4 py-2 font-medium text-gray-900"
                >
                  {key.charAt(0).toUpperCase() + key.slice(1)}{" "}
                  {/* Capitalize the first letter */}
                </th>
              ))}
              <th className="px-4 py-2">Action</th>{" "}
              {/* Additional action column */}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-300 ">
            {users &&
              users?.map((user) => (
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
                    <a
                      href="#"
                      className="inline-block rounded bg-indigo-600 px-4 py-2 text-xs font-medium text-white hover:bg-indigo-700"
                    >
                      View
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Index;
