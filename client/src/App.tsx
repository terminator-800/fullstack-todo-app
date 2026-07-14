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

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* <Route path="/" element={<Navigate to="/my-todo" replace />} /> */}

          {/* Public Routes */}
          <Route element={<PublicRoute><Outlet /></PublicRoute>}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/verify" element={<VerifyEmail />} />
          </Route>

          {/* Protected Routes - Regular Users & Admins */}
          <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route path="/my-todo" element={<MyTodoLayout />} />
            {/* <Route path="/archive" element={<Archive />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/profile" element={<Profile />} /> */}
          </Route>

          {/* Protected Routes - Admin Only */}
          <Route 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["ADMIN", "SUPERADMIN"]}>
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            {/* <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/todo-moderation" element={<TodoModeration />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/audit-monitoring" element={<AuditMonitoring />} />
            <Route path="/admin/profile" element={<AdminProfile />} /> */}
          </Route>

          {/* Protected Routes - SuperAdmin Only */}
          <Route 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["SUPERADMIN"]}>
                  <DashboardLayout />
                </RoleRoute>
              </ProtectedRoute>
            }
          >
            {/* <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/roles" element={<RoleManagement />} />
            <Route path="/superadmin/settings" element={<SystemSettings />} />
            <Route path="/superadmin/security" element={<SecurityCenter />} />
            <Route path="/superadmin/audit-logs" element={<AuditLogs />} />
            <Route path="/superadmin/data" element={<DataManagement />} />
            <Route path="/superadmin/analytics" element={<PlatformAnalytics />} />
            <Route path="/superadmin/emergency" element={<EmergencyActions />} />
            <Route path="/superadmin/profile" element={<SuperAdminProfile />} /> */}
          </Route>

          {/* Unauthorized Page */}
          <Route path="/unauthorized" element={<Unauthorized />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}