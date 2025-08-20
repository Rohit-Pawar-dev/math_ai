import { Navigate } from 'react-router-dom';

const TeacherPrivateRoute = ({ children }) => {
  // Check if teacher session exists in localStorage
  const teacher = localStorage.getItem('teacher');

  return teacher ? children : <Navigate to="/teacher/login" />;
};

export default TeacherPrivateRoute;
