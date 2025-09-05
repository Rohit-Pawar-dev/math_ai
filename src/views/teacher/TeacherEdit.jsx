import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

const TeacherEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(null)
  const [status, setStatus] = useState(null)


  function submitForm() {
    API.put(`/teachers/${id}`, form)
      .then((res) => {
        if (res.status === 200) {
          Swal.fire('success', 'Data Updated successfully', 'success').then(function() {
            navigate('/calculator')
          })
        }
      })
      .catch((err) => {
        console.log('err -------------- ', '')
        Swal.fire(err.code, err.response.data.error, 'error')
      })
  }

  useEffect(() => {
    API.get(`/teachers/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data)
          var stat = res.data.status?.split('')[0].toUpperCase() + res.data.status?.split('').slice(1).join('')
          setStatus(stat)
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
          <h5>Teacher Profile</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Name</label>
                <input type="text" name="name" className="form-control" value={form?.name} readOnly/>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Email</label>
                <input type="text" name="email" className="form-control" value={form?.email} readOnly/>
              </div>
            </div>
            <div className="col-lg-6 mt-4">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Mobile</label>
                <input type="text" name="mobile" className="form-control" value={form?.mobile} readOnly/>
              </div>
            </div>
            <div className="col-lg-6 mt-4">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Status</label>
                <input type="text" name="mobile" className="form-control" value={status??''} readOnly/>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default TeacherEdit
