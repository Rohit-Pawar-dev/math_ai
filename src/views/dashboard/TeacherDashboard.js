// import React, { useEffect, useState } from 'react'
// import { CSpinner } from '@coreui/react'
// import { useSelector } from 'react-redux'

// import TeacherWidgetsDropdown from '../widgets/TeacherWidgetsDropdown'
// import API from '../../api'

// const TeacherDashboard = () => {
//   // Your state and API calls
//   const [statistic, setStatistic] = useState({})
//   const [loader, setLoader] = useState(true)

//   useEffect(() => {
//     API.get('teacher/dashboard')
//       .then((res) => {
//         setStatistic(res.data.data[0])
//         setLoader(false)
//       })
//       .catch(() => {
//         setLoader(false)
//       })
//   }, [])

//   if (loader) {
//     return <div>Loading...</div>
//   }

//   const widgetsData = [
//     { header: statistic.total_users || 0, text: 'Total Users', color: 'primary' },
//     { header: statistic.active_users || 0, text: 'Active Users', color: 'success' },
//     { header: statistic.total_quizzes || 0, text: 'Total Quizzes', color: 'warning' },
//     { header: statistic.total_students || 0, text: 'Total Students', color: 'info' },
//   ]

//   return <TeacherWidgetsDropdown data={widgetsData} />
// }

// export default TeacherDashboard

import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TeacherWidgetsDropdown from '../widgets/TeacherWidgetsDropdown'
import API from '../../api'

const TeacherDashboard = () => {
  const { teacher } = useSelector(state => state.auth)  // get teacher info from redux
  const [statistic, setStatistic] = useState({})
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    if (!teacher?._id) {
      setLoader(false)
      return
    }

    API.get(`teacher/dashboard/${teacher._id}`)
      .then(res => {
        setStatistic(res.data.data)
        setLoader(false)
      })
      .catch(() => setLoader(false))
  }, [teacher?._id])

  if (loader) return <div>Loading...</div>

  const widgetsData = [
    { header: statistic.total_users || 0, text: 'Total Users', color: 'primary' },
    { header: statistic.total_students || 0, text: 'Total Students', color: 'info' },
    { header: statistic.active_users || 0, text: 'Total Active Students', color: 'success' },
    { header: statistic.total_quizzes || 0, text: 'Total Quizzes', color: 'warning' },
  ]

  return <TeacherWidgetsDropdown data={widgetsData} />
}

export default TeacherDashboard
