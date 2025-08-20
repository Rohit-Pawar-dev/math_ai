import React from 'react'

const TeacherDashboard = React.lazy(() => import('./views/dashboard/TeacherDashboard'))
const TeacherProfile = React.lazy(() => import('./views/teacher/TeacherProfile'))

const teacherRoutes = [
  { path: '/teacher/dashboard', name: 'Teacher Dashboard', element: TeacherDashboard },
  { path: '/teacher/profile', name: 'Teacher Profile', element: TeacherProfile },
]

export default teacherRoutes
