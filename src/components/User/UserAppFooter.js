import React from 'react'
import { CFooter } from '@coreui/react'

const UserAppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <span className="ms-1">&copy; 2025 User Website.</span>
      </div>
      <div className="ms-auto">
        <span className="me-1">Powered by</span>
        <a href="#" target="_blank" rel="noopener noreferrer">
          Alphawizz Technologies
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(UserAppFooter)
