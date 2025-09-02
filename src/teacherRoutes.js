import React from 'react'

const TeacherDashboard = React.lazy(() => import('./views/dashboard/TeacherDashboard'))
const TeacherProfile = React.lazy(() => import('./views/teacher/TeacherProfile'))

// Student Management Components
const AddUser = React.lazy(() => import('./views/teacher/user-management/AddUser'))
const ViewUser = React.lazy(() => import('./views/teacher/user-management/ViewUser'))
const UserList = React.lazy(() => import('./views/teacher/user-management/UserList'))
const UserEdit = React.lazy(() => import('./views/teacher/user-management/EditUser'))

// Quiz
const QuizList = React.lazy(() => import('./views/teacher/quiz/QuizList'))
const QuizView = React.lazy(() => import('./views/teacher/quiz/QuizView'))
const QuizAdd = React.lazy(() => import('./views/teacher/quiz/QuizAdd'))
const QuizEdit = React.lazy(() => import('./views/teacher/quiz/QuizEdit'))

const teacherRoutes = [
  { path: '/teacher/dashboard', name: 'Teacher Dashboard', element: <TeacherDashboard /> },
  { path: '/teacher/profile', name: 'Teacher Profile', element: <TeacherProfile /> },

  // User Management Routes
  { path: '/teacher/user-add', name: 'AddUser', element: <AddUser /> },
  { path: '/teacher/view-user/:id', name: 'ViewUser', element: <ViewUser /> },
  { path: '/teacher/users/:id', name: 'ProfileManagement', element: <UserEdit /> },
  { path: '/teacher/user-list', name: 'UserList', element: <UserList /> },

  // Quiz Routes
  { path: '/teacher/quiz-list', name: 'QuizList', element: <QuizList /> },
  { path: '/teacher/quiz-view/:id', name: 'QuizView', element: <QuizView /> },
  { path: '/teacher/quiz-add', name: 'QuizAdd', element: <QuizAdd /> },
  { path: '/teacher/quiz-edit/:id', name: 'QuizEdit', element: <QuizEdit /> },
]

export default teacherRoutes
