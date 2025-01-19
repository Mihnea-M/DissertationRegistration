import React from "react";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import PublicRoute from "../PublicRoute";
import ProtectedRoute from "../ProtectedRoute";

import HomePage from "../../pages/HomePage";
import LoginPage from "../../pages/LoginPage";
import RegisterPage from "../../pages/RegisterPage";
import NotFoundPage from "../../pages/NotFoundPage";
import ProfessorDashboardPage from "../../pages/ProfessorDashboardPage";
import StudentDashboardPage from "../../pages/StudentDashboardPage";
import Header from "../Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Toaster position="bottom-right" />
      <Routes>
        <Route index element={<HomePage />} />
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route element={<ProtectedRoute allowedRole={"professor"} />}>
          <Route
            path="/professor-dashboard"
            element={<ProfessorDashboardPage />}
          />
        </Route>
        <Route element={<ProtectedRoute allowedRole={"student"} />}>
          <Route
            path="/student-dashboard"
            element={<StudentDashboardPage />}
          />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
