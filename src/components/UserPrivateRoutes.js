// import { Navigate } from 'react-router-dom';

// const UserPrivateRoute = ({ children }) => {

//   const user = localStorage.getItem('user');

//   return user ? children : <Navigate to="/login" />;
// };

// export default UserPrivateRoute;
const UserPrivateRoute = ({ children }) => {
  // Optional: use this to conditionally show content, but don't block access
  const user = localStorage.getItem('user');

  // Allow access whether user exists or not
  return children;
};

export default UserPrivateRoute;
