import { useNavigate } from "react-router-dom";

const CardClasses = ({
  class_,
  setEditIsOpen,
  setCurrentClass,
  setClassId,
  setConfirmationModal,
}) => {
  const navigate = useNavigate();

  return (
    <div>
      <article className="ml-2 mr-2 mt-3 md:mt-6 cursor-pointer overflow-hidden rounded-lg shadow transition duration-300 ease-in-out hover:-translate-y-1 hover:scale-100 hover:shadow-lg dark:border-blue-300 dark:bg-navy-700 dark:shadow-gray-800 dark:hover:border md:mr-4 lg:mr-4 xl:mr-4 2xl:mr-2">
        <div className="bg-white p-4 dark:bg-navy-700 dark:shadow-gray-800">
          <div>
            <h3 className="mt-0.5 text-lg font-bold text-gray-900 dark:text-white">
              Class: {class_?.className} ({class_?.classCode})
            </h3>
          </div>

          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
            Duration: {class_?.duration} Years
          </p>
          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
            Session: {class_?.session}
          </p>
          <p className="mt-2 line-clamp-3 text-sm/relaxed text-gray-500">
            Year: {class_?.year}
          </p>
        </div>{" "}
        <span className="inline-flex w-full justify-evenly -space-x-px overflow-hidden rounded-md border bg-white shadow-sm dark:border-none dark:bg-navy-700 dark:text-white">
          <button
            className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-green-100 hover:text-green-600 focus:outline-none focus:ring-green-300 dark:border-green-500 dark:text-gray-400 dark:hover:bg-green-800 dark:hover:text-green-100 dark:focus:ring-green-700"
            onClick={() => navigate(`/admin/classes/${class_._id}`)}
          >
            Course Details
          </button>
          <button
            onClick={() => {
              setEditIsOpen(true);
              setCurrentClass(class_);
            }}
            className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-amber-100 hover:text-amber-600 focus:outline-none focus:ring-amber-300 dark:border-amber-500 dark:text-gray-400 dark:hover:bg-amber-800 dark:hover:text-amber-100 dark:focus:ring-amber-700"
          >
            Edit
          </button>
          <button
            className="inline-block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:bg-red-100 hover:text-red-600 focus:outline-none focus:ring-red-300 dark:border-red-500 dark:text-gray-400 dark:hover:bg-red-800 dark:hover:text-red-100 dark:focus:ring-red-700"
            onClick={() => {
              setClassId(class_._id);
              setConfirmationModal(true);
            }}
          >
            Delete
          </button>
        </span>
      </article>{" "}
    </div>
  );
};

export default CardClasses;
