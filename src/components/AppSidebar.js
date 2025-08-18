import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCloseButton,
  CSidebar,
  CSidebarBrand,
  CSidebarFooter,
  CSidebarHeader,
  CSidebarToggler,
} from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import navigation from '../_nav'
import API from '../api'

import MEDIA_URL from '../media'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [logo, setLogo] = useState(null)

  // Fetch logo from settings
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

  // Helper to fix double slashes
  const getLogoUrl = (path) => {
    return `${MEDIA_URL.replace(/\/$/, '')}/${path.replace(/^\//, '')}`
  }


  return (
   <>

   <CSidebar
      className="border-end"
      colorScheme="dark"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
    >

      <CSidebarHeader className="border-bottom">
        <CSidebarBrand to="/">
         {logo ? (
          <img
              src={getLogoUrl(logo)}
              className="mainLogo"
              alt="Business Logo"
              style={{ maxHeight: '40px' }}
            />
          ) : (
            <span className="text-white fw-bold">My App</span> // fallback if no logo
          )}
        </CSidebarBrand>
        <CCloseButton
          className="d-lg-none"
          dark
          onClick={() => dispatch({ type: 'set', sidebarShow: false })}
        />
      </CSidebarHeader>
      <AppSidebarNav items={navigation} />
      <CSidebarFooter className="border-top d-none d-lg-flex">
        <CSidebarToggler
          onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        />
      </CSidebarFooter>
    </CSidebar>
    </>
  )
}

export default React.memo(AppSidebar)

