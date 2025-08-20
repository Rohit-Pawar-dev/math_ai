import React, { useEffect, useState } from 'react'
import { CSpinner } from '@coreui/react'
import { useSelector } from 'react-redux'

import TeacherWidgetsDropdown from '../widgets/TeacherWidgetsDropdown'
import API from '../../api'

const TeacherDashboard = () => {
  // Your state and API calls
  const [statistic, setStatistic] = useState({})
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    API.get('teacher/dashboard')
      .then((res) => {
        setStatistic(res.data.data[0])
        setLoader(false)
      })
      .catch(() => {
        setLoader(false)
      })
  }, [])

  if (loader) {
    return <div>Loading...</div>
  }

  const widgetsData = [
    { header: statistic.total_users || 0, text: 'Total Users', color: 'primary' },
    { header: statistic.active_users || 0, text: 'Active Users', color: 'success' },
    { header: statistic.total_quizzes || 0, text: 'Total Quizzes', color: 'warning' },
    { header: statistic.total_students || 0, text: 'Total Students', color: 'info' },
  ]

  return <TeacherWidgetsDropdown data={widgetsData} />
}

export default TeacherDashboard
