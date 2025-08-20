import CIcon from '@coreui/icons-react'
import { CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <i className="fa fa-dashboard"></i>,
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
    icon: <i className="fa fa-users"></i>,
  },
  {
    component: CNavItem,
    name: 'Plan',
    to: '/subscription',
    icon: <i className="fa fa-rupee"></i>,
  },
  {
    component: CNavTitle,
    name: 'Transactions',
  },
  {
    component: CNavItem,
    name: 'Subscribers',
    to: '/subscribers',
    icon: <i className="fa fa-user"></i>,
  },
  
  {
    component: CNavItem,
    name: 'Transactions',
    to: '/transactions',
    icon: <i className="fa fa-rupee"></i>,
  },
  {
    component: CNavTitle,
    name: 'Content Management',
  },
  {
    component: CNavItem,
    name: 'Classes',
    to: '/class-list',
    icon: <i className="fa-solid fa-landmark"></i>,
  },
  {
    component: CNavItem,
    name: 'Calculator',
    to: '/calculator',
    icon: <i className="fa fa-calculator"></i>,
  },
  {
    component: CNavItem,
    name: 'Cheat Sheet',
    to: '/cheat-sheet',
    icon: <i className="fa fa-upload"></i>,
  },
  {
    component: CNavItem,
    name: 'Saved Notes',
    to: '/saved-notes',
    icon: <i className="fa fa-file"></i>,
  },

  {
    component: CNavTitle,
    name: 'Promotions',
  },
  {
    component: CNavItem,
    name: 'Banner',
    to: '/banner-list',
    icon: <i className="fa fa-image"></i>,
  },

  {
    component: CNavTitle,
    name: 'Feedback Management',
  },

  {
    component: CNavItem,
    name: 'FeedBacks',
    to: '/feedback-list',
    icon: <i className="fa fa-list"></i>,
  },
  // {
  //   component: CNavItem,
  //   name: 'Reels',
  //   to: '/reels-list',
  //   icon: <CIcon icon={cil4k} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Content Upload',
  //   to: '/content-upload',
  //   icon: <CIcon icon={cilMovie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Manage Genres',
  //   to: '/',
  //   icon: <CIcon icon={cilMovie} customClassName="nav-icon" />,
  // },
  // {
  //   component: CNavItem,
  //   name: 'Watchlist',
  //   to: '/wishlist',
  //   icon: <CIcon icon={cilHeart} customClassName="nav-icon" />,
  // },
  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Push Notification',
    to: '/push-notification',
    icon: <i className="fa fa-bell"></i>,
  },
  {
    component: CNavItem,
    name: 'Setting',
    to: '/settings',
    icon: <i className="fa fa-gear"></i>,
  },
  {
    component: CNavItem,
    name: 'Static Pages',
    to: '/pages',
    icon: <i className="fa fa-file-lines"></i>,
  },
  {
    component: CNavItem,
    name: 'FAQs',
    to: '/faq',
    icon: <i className="fa fa-circle-question"></i>,
  }
]

export default _nav
