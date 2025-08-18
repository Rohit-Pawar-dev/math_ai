import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
// import Select from 'react-select'
// import { color } from 'chart.js/helpers'
// import customSelectStyles from '../../assets/reactSelectStyles'

const quizCreate = () => {
  const navigate = useNavigate()

  const [form, setForm] = useState(null)
  const [seriesList, setSeriesList] = useState([])

  useEffect(() => {

    API.get('/quizes')
      .then((res) => {
        if (res.status === 200) {
          setSeriesList(res.data)
        }
      })
      .catch((err) => {
        console.log('err -------------- ', err.message)
        Swal.fire(err.code, err.message, 'error')
      })
  }, [])

  function submitForm() {
    API.post('/quizes', form)
      .then((res) => {
        if (res.status === 201) {
          // setSeriesList(res.data)

          navigate('/quizes')

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
          <h5>Quizes</h5>
          <button type="button" className="btn btn-primary btn-sm">Add</button>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-3">
              <div className="form-group">
                <label htmlFor="">Title</label>
                <input type="text" name="title" className="form-control" onBlur={(e) => setForm({...form, title:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="form-group">
                <label htmlFor="">Description</label>
                <input type="text" name="description" className="form-control" onBlur={(e) => setForm({...form, description:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-3">
              <div className="form-group">
                <label htmlFor="">Status</label>
                <select name="status" className="form-control" onChange={(e) => setForm({...form, status:e.target.value})} >
                  <option value="">--</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="col-lg-3">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => submitForm()}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default quizCreate
