// src/pages/DashboardLayout.tsx
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useAuth } from "../store/auth";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";         
import SuperAdminSidebar from "../components/SuperAdminSidebar"; 
import Navbar from "../components/Navbar";
import NotificationBar, { type Notification } from "../components/NotificationBar";

const sampleNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to Ledger",
    description: "Your account is set up and ready to go.",
    time: "Just now",
    read: false,
  },
];

export default function DashboardLayout() {
  const user = useAuth((state) => state.user);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadCount = sampleNotifications.filter((n) => !n.read).length;

  // Select sidebar based on user role
  // Select sidebar based on user role
  const getSidebarComponent = () => {
    if (user?.role === "SUPERADMIN") return SuperAdminSidebar;
    if (user?.role === "ADMIN") return AdminSidebar;
    return Sidebar;
  };

  const SidebarComponent = getSidebarComponent();

  return (
    <div className="flex h-screen bg-slate-100">
      <SidebarComponent />

      {/* min-w-0 lets the main column shrink properly inside the flex
          container instead of overflowing when content is wide. */}
      <div className="flex min-w-0 flex-1 flex-col">
        <Navbar
          onBellClick={() => setIsNotifOpen(true)}
          notificationCount={unreadCount}
        />

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      <NotificationBar
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={sampleNotifications}
      />
    </div>
  );
}