import React from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'

const TeacherWidgetsDropdown = ({ data, className }) => {
  return (
    <CRow className={className} xs={{ gutter: 4 }}>
      {data.map((item, index) => (
        <CCol key={index} sm={6} xl={3} xxl={3}>
          <CWidgetStatsA
            color={item.color}
            value={<>{item.header ?? 0}</>}
            title={item.text}
          />
        </CCol>
      ))}
    </CRow>
  )
}

TeacherWidgetsDropdown.propTypes = {
  className: PropTypes.string,
  data: PropTypes.arrayOf(
    PropTypes.shape({
      color: PropTypes.string.isRequired,
      header: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
}

export default TeacherWidgetsDropdown
