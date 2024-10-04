import React, { useEffect, useState } from "react";
import CourseCard from "components/cards/CourseCard";
import { getAllCourses } from "../../../services/common";
import ClassModal from "components/modal/ClassModal";
import { toast } from "react-toastify";
import axios from "axios";

const Index = () => {
  const [subjects, setSubjects] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await getAllCourses();
        setSubjects(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, []);

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
        Add More Subjects
      </div>

      <ClassModal setIsOpen={setIsOpen} isOpen={isOpen} />

      <div className="grid w-full grid-cols-3 gap-4">
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <CourseCard
              key={subject._id}
              subject={subject}
              handleDelete={handleDelete}
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
