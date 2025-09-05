import React from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from './../../assets/images/avatars/8.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { adminLogout } from '../../features/auth/authSlice'
import { useNavigate } from 'react-router-dom'
import profileImg from '../../assets/images/shortcut.png'
import MEDIA_URL from '../../media'

const AppHeaderDropdown = () => {
  const { admin } = useSelector(state => state.auth)
  const navigate = useNavigate();
  var dispatch = useDispatch()
  // const handleLogout = () => {
  //   dispatch(adminLogout())
  //   navigate("/admin/login");
  // }
  const handleLogout = () => {
    dispatch(adminLogout()); // perform logout
    navigate("/admin/login"); // then redirect
  };

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <CAvatar src={MEDIA_URL + admin.profilePicture} size="md" className='profileImgClass' />
        {/* <img src={profileImg} /> */}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">{admin.name}</CDropdownHeader>

        <CDropdownItem onClick={(e) => { e.preventDefault(); navigate('/admin/profile') }} href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem onClick={(e) => { e.preventDefault(); navigate('/admin/Settings') }} href="#">
          <CIcon icon={cilUser} className="me-2" />
          Settings
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem> */}

        <CDropdownDivider />
        <CDropdownItem component="button" onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Logout
        </CDropdownItem>

      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
