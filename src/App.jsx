import React, { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "layouts/admin";
import EvaluatorLayout from "layouts/evaluator";
import AuthLayout from "layouts/auth";
import { useDispatch } from "react-redux";
import { rehydrateToken } from "./store/authSlice";
import { useNavigate } from "react-router-dom";
import CheckModule from "views/evaluator/CheckModule/CheckModule";
import "./App.css";
const App = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();


  useEffect(() => {
    if (!token) {
      navigate("/auth/sign-in");
    }
  }, [token, navigate]);



  useEffect(() => {
    dispatch(rehydrateToken());
  }, [dispatch]);


  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />
      <Route path="admin/*" element={<AdminLayout />} />
      <Route path="/evaluator/osmmodule" element={<CheckModule />} />
      <Route path="evaluator/*" element={<EvaluatorLayout />} />
      <Route path="/" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default App;
