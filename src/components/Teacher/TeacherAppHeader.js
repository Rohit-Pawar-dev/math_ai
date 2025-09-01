import React, { useRef, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CAvatar,
  CDropdownHeader,
  CDropdownDivider,
} from '@coreui/react'

import { useDispatch, useSelector } from 'react-redux'
import { teacherLogout } from '../../features/auth/authSlice'
import MEDIA_URL from '../../media'

const TeacherAppHeader = () => {
  const headerRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { teacher } = useSelector((state) => state.auth)

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

  const handleLogout = () => {
    dispatch(teacherLogout())
    navigate('/teacher/login')
  }

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderNav className="ms-auto">
          <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0 d-flex align-items-center" caret={false}>
              <strong>{teacher?.name || 'Teacher'}</strong>
              <CAvatar
                src={teacher?.profilePicture ? MEDIA_URL + teacher.profilePicture : undefined}
                size="md"
                className="me-2"
              />
              
            </CDropdownToggle>
            <CDropdownMenu className="pt-0">
              <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">
                {teacher?.name}
              </CDropdownHeader>
              <CDropdownItem as={NavLink} to="/teacher/dashboard">
                Dashboard
              </CDropdownItem>
              <CDropdownItem as={NavLink} to="/teacher/profile">
                Profile
              </CDropdownItem>
              <CDropdownDivider />
              <CDropdownItem onClick={handleLogout}>
                Logout
              </CDropdownItem>
            </CDropdownMenu>
          </CDropdown>
        </CHeaderNav>
      </CContainer>
    </CHeader>
  )
}

export default TeacherAppHeader

