import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const GenreView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [genre, setGenre] = useState(null)
  const [loading, setLoading] = useState(true)
  const [languages, setLanguages] = useState([])

  useEffect(() => {
    API.get(`/genre/${id}`)
      .then(res => {
        if (res.status === 200) {
          setGenre(res.data)

          // Dynamically collect language codes from title
          const langCodes = res.data?.title ? Object.keys(res.data.title) : []
          setLanguages(langCodes)
        }
      })
      .catch(err => {
        console.error(err)
        Swal.fire('Error', 'Failed to fetch genre details', 'error')
      })
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-4">Loading...</div>
  if (!genre) return <div className="p-4">Genre not found.</div>

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Genre Details</h5>
          <button className="btn btn-warning" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className="card-body">
          <div className="row">
            <Detail label="Display Name" value={genre.display_name} />
            {languages.map((lang) => (
              <Detail
                key={lang}
                label={`Title (${lang.toUpperCase()})`}
                value={genre.title?.[lang] || '-'}
              />
            ))}
            <Detail label="Status" value={genre.status} />
          </div>
        </div>
      </div>
    </section>
  )
}

const Detail = ({ label, value }) => (
  <div className="col-md-6 mb-3">
    <label className="form-label"><strong>{label}</strong></label>
    <p className="form-control-plaintext">{value}</p>
  </div>
)

export default GenreView
