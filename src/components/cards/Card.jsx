import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Card = ({ course, handleDelete }) => {
  const navigate = useNavigate();
  const [edit, setEdit] = useState(false);

  return (
    <div>
      <article className="mt-8 cursor-pointer overflow-hidden rounded-lg shadow transition hover:shadow-lg">
        <img
          alt=""
          src="https://images.unsplash.com/photo-1524758631624-e2822e304c36?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          className="h-56 w-full object-cover"
        />
        <div className="bg-white p-4 sm:p-6">
          <div>
            <h3 className="mt-0.5 text-lg font-bold text-gray-900">
              Class: {course?.className} ({course?.classCode})
            </h3>
          </div>

          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
            Duration: {course?.duration} Years
          </p>
          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
            Session: {course?.session}
          </p>
          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
            Year: {course?.year}
          </p>
        </div>{" "}
        <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm">
          <button
            onClick={() => setEdit(true)}
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
          >
            Edit
          </button>
          <button
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            onClick={() => navigate(`/admin/classes/${course._id}`)}
          >
            Course Details
          </button>
          <button
            className="inline-block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:relative"
            onClick={() => handleDelete(course._id)}
          >
            Delete
          </button>
        </span>
      </article>{" "}
    </div>
  );
};

export default Card;
