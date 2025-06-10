import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = ({ requireAdmin = false }) => {
  const data = useSelector((state) => state.auth);
  console.log(data)

  if (!data) {
    
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && data.role !== 'admin') {
    
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;