import React from 'react'
import { TeacherAppContent, TeacherAppHeader, TeacherSidebar, TeacherAppFooter } from '../components/Teacher/TeacherIndex'

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
