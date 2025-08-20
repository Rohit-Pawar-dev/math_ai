import React from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'

const TeacherWidgetsDropdown = ({ data, className }) => {
  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={<>{data.totalUsers ?? 0}</>}
          title="Total Users"
        />
      </CCol>

      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          color="success"
          value={<>{data.activeUsers ?? 0}</>}
          title="Active Users"
        />
      </CCol>

      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={<>{data.totalQuizzes ?? 0}</>}
          title="Total Quizzes"
        />
      </CCol>

      <CCol sm={6} xl={3} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={<>{data.totalStudents ?? 0}</>}
          title="Total Students"
        />
      </CCol>
    </CRow>
  )
}

TeacherWidgetsDropdown.propTypes = {
  className: PropTypes.string,
  data: PropTypes.shape({
    totalUsers: PropTypes.number,
    activeUsers: PropTypes.number,
    totalQuizzes: PropTypes.number,
    totalStudents: PropTypes.number,
  }).isRequired,
}

export default TeacherWidgetsDropdown
