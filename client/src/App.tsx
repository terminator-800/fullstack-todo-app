import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import VerifyEmail from "./components/VerifyEmail";
import MyTodoLayout from "./pages/MyTodoLayout";
import DashboardLayout from "./pages/DashboardLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import RoleRoute from "./components/RoleRoute";
import AuthProvider from "./components/AuthProvider";
import Unauthorized from "./components/Unauthorized";
import Dashboard from "./components/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/my-todo" replace />} />

          {/* Public Routes */}
          <Route element={<PublicRoute><Outlet /></PublicRoute>}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
          </Route>

          {/* Protected Routes - Regular Users only */}
          <Route 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["USER"]}>
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="/my-todo" element={<MyTodoLayout />} />
          </Route>

          {/* Protected Routes - Admin & SuperAdmin */}
          <Route 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            {/* <Route path="/users" element={<Users />} />
            <Route path="/todo-moderation" element={<TodoModeration />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/audit-monitoring" element={<AuditMonitoring />} />
            <Route path="/profile" element={<AdminProfile />} /> */}
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>

      </AuthProvider>
    </BrowserRouter>
  );
}