import { useAuth } from '../../context/AuthContext';
import { Menu, Bell, LogOut, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { orderService } from '../../services/dataService';
import dayjs from 'dayjs';

const roleBadgeColors = {
  admin: 'bg-primary text-white',
  employee: 'bg-info text-white',
  factory_admin: 'bg-action text-white',
};

const roleLabels = {
  admin: 'Admin',
  employee: 'Employee',
  factory_admin: 'Factory',
};

export default function Navbar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  const dropdownRef = useRef(null);
  const notifRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Notification Polling (Factory Admin only)
  useEffect(() => {
    if (user?.role !== 'factory_admin') return;

    const fetchNotifications = () => {
      orderService.getAll({ status: 'confirmed' })
        .then(({ data }) => {
          const orders = data.data || [];
          const readOrders = JSON.parse(localStorage.getItem('vcs_read_notifs') || '[]');
          
          const newNotifs = orders
            .filter(o => !readOrders.includes(o.id))
            .map(o => ({
              id: o.id,
              order_id: o.id.substring(o.id.length - 8),
              product_name: o.quotation?.product_name || o.quotation?.products?.product_name,
              created_at: o.created_at
            }));
            
          setNotifications(newNotifs);
        })
        .catch(console.error);
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // 60s
    return () => clearInterval(interval);
  }, [user]);

  const markAsReadAndNavigate = (orderId) => {
    const readOrders = JSON.parse(localStorage.getItem('vcs_read_notifs') || '[]');
    if (!readOrders.includes(orderId)) {
      readOrders.push(orderId);
      localStorage.setItem('vcs_read_notifs', JSON.stringify(readOrders));
    }
    setNotifications(prev => prev.filter(n => n.id !== orderId));
    setNotifOpen(false);
    navigate('/factory/orders');
  };

  const initials = user?.full_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'U';

  return (
    <header className="sticky top-0 z-50 h-16 bg-primary flex items-center justify-between px-4 shadow-navbar">
      {/* Left: Hamburger + Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="text-white hover:bg-white/10 p-2 rounded-md transition-colors lg:hidden"
        >
          <Menu size={22} />
        </button>

        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center bg-white rounded-md p-1 shadow-sm">
            <img src="/logo.png" alt="Volkschem Logo" className="h-8 object-contain" />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-white font-bold text-lg leading-tight tracking-wide">VOLKSCHEM</h1>
            <p className="text-primary-100 text-xs leading-tight">CROP SCIENCE (P) LIMITED</p>
          </div>
        </div>
      </div>

      {/* Center: App Name */}
      <div className="hidden md:block">
        <span className="text-white/80 font-medium text-sm">Volkschem OMS</span>
      </div>

      {/* Right: Notifications + User */}
      <div className="flex items-center gap-4">
        
        {/* Notifications (Factory only for now, can be expanded) */}
        {user?.role === 'factory_admin' && (
          <div ref={notifRef} className="relative">
            <button 
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative text-white hover:bg-white/10 p-2 rounded-md transition-colors"
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-error text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-modal border border-border py-2 animate-fade-in z-50">
                <div className="px-4 py-2 border-b border-border flex justify-between items-center">
                  <h3 className="text-sm font-bold text-text-primary">Notifications</h3>
                  <span className="text-xs text-text-muted">{notifications.length} new</span>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-sm text-text-muted">No new notifications</div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id}
                        onClick={() => markAsReadAndNavigate(notif.id)}
                        className="px-4 py-3 border-b border-border hover:bg-surface-alt cursor-pointer transition-colors"
                      >
                        <div className="flex gap-3">
                          <div className="mt-0.5 text-action flex-shrink-0">
                            <CheckCircle2 size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-text-primary">New Order Confirmed</p>
                            <p className="text-xs text-text-secondary mt-0.5">Order <span className="font-medium text-primary">#{notif.order_id}</span> ({notif.product_name})</p>
                            <p className="text-[10px] text-text-muted mt-1">{dayjs(notif.created_at).format('DD/MM/YYYY HH:mm')}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* User Dropdown */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 hover:bg-white/10 px-2 py-1.5 rounded-lg transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-primary-lighter text-white font-bold text-sm flex items-center justify-center">
              {initials}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-white text-sm font-medium leading-tight">{user?.full_name}</p>
              <p className="text-primary-100 text-xs leading-tight">{roleLabels[user?.role]}</p>
            </div>
            <ChevronDown size={16} className="text-white/70" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-modal border border-border py-1 animate-fade-in z-50">
              <div className="px-3 py-2 border-b border-border">
                <p className="text-sm font-semibold text-text-primary">{user?.full_name}</p>
                <span className={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${roleBadgeColors[user?.role]}`}>
                  {roleLabels[user?.role]}
                </span>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error-light transition-colors"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
