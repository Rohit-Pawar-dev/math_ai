import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children }) => {
  const { admin } = useAuth();
  const { isAuthenticated } = useSelector((state) => state.auth)
  // return children;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
