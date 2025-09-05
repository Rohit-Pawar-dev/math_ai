import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {
  const { admin } = useAuth()
  const { isAdminAuthenticated } = useSelector((state) => state.auth)

  return isAdminAuthenticated ? children : <Navigate to="/admin/login" />
}

export default PrivateRoute
