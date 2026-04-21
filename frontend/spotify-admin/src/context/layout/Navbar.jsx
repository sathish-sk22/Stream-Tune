import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Menu, User, X } from 'lucide-react';
import { useAuth } from '../AuthContext';

const Navbar = ({ activeMenu }) => {
  const [openSideMenu] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const displayName = user?.name || user?.email || 'Admin user';

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-5 border border-b border-gray-200 bg-white px-4 py-4 backdrop-blue-[2px] sm:px-7">
      <div className="flex items-center gap-5">
        <button className="block rounded p-1 text-black transition-colors hover:bg-gray-100 lg:hidden" type="button">
          {openSideMenu ? <X className="text-2xl" /> : <Menu className="text-2xl" />}
        </button>

        <div className="flex items-center gap-2">
          <span className="truncate text-2xl font-bold text-black">Stream Tune</span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3 rounded-lg bg-gray-100 px-3 py-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div className="hidden sm:block">
            <p className="max-w-48 truncate text-sm font-semibold text-gray-900">{displayName}</p>
            <p className="max-w-48 truncate text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>

        <button
          className="inline-flex items-center gap-2 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
          onClick={handleLogout}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </div>
  );
};

export {Navbar as default};
