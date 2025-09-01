import { Navigate } from 'react-router-dom';

const UserPrivateRoute = ({ children }) => {
  // Check if teacher session exists in localStorage
  const user = localStorage.getItem('user');

  return user ? children : <Navigate to="/user/login" />;
};

export default UserPrivateRoute;
