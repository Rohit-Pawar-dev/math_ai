import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {
  const { admin } = useAuth()
  const { isAdminAuthenticated } = useSelector((state) => state.auth)

  return isAdminAuthenticated ? children : <Navigate to="/login" />
}

export default PrivateRoute
