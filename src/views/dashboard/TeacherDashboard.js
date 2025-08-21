import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import TeacherWidgetsDropdown from '../widgets/TeacherWidgetsDropdown'
import API from '../../api'
import classNames from 'classnames'
import {
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CProgress,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cilCloudDownload,
} from '@coreui/icons'
import MainChart from './MainChart'

const TeacherDashboard = () => {
  const { teacher } = useSelector((state) => state.auth) // get teacher info from redux
  const [statistic, setStatistic] = useState({})
  const [loader, setLoader] = useState(true)

  useEffect(() => {
    if (!teacher?._id) {
      setLoader(false)
      return
    }

    API.get(`teacher/dashboard/${teacher._id}`)
      .then((res) => {
        setStatistic(res.data.data)
        setLoader(false)
      })
      .catch(() => setLoader(false))
  }, [teacher?._id])

  if (loader) return <div>Loading...</div>

   const progressExample = [
    { title: 'Visits', value: '29.703 Users', percent: 40, color: 'success' },
    { title: 'Unique', value: '24.093 Users', percent: 20, color: 'info' },
    // { title: 'Pageviews', value: '78.706 Views', percent: 60, color: 'warning' },
    { title: 'New Users', value: '22.123 Users', percent: 80, color: 'danger' },
    // { title: 'Bounce Rate', value: 'Average Rate', percent: 40.15, color: 'primary' },
  ]

  const widgetsData = [
    { header: statistic.total_users || 0, text: 'Total Users', color: 'primary' },
    { header: statistic.total_students || 0, text: 'Total Students', color: 'info' },
    { header: statistic.active_users || 0, text: 'Total Active Students', color: 'success' },
    { header: statistic.total_quizzes || 0, text: 'Total Quizzes', color: 'warning' },
  ]

  return (
    <>
      <TeacherWidgetsDropdown data={widgetsData} />
      <CCard className="mb-4">
        <CCardBody>
          <CRow>
            <CCol sm={5}>
              <h4 id="traffic" className="card-title mb-0">
                Traffic
              </h4>
              <div className="small text-body-secondary">January - July 2023</div>
            </CCol>
            <CCol sm={7} className="d-none d-md-block">
              <CButton color="primary" className="float-end">
                <CIcon icon={cilCloudDownload} />
              </CButton>
              <CButtonGroup className="float-end me-3">
                {['Day', 'Month', 'Year'].map((value) => (
                  <CButton
                    color="outline-secondary"
                    key={value}
                    className="mx-0"
                    active={value === 'Month'}
                  >
                    {value}
                  </CButton>
                ))}
              </CButtonGroup>
            </CCol>
          </CRow>
          <MainChart />
        </CCardBody>
        <CCardFooter>
          <CRow
            xs={{ cols: 1, gutter: 4 }}
            sm={{ cols: 2 }}
            lg={{ cols: 4 }}
            xl={{ cols: 5 }}
            className="mb-2 text-center"
          >
            {progressExample.map((item, index, items) => (
              <CCol
                className={classNames({
                  'd-none d-xl-block': index + 1 === items.length,
                })}
                key={index}
              >
                <div className="text-body-secondary">{item.title}</div>
                <div className="fw-semibold text-truncate">
                  {item.value} ({item.percent}%)
                </div>
                <CProgress thin className="mt-2" color={item.color} value={item.percent} />
              </CCol>
            ))}
          </CRow>
        </CCardFooter>
      </CCard>
    </>
  )
}

export default TeacherDashboard
