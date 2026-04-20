import { useState } from "react";
import { LogOut, Menu, UserRound, X } from "lucide-react";
import { useAuth } from "../AuthContext";
import spotifyLogo from "../../assets/spotify-logo.png";

const Navbar = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  const { user, logout } = useAuth();

  return (
    <div className="sticky top-0 z-30 flex items-center justify-between gap-5 border-b border-gray-200 bg-white px-4 py-5 sm:px-8">
      <div className="flex items-center gap-5">
        <button
          type="button"
          className="block rounded p-1 text-black transition-colors hover:bg-gray-100 lg:hidden"
          onClick={() => setOpenSideMenu((prev) => !prev)}
        >
          {openSideMenu ? (
            <X className="text-2xl" />
          ) : (
            <Menu className="text-2xl" />
          )}
        </button>

        <div className="flex items-center gap-3">
          <img alt="Stream Tune logo" className="h-12 w-12 object-contain" src={spotifyLogo} />
          <span className="truncate text-2xl font-bold text-black">Stream Tune</span>
        </div>
      </div>

      {user ? (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3 rounded-xl bg-gray-100 px-4 py-3 text-sm text-gray-900">
            <UserRound className="h-5 w-5 text-gray-700" />
            <span className="font-medium">{user.email}</span>
            <span className="rounded-md bg-green-100 px-3 py-1 text-xs font-semibold uppercase text-green-700">
              {user.role}
            </span>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex items-center gap-2 rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-600 transition-colors hover:bg-red-100"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      ) : (
        <p className="text-sm text-gray-500">No user logged in</p>
      )}
    </div>
  );
};

export default Navbar;
