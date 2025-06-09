import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/slices/authSlice';
import { FaHome, FaTachometerAlt, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';

const SideBarHeader = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-black">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out md:w-20 md:translate-x-0 md:flex md:flex-col md:items-center md:py-4 md:space-y-6 md:bg-gray-800 md:border-r md:border-gray-700`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-700 md:hidden">
          <h2 className="text-xl font-bold text-orange-500">CRM Dashboard</h2>
          <button className="text-white" onClick={toggleSidebar}>
            <FaTimes size={24} />
          </button>
        </div>
        <nav className="flex flex-col p-4 space-y-4 md:p-0 md:space-y-6">
          <a
            href="/"
            className="flex items-center space-x-2 p-2 hover:bg-orange-500 hover:bg-opacity-20 rounded-md md:space-x-0 md:justify-center md:hover:bg-opacity-30"
            onClick={() => setIsSidebarOpen(false)}
            title="Home"
          >
            <FaHome size={20} />
            <span className="md:hidden">Home</span>
          </a>
          {role === 'admin' && (
            <a
              href="/dashboard"
              className="flex items-center space-x-2 p-2 hover:bg-orange-500 hover:bg-opacity-20 rounded-md md:space-x-0 md:justify-center md:hover:bg-opacity-30"
              onClick={() => setIsSidebarOpen(false)}
              title="Dashboard"
            >
              <FaTachometerAlt size={20} />
              <span className="md:hidden">Dashboard</span>
            </a>
          )}
          <a
            href="/profile"
            className="flex items-center space-x-2 p-2 hover:bg-orange-500 hover:bg-opacity-20 rounded-md md:space-x-0 md:justify-center md:hover:bg-opacity-30"
            onClick={() => setIsSidebarOpen(false)}
            title="Profile"
          >
            <FaUser size={20} />
            <span className="md:hidden">Profile</span>
          </a>
          <button
            onClick={handleLogout}
            className="flex items-center cursor-pointer space-x-2 p-2 hover:bg-orange-500 hover:bg-opacity-20 rounded-md text-left md:space-x-0 md:justify-center md:hover:bg-opacity-30"
            title="Logout"
          >
            <FaSignOutAlt size={20} />
            <span className="md:hidden">Logout</span>
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col md:ml-20">
        {/* Header */}
        <header className="bg-gray-900 p-4 flex items-center justify-between border-b border-gray-700">
          <button className="text-white md:hidden" onClick={toggleSidebar}>
            <FaBars size={24} />
          </button>
          <h1 className="text-xl font-semibold text-orange-500">CRM Application</h1>
          <div className="w-6 md:hidden"></div> {/* Spacer for alignment */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default SideBarHeader;