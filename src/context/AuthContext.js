// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import API from '../api';
import { loginSuccess } from '../features/auth/authSlice';
import { updateUserLists } from '../features/auth/userSlice';
import Swal from 'sweetalert2'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    if (savedAdmin) setAdmin(JSON.stringify(savedAdmin));
  }, []);

  const login = async (credentials) => {
    // You’d call API here. This is a dummy check.
    await API.post('/auth/login', credentials) // Replace with actual API route
      .then(async res => {
        if(res.status == 200) {
          localStorage.setItem('admin', JSON.stringify(res.data))
          localStorage.setItem('profile', JSON.stringify(res.data.user))
          localStorage.setItem('token', JSON.stringify(res.data.token))

          Swal.fire('', 'Login Success', 'success')
          dispatch(loginSuccess(res.data))
          await API.get('/users') // Replace with actual API route
            .then(res => {
              if(res.status == 200) {
                dispatch(updateUserLists(res.data))
              }
            })
            .catch(err => console.error(err));

          setAdmin(res.data.token);

        } else {
          Swal.fire('', 'Something went wrong', 'error')
          // alert(err.response?.data?.msg || 'Login failed');
        }
      })
      .catch((err) => {
        console.error(err)
        Swal.fire('', `Invalid Email or Password`, 'error')
      });


    return admin==null?false:true;
  };

  const logout = () => {
    localStorage.removeItem('admin');
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{ admin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
