import { useNavigate } from "react-router-dom";

const CardClasses = ({ class_, setEditIsOpen, setCurrentClass, setClassId,
  setConfirmationModal }) => {
  const navigate = useNavigate();

  return (
    <div>
      <article className="mt-8 cursor-pointer overflow-hidden rounded-lg shadow transition hover:shadow-lg dark:bg-navy-700 dark:shadow-gray-800 ease-in-out hover:-translate-y-1 hover:scale-100 duration-300 dark:hover:border dark:border-blue-300">

        <div className="bg-white p-4 sm:p-6 dark:bg-navy-700 dark:shadow-gray-800">
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
        <span className="inline-flex -space-x-px overflow-hidden rounded-md border bg-white shadow-sm dark:bg-navy-700 dark:text-white dark:border-none w-full justify-evenly">
          <button
            className="inline-block px-4 py-2 text-sm font-medium hover:bg-green-500 hover:text-white focus:relative dark:rounded-lg dark:px-5 text-green-500 hover:dark:text-white dark:hover:bg-green-500"
            onClick={() => navigate(`/admin/classes/${class_._id}`)}
          >
            Course Details
          </button>
          <button
            onClick={() => {
              setEditIsOpen(true);
              setCurrentClass(class_);
            }}
            className="inline-block px-4 py-2 text-sm font-medium hover:bg-amber-500 hover:text-white focus:relative dark:rounded-lg dark:px-5 text-amber-500 hover:dark:text-white dark:hover:bg-amber-500"
          >
            Edit
          </button> 
          <button
            className="inline-block px-4 py-2 text-sm font-medium hover:bg-red-500 hover:text-white focus:relative dark:rounded-lg dark:px-5 text-red-500 hover:dark:text-white dark:hover:bg-red-500"
            onClick={() => {
              setClassId(class_._id)
              setConfirmationModal(true)
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
