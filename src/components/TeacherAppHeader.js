import React, { useRef, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import {
  CContainer,
  CHeader,
  CHeaderNav,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'

const TeacherAppHeader = () => {
  const headerRef = useRef()

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0)
    })
  }, [])

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderNav className="ms-auto">
          <CDropdown variant="nav-item">
            <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
              <strong>Menu</strong>
            </CDropdownToggle>
            <CDropdownMenu className="pt-0">
              <CDropdownItem as={NavLink} to="/teacher/dashboard">
                Dashboard
              </CDropdownItem>
              <CDropdownItem as={NavLink} to="/teacher/profile">
                Profile
              </CDropdownItem>
              <CDropdownItem as={NavLink} to="/teacher/logout">
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
