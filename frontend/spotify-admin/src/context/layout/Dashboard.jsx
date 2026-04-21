import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Dashboard = ({ children, activeMenu }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar activeMenu={activeMenu} />
      <div className="flex">
        <div className="hidden lg:block">
          <Sidebar activeMenu={activeMenu} />
        </div>
        <div className="grow px-5 py-5 sm:px-7">{children}</div>
      </div>
    </div>
  );
};

export { Dashboard as default };
