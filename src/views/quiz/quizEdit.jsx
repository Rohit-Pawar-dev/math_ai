import { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const quizEdit = () => {
  const navigate = useNavigate()

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
                <input type="text" name="title" className="form-control"/>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="form-group">
                <label htmlFor="">Description</label>
                <input type="text" name="description" className="form-control"/>
              </div>
            </div>
            <div className="col-lg-3">
              <div className="form-group">
                <label htmlFor="">Status</label>
                <select name="status" className="form-control">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default quizEdit
