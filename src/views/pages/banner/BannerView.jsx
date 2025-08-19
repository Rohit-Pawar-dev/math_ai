import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'

const BannerView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [banner, setBanner] = useState(null)

  useEffect(() => {
    API.get(`/banners/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setBanner(res.data.data)
        }
      })
      .catch(() => {
        Swal.fire('Error', 'Failed to load banner details', 'error')
      })
  }, [id])

  if (!banner) return <div className="p-4">Loading...</div>

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Banner Details</h5>
          <button className="btn btn-warning" onClick={() => navigate(-1)}>
            Back
          </button>
        </div>
        <div className="card-body">
          <div className="row">
            {/* Title */}
            <Detail label="Title" value={banner.title} />

            {/* Status */}
            <Detail label="Status" value={banner.status} />

            {/* Image */}
            {banner.image && (
              <div className="col-md-6 mb-3">
                <label className="form-label">
                  <strong>Image</strong>
                </label>
                <div className="border p-2">
                  <img
                    src={banner.image || defaultImage}
                    alt="Banner"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '200px',
                      objectFit: 'contain',
                    }}
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = defaultImage
                    }}
                  />
                </div>
              </div>
            )}
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

export default BannerView
