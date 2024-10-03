import React, { useEffect, useState } from "react";
import Card from "components/cards/Card";
import { getAllCourses } from "../../../services/common";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchedData = async () => {
      try {
        const response = await getAllCourses();
        setCourses(response);
      } catch (error) {
        console.log(error);
      }
    };
    fetchedData();
  }, []);

  return (
    <div>
      {/* Base */}

      <div
        className="hover:bg-transparent mt-12 inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
        onClick={() => navigate("/admin/courses/create")}
      >
        Create Course
      </div>

      <div className="grid w-full grid-cols-3 gap-4">
        {courses.length > 0 ? (
          courses.map((course) => <Card key={course._id} course={course} />)
        ) : (
          <p>No courses available</p>
        )}
      </div>
    </div>
  );
};

export default Index;
