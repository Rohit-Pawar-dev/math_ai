import { element } from 'prop-types';
import React from 'react'

const UserLogin = React.lazy(() => import('./views/user-views/auth/UserLogin'));
const UserRegister = React.lazy(() => import('./views/user-views/auth/UserRegister'));
const UserProfile = React.lazy(()=>import('./views/user-views/UserProfile'));
const UserHome = React.lazy(()=>import('./views/user-views/Home'))

const userRoutes = [
  {
    path: '/login',
    element: <UserLogin />,
  },
  {
    path: '/register',
    element: <UserRegister/>,
  },

  {
    path: '/profile',
    element: <UserProfile/>,
  },
  {
    path:'/home',
    element: <UserHome/>
  }
]

export default userRoutes
