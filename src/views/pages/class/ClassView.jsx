import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const ClassView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [classData, setClassData] = useState(null)

  useEffect(() => {
    API.get(`/classes/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setClassData(res.data)
        }
      })
      .catch((err) => {
        console.error(err)
        Swal.fire('Error', 'Failed to load class details', 'error')
      })
  }, [id])

  if (!classData) return <div className="p-4">Loading...</div>

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Class Details</h5>
          <button className="btn btn-warning" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="card-body">

           <table className="table table-bordered mt-4">
            <thead>
              <tr>
                <th>Name:</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{classData.name}</td>
                <td>{classData.description || 'N/A'}</td>
                <td>{classData.status}</td>
              </tr>
            </tbody>
           </table>
          <div className="row d-none">
            <Detail label="Name" value={classData.name} />
            <Detail label="Description" value={classData.description || 'N/A'} />
            <Detail label="Status" value={classData.status} />
            {/* <Detail
              label="Created At"
              value={new Date(classData.createdAt).toLocaleString()}
            />
            <Detail
              label="Updated At"
              value={new Date(classData.updatedAt).toLocaleString()}
            /> */}
          </div>
        </div>
      </div>
    </section>
  )
}

const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label">
      <strong>{label}</strong>
    </label>
    <p className="form-control-plaintext">{value}</p>
  </div>
)

export default ClassView
