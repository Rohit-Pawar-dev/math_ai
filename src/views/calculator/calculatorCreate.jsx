import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
// import Select from 'react-select'
// import { color } from 'chart.js/helpers'
// import customSelectStyles from '../../assets/reactSelectStyles'

const calculatorCreate = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState(null)

  function submitForm() {
    API.post('/calculator', form)
      .then((res) => {
        if (res.status === 201) {
          // setSeriesList(res.data)

          navigate('/calculator')

        }
      })
      .catch((err) => {
        console.log('err -------------- ', '')
        Swal.fire(err.code, err.response.data.error, 'error')
      })
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h4>Quizes</h4>
          <button type="button" className="btn btn-primary btn-sm">Add</button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor=""className='mb-2'>Title</label>
                <input type="text" name="title" className="form-control" onBlur={(e) => setForm({...form, title:e.target.value})} />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Type</label>
                <input type="text" name="type" className="form-control" onBlur={(e) => setForm({...form, type:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-6 mt-4">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>YT Link</label>
                <input type="text" name="link" className="form-control" placeholder="Enter Youtube Embeded URL (Ex: https://www.youtube.com/embed/YT_VIDEO_CODE)" onBlur={(e) => setForm({...form, link:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-6 mt-4">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Status</label>
                <select name="status" className="form-control" onChange={(e) => setForm({...form, status:e.target.value})} >
                  <option value="">--</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
             <div className="col-lg-6 mt-4">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Description</label>
                <textarea type="text" name="description" className="form-control" onBlur={(e) => setForm({...form, description:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-12 mt-4">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => submitForm()}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default calculatorCreate
