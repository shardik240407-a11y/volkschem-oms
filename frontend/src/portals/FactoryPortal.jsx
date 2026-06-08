import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import Sidebar from '../components/common/Sidebar';
import { ClipboardList, Truck, Tag, BarChart3 } from 'lucide-react';

const factoryMenu = [
  { icon: ClipboardList, label: 'Production Orders', path: '/factory/orders' },
  { icon: Truck,         label: 'Dispatch',          path: '/factory/dispatch' },
];

export default function FactoryPortal() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-surface-alt">
      <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="flex">
        <Sidebar
          menuItems={factoryMenu}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-4 md:p-6 transition-all duration-300 min-h-[calc(100vh-4rem)]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
