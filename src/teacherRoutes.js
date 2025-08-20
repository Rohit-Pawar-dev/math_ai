import React from 'react'

const TeacherDashboard = React.lazy(() => import('./views/dashboard/TeacherDashboard'))
const TeacherProfile = React.lazy(() => import('./views/teacher/TeacherProfile'))

// Student Management Components
const AddUser = React.lazy(() => import('./views/teacher/user-management/AddUser'))
const ViewUser = React.lazy(() => import('./views/teacher/user-management/ViewUser'))
const UserList = React.lazy(() => import('./views/teacher/user-management/UserList'))
const UserEdit = React.lazy(() => import('./views/teacher/user-management/EditUser'))

const teacherRoutes = [
  { path: '/teacher/dashboard', name: 'Teacher Dashboard', element: TeacherDashboard },
  { path: '/teacher/profile', name: 'Teacher Profile', element: TeacherProfile },

  // User Management Routes
  {
    path: '/teacher/user-add',
    name: 'AddUser',
    element: AddUser,
  },
  {
    path: '/teacher/view-user/:id',
    name: 'ViewUser',
    element: ViewUser,
  },

  {
    path: '/teacher/users/:id',
    name: 'ProfileManagement',
    element: UserEdit,
  },
  {
    path: '/user-list',
    name: 'UserList',
    element: UserList,
  },
]

export default teacherRoutes
