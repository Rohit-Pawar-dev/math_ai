import React from 'react'
import { NavLink } from 'react-router-dom'

const SidebarList = () => {
  return (
    <>
    <div className="sidebarsection">
    <h5>Profile Management</h5>
    <div className="sidebarList">
      <NavLink to='/ProfileManagement'>Profile Management</NavLink>
    </div>
    </div>

    </>
  )
}

export default SidebarList
