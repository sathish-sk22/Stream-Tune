import Navbar from './Navbar';
import Sidebar from './Sidebar';

const Dashboard = ({ activeMenu, children }) => {
  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />
      <div className="flex flex-col lg:min-h-[calc(100vh-81px)] lg:flex-row">
        <Sidebar activeMenu={activeMenu} />
        <main className="min-h-[calc(100vh-81px)] flex-1 bg-white p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
