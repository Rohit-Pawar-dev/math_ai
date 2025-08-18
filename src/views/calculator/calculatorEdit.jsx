import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

const calculatorEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(null)


  function submitForm() {
    API.put(`/calculator/${id}`, form)
      .then((res) => {
        if (res.status === 201) {
          navigate('/calculator')
        }
      })
      .catch((err) => {
        console.log('err -------------- ', '')
        Swal.fire(err.code, err.response.data.error, 'error')
      })
  }

  useEffect(() => {
    API.get(`/calculator/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data)
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
          <h5>Quizes</h5>
          <button type="button" className="btn btn-primary btn-sm">Add</button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">Title</label>
                <input type="text" name="title" className="form-control" value={form?.title} onChange={(e) => setForm({...form, title:e.target.value})} />
              </div>
            </div>
           
            <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">Type</label>
                <input type="text" name="type" className="form-control" value={form?.type} onChange={(e) => setForm({...form, type:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">YT Link</label>
                <input type="text" name="link" className="form-control" value={form?.link} placeholder="Enter Youtube Embeded URL (Ex: https://www.youtube.com/embed/YT_VIDEO_CODE)" onChange={(e) => setForm({...form, link:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">Status</label>
                <select name="status" className="form-control" onChange={(e) => setForm({...form, status:e.target.value})} value={form?.status}>
                  <option value="">--</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
             <div className="col-lg-4">
              <div className="form-group">
                <label htmlFor="">Description</label>
                <textarea type="text" name="description" className="form-control" value={form?.description} onBlur={(e) => setForm({...form, description:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-12">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => submitForm()}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default calculatorEdit
