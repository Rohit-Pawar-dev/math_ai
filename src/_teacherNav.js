import { CNavItem } from '@coreui/react'

const _teacherNav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/teacher/dashboard',
    icon: <i className="fa fa-tachometer"></i>, 
  },
  {
    component: CNavItem,
    name: 'My Quizzes',
    to: '/teacher/quizzes',
    icon: <i className="fa fa-book"></i>, 
  },
  {
    component: CNavItem,
    name: 'Students',
    to: '/teacher/user-list',
    icon: <i className="fa fa-users"></i>, 
  },
]

export default _teacherNav
