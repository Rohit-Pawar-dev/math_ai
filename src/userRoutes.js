import React from 'react'

const UserLogin = React.lazy(() => import('./views/user-views/auth/UserLogin'));
const UserRegister = React.lazy(() => import('./views/user-views/auth/UserRegister'));

const userRoutes = [
  {
    path: '/login',
    element: <UserLogin />,
  },
  {
    path: '/register',
    element: <UserRegister/>,
  },
]

export default userRoutes
