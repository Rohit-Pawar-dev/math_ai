import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'

const notesEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(null)


  function submitForm() {
    API.put(`/saved-notes/${id}`, form)
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
    API.get(`/saved-notes/${id}`)
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
          <h5>Saved Note</h5>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-lg-12">
              <div className="form-group">
                <p>Title: {form?.title}</p>
              </div>
            </div>
            <div className="col-lg-12">
              <div className="form-group">
                <p>Status: {form?.status}</p>
              </div>
            </div>
             <div className="col-lg-12">
              <div className="form-group">
                <p>Description: {form?.description}</p>
              </div>
            </div>
             <div className="col-lg-12">
              <div className="form-group">
                <p>Saved By: {form?.user_id?.name}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default notesEdit
