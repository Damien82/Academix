import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/auth/Login"
import Register from "./pages/auth/Register"

import StudentDashboard from "./pages/dashboard/student/StudentDashboard"
import DelegateDashboard from "./pages/dashboard/delegate/DelegateDashboard"
import AdminDashboard from "./pages/dashboard/admin/AdminDashboard"

import UsersManagement from "./pages/dashboard/admin/UsersManagement"
import CoursesManagement from "./pages/dashboard/admin/CoursesManagement"
import ReportsManagement from "./pages/dashboard/admin/ReportsManagement"
import Profile from "./pages/dashboard/admin/profile"

import DelegueReportsManagement from "./pages/dashboard/delegate/DelegateReportsManagement"
import DelegatecourseManagement from "./pages/dashboard/delegate/DelegateCoursesManagement"
import DelegateProfile from "./pages/dashboard/delegate/Delegateprofile"

import StudentReportsManagement from "./pages/dashboard/student/StudentReportsManagement"
import StudentProfile from "./pages/dashboard/student/Studentprofile"

import HomePage from "./pages/Main/Homepage"
import CataloguePage from "./pages/Main/CataloguePage"


import PrivateRoute from "./components/common/PrivateRoute"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Main */}
        <Route path="/" element={<HomePage />} />
        <Route path="/catalogue" element={<CataloguePage />} />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Student Dashboard */}
        <Route
          path="/dashboard/student"
          element={
            <PrivateRoute role="student">
              <StudentDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/student/reports"
          element={
            <PrivateRoute role="student">
              <StudentReportsManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/student/profile"
          element={
            <PrivateRoute role="student">
              <StudentProfile />
            </PrivateRoute>
          }
        />

        {/* Delegate Dashboard */}
        <Route
          path="/dashboard/delegate"
          element={
            <PrivateRoute role="delegate">
              <DelegateDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/delegate"
          element={
            <PrivateRoute role="delegate">
              <DelegateDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/delegate/reports"
          element={
            <PrivateRoute role="delegate">
              <DelegueReportsManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/delegate/courses"
          element={
            <PrivateRoute role="delegate">
              <DelegatecourseManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/delegate/profile"
          element={
            <PrivateRoute role="delegate">
              <DelegateProfile />
            </PrivateRoute>
          }
        />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <PrivateRoute role="admin">
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/users"
          element={
            <PrivateRoute role="admin">
              <UsersManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/courses"
          element={
            <PrivateRoute role="admin">
              <CoursesManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/reports"
          element={
            <PrivateRoute role="admin">
              <ReportsManagement />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/admin/profile"
          element={
            <PrivateRoute role="admin">
              <Profile />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  )
}
