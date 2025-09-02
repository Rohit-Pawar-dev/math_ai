import React, { useRef, useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
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
  CSidebarBrand,
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
    return () => {
      document.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    API.get('/settings')
      .then((res) => {
        if (res.status === 200 && res.data[0]?.app_logo) {
          setLogo(res.data[0].app_logo)
        }
      })
      .catch((err) => {
        console.error('Failed to fetch settings logo', err)
      })
  }, [])

  const getLogoUrl = (path) => {
    return `${MEDIA_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  }

  const handleLogout = () => {
    dispatch(userLogout())
    navigate('/login')
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4 d-flex justify-content-between align-items-center" fluid>

        {/* LEFT SIDE - Logo or Site Name */}

        <CSidebarBrand to="/home">
          {logo ? (
            <img
              src={getLogoUrl(logo)}
              className="mainLogo"
              alt="Logo"
              style={{ maxHeight: '20px' }}
            />
          ) : (
            <span className="text-white fw-bold">Sorry Teacher</span>
          )}
        </CSidebarBrand>
        {/* MIDDLE NAVIGATION */}
        <CHeaderNav className="d-flex gap-4">
          <CNavItem>
            <CNavLink as={NavLink} to="/home">Home</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink as={NavLink} to="/about">About</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink as={NavLink} to="/graphing">Graphing</CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink as={NavLink} to="/tools">More Tools</CNavLink>
          </CNavItem>
        </CHeaderNav>

        {/* RIGHT SIDE - Auth / Profile */}
        <CHeaderNav>
          {user ? (
            <CDropdown variant="nav-item">
              <CDropdownToggle placement="bottom-end" className="py-0 d-flex align-items-center" caret={false}>
                <strong className="me-2">{user?.name || 'User'}</strong>
                <CAvatar
                  src={user?.profilePicture ? MEDIA_URL + user.profilePicture : undefined}
                  size="md"
                />
              </CDropdownToggle>
              <CDropdownMenu className="pt-0">
                <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                  {user?.name}
                </CDropdownHeader>
                <CDropdownItem as={NavLink} to="/home">
                  Dashboard
                </CDropdownItem>
                <CDropdownItem as={NavLink} to="/profile">
                  Profile
                </CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem onClick={handleLogout}>Logout</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          ) : (
            <>
              <CNavItem>
                <CNavLink as={NavLink} to="/login">Login</CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink as={NavLink} to="/register">Sign Up</CNavLink>
              </CNavItem>
            </>
          )}
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default UserAppHeader


