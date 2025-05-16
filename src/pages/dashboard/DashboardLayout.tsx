import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { Toaster } from 'sonner';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import DashboardSidebar from '../../components/dashboard/DashboardSidebar';

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  return (
    <div className="h-screen flex flex-col bg-primary-500 overflow-hidden">
      <Toaster richColors position="top-center" />
      <DashboardHeader sideBarToggle={toggleSidebar} />

      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          sideBarToggle={toggleSidebar}
        />
        <main className="flex-1 overflow-y-auto bg-gray-100 p-3">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
