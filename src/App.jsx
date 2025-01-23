import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import AdminLayout from "layouts/admin";
import EvaluatorLayout from "layouts/evaluator/index.jsx";
import AuthLayout from "layouts/auth/index.jsx";
import { useDispatch } from "react-redux";
import { rehydrateToken } from "./store/authSlice";
import CheckModule from "views/evaluator/CheckModule/CheckModule";
import "./App.css";
import { jwtDecode } from "jwt-decode"; // Correct import for jwt-decode
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "services/common";
import { toast } from "react-toastify";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation(); // To check current path
  const token = localStorage.getItem("token");
  const [user, setUser] = useState(token);

  const getRoleFromToken = () => {
    if (!token) return null;
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.role;
    } catch (error) {
      console.error("Invalid token:", error);
      return null;
    }
  };

  const role = getRoleFromToken();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getUserDetails(token);
        // console.log(response);
        setUser(response?.data);
      } catch (error) {
        console.log(error);
        toast.error(error?.response?.data?.message);
      }
    };

    fetchUser();
  }, [token, setUser]);


  useEffect(() => {
    if (
      !token ||
      user?.message === "Unauthorized" ||
      user?.message === "User not found"
    ) {
      // Redirect to sign-in only if not already on an auth route
      if (!location.pathname.startsWith("/auth")) {
        navigate("/auth/sign-in");
      }
    } else {
      // Redirect based on role only if user is on an unauthorized path
      if (role === "admin" && !location.pathname.startsWith("/admin")) {
        navigate("/admin/default");
      } else if (
        ["evaluator", "moderator"].includes(role) &&
        !location.pathname.startsWith("/evaluator")
      ) {
        navigate("/evaluator/default");
      }
    }
  }, [token, role, location, navigate, user]);

  useEffect(() => {
    dispatch(rehydrateToken());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="evaluator/task/:id" element={<CheckModule />} />
      <Route path="evaluator/*" element={<EvaluatorLayout />} />
      <Route path="/" element={<Navigate to="/admin/default" replace />} />
    </Routes>
  );
};

export default App;
