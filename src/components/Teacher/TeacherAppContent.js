import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner } from '@coreui/react'

// teacher routes config
import teacherRoutes from '../../teacherRoutes'

const TeacherAppContent = () => {
  return (
    <section className="px-4">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {teacherRoutes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path.replace('/teacher', '')} // important!
                  element={<route.element />}
                />
              )
            )
          })}
          {/* default redirect */}
          <Route path="/" element={<Navigate to="dashboard" replace />} />
        </Routes>
      </Suspense>
    </section>
  )
}

export default React.memo(TeacherAppContent)
