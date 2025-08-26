import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import MEDIA_URL from '../../../media'

const SectionView = () => {
  const { id } = useParams()
  const [section, setSection] = useState(null)

  useEffect(() => {
    const fetchSection = async () => {
      try {
        const res = await API.get(`/section/${id}`)
        if (res.data.status) setSection(res.data.data)
        else Swal.fire('Error', 'Section not found', 'error')
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
      }
    }
    fetchSection()
  }, [id])

  if (!section) return <div className="text-center gap-5 mt-5">Loading section...</div>

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-body">
          <h2>Section Details</h2>
          <p><strong>Title:</strong> {section.title}</p>
          <p><strong>Topic:</strong> {section.topicId?.title}</p>
          <p><strong>Chapter:</strong> {section.chapterId?.title}</p>
          <p><strong>Status:</strong> {section.status}</p>
          {section.video && (
            <div className='d-flex gap-2 align-items-center'>
              <strong>Video:</strong>
              <video width="400" controls src={`${MEDIA_URL}/${section.video}`} />
            </div>
          )}
          <Link to="/section-list" className="btn btn-secondary mt-3">Back to Sections</Link>
        </div>
      </div>
    </section>
  )
}

export default SectionView
