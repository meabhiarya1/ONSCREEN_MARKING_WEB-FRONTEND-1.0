import React, { useEffect, useState } from "react";
import Card from "components/cards/Card";
import { getAllClasses } from "../../../services/common";
import CourseModal from "components/modal/CourseModal";
import axios from "axios";
import { toast } from "react-toastify";

const Index = () => {
  const [courses, setCourses] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await getAllClasses();
        setCourses(response);
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
        `${process.env.REACT_APP_API_URL}/api/classes/remove/class/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(response.data.message);
      setCourses(courses.filter((course) => course._id !== id));
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
        Create Course
      </div>

      <CourseModal setIsOpen={setIsOpen} isOpen={isOpen} />

      <div className="grid w-full grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => (
            <Card
              key={course._id}
              course={course}
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
