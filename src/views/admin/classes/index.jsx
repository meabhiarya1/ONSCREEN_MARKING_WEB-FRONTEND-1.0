import React, { useEffect, useState } from "react";
import CardClasses from "components/cards/CardClasses";
import { getAllClasses } from "../../../services/common";
import ClassModal from "components/modal/ClassModal";
import axios from "axios";
import { toast } from "react-toastify";
import EditClassModal from "components/modal/EditClassModal";

const Index = () => {
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setEditIsOpen] = useState(false);

  const [formData, setFormData] = useState({
    className: "",
    classCode: "",
    duration: "",
    session: "",
    year: "",
  });

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await getAllClasses();
        setClasses(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData) {
      toast.warning("All the fields are required.")
      return;
    }

    if (!formData.className || !formData.classCode || !formData.duration || !formData.session || !formData.year) {
      toast.warning("All the fields are required.")
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/classes/create/class`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setClasses((prevClasses) => [response.data, ...prevClasses]);
      toast.success("Class added successfully.");
      setIsOpen(false);
    } catch (error) {
      console.log(error)

      toast.error(error.response.data.error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/classes/remove/class/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setClasses(classes.filter((class_) => class_._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="hover:bg-indigo-700  mt-12 inline-block cursor-pointer rounded 
        border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm 
        font-medium text-white hover:text-white-600 focus:outline-none focus:ring active:text-white-500"
        onClick={() => setIsOpen(true)}
      >
        Create More Class
      </div>

      <ClassModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />

      <EditClassModal
        isEditOpen={isEditOpen}
        setEditIsOpen={setEditIsOpen}
        currentClass={currentClass}
        formData={formData}
        setFormData={setFormData}
        classes={classes}
        setClasses={setClasses}
      />

      <div className="grid w-full grid-cols-3 gap-4">
        {classes.length > 0 ? (
          classes.map((class_, index) => (
            <CardClasses
              key={class_._id}
              class_={class_}
              handleDelete={handleDelete}
              setEditIsOpen={setEditIsOpen}
              setCurrentClass={setCurrentClass}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center col-span-full mt-12">
            <p className="text-gray-700 text-lg font-semibold">
              No classes available. Create one to get started!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
