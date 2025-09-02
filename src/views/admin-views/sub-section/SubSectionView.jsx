import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const SubsectionView = () => {
  const { id } = useParams()
  const [subsection, setSubsection] = useState(null)

  useEffect(() => {
    API.get(`/subsection/${id}`)
      .then(res => {
        if (res.data.status) setSubsection(res.data.data)
      })
      .catch(err => Swal.fire('Error', err.response?.data?.message || err.message, 'error'))
  }, [id])

  if (!subsection) return <p>Loading...</p>

  return (
    <div className="card">
      <div className="card-body">
        <div className="cardheaddiv">
          <h2>Subsection Details</h2>
          <NavLink to="/admin/subsection-list" className="btn btn-secondary ms-2">Back</NavLink>
        </div>
        <table className="table table-bordered mt-4">
          <thead>
            <tr>
              <th><strong>Title:</strong></th>
              <th><strong>Chapter:</strong></th>
              <th><strong>Topic:</strong></th>
              <th><strong>Section:</strong></th>
              <th><strong>Content:</strong></th>
              <th><strong>Status:</strong></th>
            </tr>

          </thead>
          <tbody>
            <tr>
              <td>{subsection.title}</td>
              <td>{subsection.chapterId?.title}</td>
              <td>{subsection.topicId?.title}</td>
              <td>{subsection.sectionId?.title}</td>
              <td>{subsection.content}</td>
              <td>{subsection.status}</td>
            </tr>
          </tbody>
        </table>
        {/* <p> </p>
        <p><strong></strong> </p>
        <p><strong></strong> </p>
        <p><strong></strong> </p>
        <p><strong></strong> </p>
        <p><strong></strong> </p> */}

        {/* <NavLink to={`/subsection-edit/${subsection._id}`} className="btn btn-warning">Edit</NavLink> */}
        {/* <NavLink to="/subsection-list" className="btn btn-secondary ms-2">Back</NavLink> */}
      </div>
    </div>
  )
}

export default SubsectionView
