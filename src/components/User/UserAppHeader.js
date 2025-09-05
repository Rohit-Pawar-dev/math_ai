import React, { useRef, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import defaultWebsiteLogo from '../../assets/images/sorry_teacher.png'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CNavItem,
  CNavLink,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
  CDropdownHeader,
  CDropdownDivider,
} from '@coreui/react'
import { useDispatch, useSelector } from 'react-redux'
import { userLogout } from '../../features/auth/authSlice'
import API from '../../api'
import MEDIA_URL from '../../media'

const UserAppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [logo, setLogo] = useState(null)
  const { user } = useSelector((state) => state.auth)

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        headerRef.current.classList.toggle(
          'shadow-sm',
          document.documentElement.scrollTop > 0
        )
      }
    }

    document.addEventListener('scroll', handleScroll)
    return () => document.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    API.get('/settings')
      .then((res) => {
        if (res.status === 200 && res.data[0]?.app_logo) {
          setLogo(res.data[0].app_logo)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch logo:', err)
      })
  }, [])

  const getLogoUrl = (path) => `${MEDIA_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`

  const handleLogout = () => {
    dispatch(userLogout())
    navigate('/login')
  }

  return (
    <CHeader
      position="sticky"
      className="user-app-header"
      ref={headerRef}
    >
      <CContainer className="d-flex justify-content-between align-items-center px-4" fluid>
        {/* Logo */}
        <div className="navbar-left d-flex align-items-center">
          <NavLink className="navbar-brand" to="/home">
            <img
              src={
                logo
                  ? getLogoUrl(logo)
                  : defaultWebsiteLogo
              }
              alt="Sorry Teacher"
            />
          </NavLink>
        </div>

        {/* Navigation Links */}
        <CHeaderNav className="nav-items d-none d-lg-flex gap-4">
          {[
            { to: '/home', label: 'Home' },
            { to: '/calculator', label: 'calculator' },
            { to: '/graphing', label: 'Graphing' },
            { to: '/tools', label: 'More Tools' },
          ].map((item) => (
            <CNavItem key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  isActive ? 'nav-link active' : 'nav-link'
                }
              >
                {item.label}
              </NavLink>
            </CNavItem>
          ))}
        </CHeaderNav>

        {/* Auth Dropdown or Buttons */}
        <CHeaderNav className="nav-auth ml-auto">
          {user ? (
            <CDropdown variant="nav-item">
              <CDropdownToggle className="py-0 d-flex align-items-center" caret={false}>
                <strong className="me-2">{user.name || 'User'}</strong>
                <CAvatar
                  src={user?.profilePicture ? MEDIA_URL + user.profilePicture : undefined}
                  size="md"
                />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                  {user.name}
                </CDropdownHeader>
                <CDropdownItem as={NavLink} to="/home">Home</CDropdownItem>
                <CDropdownItem as={NavLink} to="/profile">Profile</CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem onClick={handleLogout}>Logout</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          ) : (
            <>
              <CNavItem>
                <NavLink to="/login" className="themeBtn">Sign In</NavLink>
              </CNavItem>
            </>
          )}
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default UserAppHeader
