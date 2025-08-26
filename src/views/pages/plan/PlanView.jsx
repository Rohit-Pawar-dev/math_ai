import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const PlanView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/plan/${id}`)
      .then(res => {
        if (res.status === 200) {
          setPlan(res.data)
        }
      })
      .catch(err => {
        console.error(err)
        Swal.fire('Error', 'Failed to fetch plan details', 'error')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [id])

  if (loading) return <div className="p-4">Loading...</div>
  if (!plan) return <div className="p-4">Plan not found.</div>

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Plan Details</h5>
          <button className="btn btn-warning" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className="card-body">
          <div className="row">
            <Detail label="Title" value={plan.title} />
            <Detail label="Amount" value={`₹ ${plan.amount}`} />
            {/* <Detail label="Discount" value={`${plan.discount} (${plan.discount_type})`} /> */}
            <Detail label="Validity" value={`${plan.validity_time} ${plan.validity_type}`} />
            <Detail label="Status" value={plan.status} />
            <div className="col-md-12 mb-3">
              <strong>Description:</strong>
              <p className="form-control-plaintext">{plan.description}</p>
            </div>
            {plan.image && (
              <div className="col-md-12 mb-3">
                <strong>Image:</strong><br />
                <img src={plan.image} alt="Plan" className="img-fluid rounded" style={{ maxWidth: '300px' }} />
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
    <label className="form-label"><strong>{label}</strong></label>
    <p className="form-control-plaintext">{value}</p>
  </div>
)

export default PlanView
