import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const TeacherList = () => {
  const navigate = useNavigate()

  const [teacherList, setTeacherList] = useState([])

  function deleteQuiz(id) {
    API.delete(`/teachers/${id}`)
      .then((res) => {
        if (res.status === 200) {
         var list = teacherList.filter((elm, ind) => {
          return elm._id != id
         })
         console.log('---------- list --------------- ', list)
         setTeacherList(list)
        }
      })
      .catch((err) => {
        console.log('err -------------- ', err.message)
        Swal.fire(err.code, err.message, 'error')
      })
  }

  useEffect(() => {
    API.get('/teachers')
      .then((res) => {
        if (res.status === 200) {
          setTeacherList(res.data.data)
        }
      })
      .catch((err) => {
        console.log('err -------------- ', err.message)
        Swal.fire(err.code, err.message, 'error')
      })
  }, [])


  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h4>All TEACHER LIST</h4>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Email</th>
                <th>Mobile</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                teacherList.length > 0 ?
                teacherList.map((elm,ind) => {
                  if(elm.role == 'teacher') {
                    return <tr key={ind+1}>
                      <td>{ ind+1 }</td>
                      <td>{ elm.name }</td>
                      <td>{ elm.email }</td>
                      <td>{ elm.mobile }</td>
                      <td>{ elm.status == 'active' ? <span className="badge bg-success">Active</span> : <span className="badge bg-danger">Inactive</span> }</td>
                      <td>
                        <button type="button" className="btn btn-primary btn-sm m-2 editbtn" onClick={() => navigate('/teachers/view/' + elm._id)}><i className="fa fa-pencil"></i></button>
                        <button type="button" className="btn btn-primary btn-sm m-2 deletebtn" onClick={() => deleteQuiz(elm._id)}><i className="fa fa-trash"></i></button>
                      </td>
                    </tr>
                  }
                })
                : (
                  <tr>
                    <th className="text-center" colSpan="6">No Record Found</th>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default TeacherList
