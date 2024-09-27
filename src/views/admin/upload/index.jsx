import { FaCloudUploadAlt } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";

const Upload = () => {
  return (
    <div className="mt-8 grid grid-cols-3 py-4">
      <article className="cursor-pointer rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition hover:shadow-lg sm:p-6">
        <div>
          <h3 className="mt-0.5 text-lg font-medium text-gray-900">
            Upload CSV File
            <p className="text-md text-gray-500">User Creation</p>
          </h3>
        </div>

        <div className="flex justify-between">
          <div className="group mt-4 inline-flex items-center gap-1 text-md font-medium text-green-800">
            Download Sample CSV
            <span
              aria-hidden="true"
              className="block transition-all group-hover:ms-0.5 rtl:rotate-180"
            >
              <FaDownload className="m-1 text-xl text-green-800 "  />
            </span>
          </div>

          <div className="group mt-4 inline-flex items-center gap-1 text-md font-medium text-blue-600">
            Upload CSV
            <span
              aria-hidden="true"
              className="block transition-all group-hover:ms-0.5 rtl:rotate-180"
            >
              <FaCloudUploadAlt className="m-1 text-2xl" />
            </span>
          </div>
        </div>
      </article>
      <div>Admin</div>
    </div>
  );
};

export default Upload;
