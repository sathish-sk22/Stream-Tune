import { NavLink } from 'react-router-dom';
import { SIDE_MENU_DATA } from '../../assets/assest';

const Sidebar = ({ activeMenu }) => {
  return (
    <aside className="w-full shrink-0 border-b border-gray-200 bg-white lg:min-h-[calc(100vh-81px)] lg:w-80 lg:border-b-0 lg:border-r">
      <nav className="space-y-3 p-6">
        {SIDE_MENU_DATA.map((item) => {
          const isActive = activeMenu === item.label;
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              className={`flex items-center gap-4 rounded-xl px-7 py-4 text-xl font-medium transition ${
                isActive
                  ? 'bg-[#31d158] text-white shadow-[0_10px_24px_rgba(49,209,88,0.28)]'
                  : 'text-gray-900 hover:bg-gray-100'
              }`}
              to={item.path}
            >
              <Icon className="h-7 w-7 shrink-0" />
              {item.label}
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
