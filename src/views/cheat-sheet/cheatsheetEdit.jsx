import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate, useParams } from 'react-router-dom'
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const cheatsheetEdit = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const [form, setForm] = useState(null)

  const formatMath = (raw) => {
    if (raw) {
      return String.raw`\begin{aligned}
        ${raw.replace(/\n/g, " \\\\ ")}
        \end{aligned}`;

    }
  };

  function submitForm() {
    API.put(`/cheat-sheet/${id}`, form)
      .then((res) => {
        if (res.status === 200) {

          Swal.fire('success', 'Data Updated successfully', 'success').then(function () {
            navigate('/cheat-sheet')
          })
        }
      })
      .catch((err) => {
        Swal.fire(err.code, err.response.data.error, 'error')
      })
  }

  useEffect(() => {
    API.get(`/cheat-sheet/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setForm(res.data)
        }
      })
      .catch((err) => {
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
            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Title</label>
                <input type="text" name="title" className="form-control" value={form?.title} onChange={(e) => setForm({...form, title:e.target.value})} />
              </div>
            </div>

            <div className="col-lg-6">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Type</label>
                <select name="type" className="form-control" value={form?.type} onChange={(e) => setForm({...form, type:e.target.value})} >
                  <option value="">--</option>
                  <option value="Algebra">Algebra</option>
                  <option value="Trigonometry">Trigonometry</option>
                  <option value="Limits">Limits</option>
                  <option value="Derivatives">Derivatives</option>
                  <option value="Integrals">Integrals</option>
                </select>
              </div>
            </div>

            <div className="col-lg-6 mt-4">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Status</label>
                <select name="status" className="form-control" onChange={(e) => setForm({...form, status:e.target.value})} value={form?.status}>
                  <option value="">--</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="col-lg-6 mt-4">

            </div>
            <div className="col-lg-6 mt-4">
              <div className="form-group">
                <label htmlFor="" className='mb-2'>Description</label>
                <textarea type="text" rows="10" name="description" className="form-control" value={form?.description} onChange={(e) => setForm({...form, description:e.target.value})} />
              </div>
            </div>
            <div className="col-lg-6 mt-4">
              <label htmlFor="" className='mb-2'>Preview</label>
              <BlockMath math={formatMath(form?.description)} />
            </div>
            <div className="col-lg-12 mt-2">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => submitForm()}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default cheatsheetEdit
