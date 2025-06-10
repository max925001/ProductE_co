import { useNavigate } from 'react-router-dom';
import SideBarHeader from '../components/SideBarHeader';
import { FaHome } from 'react-icons/fa';

const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <SideBarHeader>
      <div className="w-full max-w-7xl mx-auto px-2 xs:px-3 sm:px-4 md:px-6 lg:px-8 py-6 bg-gray-900 min-h-screen flex items-center justify-center">
        <div className="bg-gray-800 rounded-lg shadow-lg p-4 xs:p-5 sm:p-6 text-center">
          <h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-orange-500 mb-4">
            Unauthorized Access
          </h1>
          <p className="text-gray-300 text-sm xs:text-base sm:text-lg mb-6">
            You do not have the required permissions to access this page.
          </p>
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center mx-auto px-3 xs:px-4 sm:px-5 py-2 cursor-pointer bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors text-sm xs:text-base sm:text-lg"
          >
            <FaHome className="mr-2" />
            Back to Home
          </button>
        </div>
      </div>
    </SideBarHeader>
  );
};

export default UnauthorizedPage;