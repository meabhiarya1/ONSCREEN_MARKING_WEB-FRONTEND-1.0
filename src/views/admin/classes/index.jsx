import React, { useEffect, useState } from "react";
import CardClasses from "components/cards/CardClasses";
import { getAllClasses } from "../../../services/common";
import ClassModal from "components/modal/ClassModal";
import axios from "axios";
import { toast } from "react-toastify";
import EditClassModal from "components/modal/EditClassModal";
import ConfirmationModal from "components/modal/ConfirmationModal";

const Index = () => {
  const [classes, setClasses] = useState([]);
  const [currentClass, setCurrentClass] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setEditIsOpen] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [classId, setClassId] = useState("");

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
      toast.warning("All the fields are required.");
      return;
    }

    console.log(formData);

    if (
      !formData.className ||
      !formData.classCode ||
      !formData.duration ||
      !formData.session ||
      !formData.year
    ) {
      toast.warning("All the fields are required.");
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
      console.log(error);
      toast.error(error.response.data.error);
    } finally {
      setFormData({
        className: "",
        classCode: "",
        duration: "",
        session: "",
        year: "",
      });
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/classes/remove/class/${classId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setClasses(classes?.filter((class_) => class_?._id !== classId));
    } catch (error) {
      console.log(error);
    } finally {
      setClassId("");
      setConfirmationModal(false);
    }
  };

  return (
    <div>
      <div
        className="hover:text-white-600  active:text-white-500 ml-2 mt-12 inline-block 
        cursor-pointer rounded-md border border-indigo-600 bg-indigo-600 px-12 
        py-3 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring mb-4"
        onClick={() => setIsOpen(true)}
      >
        Create Class
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

      <div className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {classes?.length > 0 ? (
          classes?.map((class_, index) => (
            <CardClasses
              key={class_?._id}
              setClassId={setClassId}
              setConfirmationModal={setConfirmationModal}
              class_={class_}
              handleDelete={handleDelete}
              setEditIsOpen={setEditIsOpen}
              setCurrentClass={setCurrentClass}
            />
          ))
        ) : (
          <div className="col-span-full mt-12 flex flex-col items-center justify-center">
            <p className="text-lg font-semibold text-gray-700">
              No classes available. Create one to get started!
            </p>
          </div>
        )}
      </div>

      <ConfirmationModal
        confirmationModal={confirmationModal}
        onSubmitHandler={handleDelete}
        setConfirmationModal={setConfirmationModal}
        setId={setClassId}
        heading="Confirm Class Removal"
        message="Are you sure you want to remove this class? Please note that removing this class will also permanently delete all associated subjects and data. This action cannot be undone."
        type="error" // Options: 'success', 'warning', 'error'
      />
    </div>
  );
};

export default Index;
