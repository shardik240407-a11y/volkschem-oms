import { NavLink } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

export default function Sidebar({ menuItems, isOpen, onToggle }) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`
          fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] bg-primary
          transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden
          ${isOpen ? 'w-60' : 'w-0 lg:w-16'}
          lg:static lg:z-auto
        `}
      >
        <nav className="flex flex-col gap-1 py-4 px-2 min-w-[3.5rem]">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-accent text-white shadow-sm'
                  : 'text-primary-100 hover:bg-white/10 hover:text-white'
                }
                ${!isOpen ? 'lg:justify-center lg:px-2' : ''}
              `}
              title={item.label}
            >
              <item.icon size={20} className="flex-shrink-0" />
              <span className={`whitespace-nowrap transition-opacity duration-200 ${!isOpen ? 'lg:hidden' : ''}`}>
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* Collapse toggle (desktop only) */}
        <div className="hidden lg:flex absolute bottom-4 left-0 right-0 justify-center">
          <button
            onClick={onToggle}
            className="text-primary-100 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-colors"
            title={isOpen ? 'Collapse' : 'Expand'}
          >
            <ChevronLeft
              size={18}
              className={`transition-transform duration-300 ${!isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
