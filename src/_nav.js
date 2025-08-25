import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <i className="fa fa-dashboard m-2"></i>,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: 'User Management',
  },
  {
    component: CNavItem,
    name: 'Users',
    to: '/users',
    icon: <i className="fa fa-users m-2"></i>,
  },
  {
    component: CNavItem,
    name: 'Teachers',
    to: '/teachers',
    icon: <i className="fa fa-users m-2"></i>,
  },
  {
    component: CNavItem,
    name: 'Plan',
    to: '/subscription',
    icon: <i className="fa fa-rupee m-2"></i>,
  },
  {
    component: CNavTitle,
    name: 'Transactions',
  },
  {
    component: CNavItem,
    name: 'Subscribers',
    to: '/subscribers',
    icon: <i className="fa fa-user m-2"></i>,
  },
  
  {
    component: CNavItem,
    name: 'Transactions',
    to: '/transactions',
    icon: <i className="fa fa-rupee m-2"></i>,
  },
  {
    component: CNavTitle,
    name: 'Content Management',
  },
  {
    component: CNavItem,
    name: 'Classes',
    to: '/class-list',
    icon: <i className="fa-solid fa-landmark m-2"></i>,
  },
  {
    component: CNavItem,
    name: 'Calculator',
    to: '/calculator',
    icon: <i className="fa fa-calculator m-2"></i>,
  },
  {
    component: CNavItem,
    name: 'Cheat Sheet',
    to: '/cheat-sheet',
    icon: <i className="fa fa-upload m-2"></i>,
  },
  {
    component: CNavItem,
    name: 'Saved Notes',
    to: '/saved-notes',
    icon: <i className="fa fa-file m-2"></i>,
  },
   {
    component: CNavItem,
    name: 'Questions',
    to: '/question-list',
    icon: <i className="fa fa-question m-2"></i>,
  },
  {
    component: CNavItem,
    name: 'Quizzes',
    to: '/quiz-list',
    icon: <i className="fa fa-store m-2"></i>,
  },

  {
    component: CNavTitle,
    name: 'Promotions',
  },
  {
    component: CNavItem,
    name: 'Banner',
    to: '/banner-list',
    icon: <i className="fa fa-image m-2"></i>,
  },

  {
    component: CNavTitle,
    name: 'Feedback Management',
  },

  {
    component: CNavItem,
    name: 'FeedBacks',
    to: '/feedback-list',
    icon: <i className="fa fa-list m-2"></i>,
  },
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Notification List',
    to: '/notification-list',
    icon: <i className="fa fa-bell m-2"></i>,
  },
  // {
  //   component: CNavItem,
  //   name: 'Push Notification',
  //   to: '/push-notification',
  //   icon: <i className="fa fa-bell m-2"></i>,
  // },
  {
    component: CNavItem,
    name: 'Setting',
    to: '/settings',
    icon: <i className="fa fa-gear m-2"></i>,
  },
  {
    component: CNavItem,
    name: 'Static Pages',
    to: '/pages',
    icon: <i className="fa fa-file-lines m-2"></i>,
  },
  {
    component: CNavItem,
    name: 'FAQs',
    to: '/faq',
    icon: <i className="fa fa-circle-question m-2"></i>,
  }
]

export default _nav
