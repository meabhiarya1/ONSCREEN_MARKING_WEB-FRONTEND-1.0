import React, { useEffect, useState } from "react";
import CourseCard from "components/cards/CourseCard";
import CourseModal from "components/modal/CourseModal";
import EditCourseModal from "components/modal/EditCourseModal";
import { toast } from "react-toastify";
import axios from "axios";
import ConfirmationModal from "components/modal/ConfirmationModal";
import { useParams } from "react-router-dom";

const Index = () => {
  const [subjects, setSubjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState(false);
  const [subjectId, setSubjectId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchedData = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/subjects/getallsubjectbasedonclass/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSubjects(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form submission

    const classData = {
      ...formData,
      classId: id, // Include classId from params
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/subjects/create/subject`,
        classData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSubjects((preSubjects) => [...preSubjects, response.data]);

      // Clear form data after successful submission
      setFormData({
        name: "",
        code: "",
      });

      console.log(response);
      toast.success("Course added successfully 🙂");
      setIsOpen(false); // Close modal on success
    } catch (error) {
      toast.error(error.response?.data?.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/subjects/remove/subject/${subjectId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubjects(subjects.filter((subject) => subject._id !== subjectId));
      toast.success(response.data.message);
      setConfirmationModal(false)
    } catch (error) {
      console.log(error);
    }
    finally {
      setSubjectId("")
    }
  };

  return (
    <div>
      <div
        className="hover:bg-transparent mt-12 inline-block cursor-pointer rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:text-white-600 focus:outline-none focus:ring active:text-indigo-500"
        onClick={() => setIsOpen(true)}
      >
        Create subject
      </div>

      <CourseModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        formData={formData}
        loading={loading}
      />

      <EditCourseModal
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        currentSubject={currentSubject}
        formData={formData}
        setFormData={setFormData}
        courses={subjects}
        setCourses={setSubjects}
      />

      <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-10 gap-5">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <CourseCard
              key={subject._id}
              subject={subject}
              setConfirmationModal={setConfirmationModal}
              setSubjectId={setSubjectId}
              setIsEditOpen={setIsEditOpen}
              setCurrentSubject={setCurrentSubject}
            />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center col-span-full mt-12">
            <p className="text-gray-700 text-lg font-semibold">
              No subjects available. Create one to get started!
            </p>
          </div>
        )}
      </div>

      <ConfirmationModal
        confirmationModal={confirmationModal}
        onSubmitHandler={handleDelete}
        setConfirmationModal={setConfirmationModal}
        setId={setSubjectId}
        heading="Confirm subject Removal"
        message="Are you sure you want to remove this subject? Please note that removing this subject will also permanently delete all associated schemas and data. This action cannot be undone."
        type="error" // Options: 'success', 'warning', 'error'
      />
    </div>
  );
};

export default Index;
