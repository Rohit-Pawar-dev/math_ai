// import React, { Suspense } from 'react'
// import { Navigate, Route, Routes } from 'react-router-dom'
// import { CContainer, CSpinner } from '@coreui/react'

// // routes config
// import routes from '../routes'

// const AppContent = () => {
//   return (
//     <section className="px-4">
//       <Suspense fallback={<CSpinner color="primary" />}>
//         <Routes>
//           {routes.map((route, idx) => {
//             return (
//               route.element && (
//                 <Route
//                   key={idx}
//                   path={route.path}
//                   exact={route.exact}
//                   name={route.name}
//                   element={<route.element />}
//                 />
//               )
//             )
//           })}
//           <Route path="/" element={<Navigate to="dashboard" replace />} />
//         </Routes>
//       </Suspense>
//     </section>
//   )
// }

// export default React.memo(AppContent)

import React, { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CSpinner } from '@coreui/react';
import routes from '../routes';

const AppContent = () => {
  return (
    <Suspense fallback={<CSpinner color="primary" />}>
      <Routes>
        {routes.map((route, idx) => (
          <Route
            key={idx}
            path={route.path}
            element={route.element ? <route.element /> : null}
          />
        ))}
        {/* Redirect when user visits /admin */}
        <Route path="" element={<Navigate to="dashboard" replace />} />
      </Routes>
    </Suspense>
  );
};

export default React.memo(AppContent);
