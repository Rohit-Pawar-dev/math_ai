import { CNavItem } from '@coreui/react'

const _teacherNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/teacher/dashboard',
    icon: <i className="fa fa-tachometer"></i>, // similar to cil-speedometer
  },
  {
    component: CNavItem,
    name: 'My Courses',
    to: '/teacher/courses',
    icon: <i className="fa fa-book"></i>, // similar to cil-book
  },
  {
    component: CNavItem,
    name: 'Students',
    to: '/teacher/students',
    icon: <i className="fa fa-users"></i>, // similar to cil-people
  },
  {
    component: CNavItem,
    name: 'Reports',
    to: '/teacher/reports',
    icon: <i className="fa fa-bar-chart"></i>, // similar to cil-chart
  },
  {
    component: CNavItem,
    name: 'Profile',
    to: '/teacher/profile',
    icon: <i className="fa fa-user"></i>, // similar to cil-user
  },
  {
    component: CNavItem,
    name: 'Logout',
    to: '/teacher/logout',
    icon: <i className="fa fa-sign-out"></i>, // similar to cil-account-logout
  },
]

export default _teacherNav
