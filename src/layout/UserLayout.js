import React from 'react'
import { UserAppContent, UserAppHeader, UserAppFooter } from '../components/User/UserIndex'

const UserLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Header */}
      <UserAppHeader />

      {/* Main Content */}
      <main className="flex-grow-1 px-0">
        <UserAppContent />
      </main>

      {/* Footer */}
      <UserAppFooter />
    </div>
  )
}

export default UserLayout
