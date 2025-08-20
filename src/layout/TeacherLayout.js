import React from 'react'
import { TeacherAppContent, TeacherAppHeader, TeacherSidebar, TeacherAppFooter } from '../components/TeacherIndex'

const TeacherLayout = () => {
  return (
    <div>
       <TeacherSidebar />
      <div className="wrapper d-flex flex-column min-vh-100">
        <TeacherAppHeader />
        <div className="body flex-grow-1">
           <TeacherAppContent />
        </div>
        <TeacherAppFooter />
      </div>
    </div>
  )
}

export default TeacherLayout


// export default TeacherLayout;

// import React from 'react'
// import TeacherAppContent from '../components/TeacherAppContent'

// const TeacherLayout = () => {
//   return (
//     <div className="wrapper d-flex flex-column min-vh-100 bg-light">
//       {/* Later you can add TeacherHeader/Sidebar */}
//       <TeacherAppContent />
//     </div>
//   )
// }

// export default TeacherLayout