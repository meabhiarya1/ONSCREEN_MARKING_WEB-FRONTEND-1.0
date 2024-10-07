import React, { useEffect, useState } from "react";
import CourseCard from "components/cards/CourseCard";
import CourseModal from "components/modal/CourseModal";
import EditCourseModal from "components/modal/EditCourseModal";
import { toast } from "react-toastify";
import axios from "axios";
import { useParams } from "react-router-dom";

const Index = () => {
  const [subjects, setSubjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentSubject, setCurrentSubject] = useState(null);
  // Use useState for managing form inputs
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });

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
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/subjects/remove/subject/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSubjects(subjects.filter((subject) => subject._id !== id));
      toast.success(response.data.message);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <div
        className="hover:bg-transparent mt-12 inline-block cursor-pointer rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        onClick={() => setIsOpen(true)}
      >
        Create More Courses / Subjects
      </div>

      <CourseModal
        setIsOpen={setIsOpen}
        isOpen={isOpen}
        handleSubmit={handleSubmit}
        setFormData={setFormData}
        formData={formData}
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

      <div className="grid w-full grid-cols-3 gap-4">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <CourseCard
              key={subject._id}
              subject={subject}
              handleDelete={handleDelete}
              setIsEditOpen={setIsEditOpen}
              setCurrentSubject={setCurrentSubject}
            />
          ))
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default Index;
