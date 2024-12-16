import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import EvaluatorLayout from "layouts/evaluator";
import AuthLayout from "layouts/auth";
import { useDispatch } from "react-redux";
import { rehydrateToken } from "./store/authSlice";
import CheckModule from "views/evaluator/CheckModule/CheckModule";
import "./App.css";
import { jwtDecode } from "jwt-decode"; // Correct default import for jwt-decode
import { useNavigate } from "react-router-dom";

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  // Centralized navigation logic
  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    } else {
      switch (role) {
        case "admin":
          navigate("/admin/default");
          break;
        case "evaluator":
        case "moderator":
          navigate("/evaluator/default");
          break;
        default:
          navigate("/auth/sign-in");
      }
    }
  }, [token, role]);

  useEffect(() => {
    dispatch(rehydrateToken());
  }, [dispatch]);

  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="evaluator/osmmodule" element={<CheckModule />} />
      <Route path="evaluator/*" element={<EvaluatorLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
