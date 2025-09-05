import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

import userRoutes from '../../userRoutes'

const UserAppContent = () => {
  return (
    <section className="px-4">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {userRoutes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  element={route.element}
                />
              )
            )
          })}
          {/* default redirect */}
          <Route path="/" element={<Navigate to="/home" replace />} />
        </Routes>
      </Suspense>
    </section>
  )
}

export default React.memo(UserAppContent)
