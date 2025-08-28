import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const SubscriptionDetails = () => {
  const { state } = useLocation()
  const navigate = useNavigate()

  const subscription = state?.subscription

  if (!subscription) {
    return (
      <div className="container mt-5 text-center">
        <p className="text-danger">No subscription data found.</p>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          Go Back
        </button>
      </div>
    )
  }

  const plan = subscription.plan
  const user = subscription.user

  return (
    <section className="">
    <section className="tableSection">
      <div className="card mt-2">
        <div className="headdiv">
          <h2 className="">Subscription Details</h2>

          <div className="">
            <button className="btn btn-secondary" onClick={() => navigate(-1)}>
            Back to List
            </button>
          </div>
        </div>
        <div className="row g-3 customTableView">
          <div className="col-md-6 col-lg-4">
            <strong>Plan Title:</strong> <div>{plan?.title}</div>
          </div>
          <div className="col-md-6 col-lg-4">
            <strong>Plan Amount:</strong> <div>₹ {plan?.amount}</div>
          </div>
          <div className="col-md-6 col-lg-4">
            <strong>User Name:</strong> <div>{user?.name}</div>
          </div>
          <div className="col-md-6 col-lg-4">
            <strong>Email:</strong> <div>{user?.email}</div>
          </div>
          <div className="col-md-6 col-lg-4">
            <strong>Mobile:</strong> <div>{user?.mobile}</div>
          </div>
          <div className="col-md-6 col-lg-4">
            <strong>Transaction ID:</strong> <div>{subscription.transaction_id}</div>
          </div>
          <div className="col-md-6 col-lg-4">
            <strong>Payment Method:</strong> <div>{subscription.payment_method}</div>
          </div>
          <div className="col-md-6 col-lg-4">
            <strong>Start Date:</strong>{' '}
            <div>{new Date(subscription.start_date).toLocaleDateString()}</div>
          </div>
          <div className="col-md-6 col-lg-4">
            <strong>End Date:</strong>{' '}
            <div>{new Date(subscription.end_date).toLocaleDateString()}</div>
          </div>

          <div className="col-md-6 col-lg-4">
            <strong>Status:</strong>{' '}
            <div>
              {new Date(subscription.end_date) < new Date() ? 'Inactive' : subscription.status}
            </div>
          </div>

          {/* <div className="col-md-6 col-lg-4">
            <strong>Auto Renew:</strong> <div>{subscription.is_auto_renew ? 'Yes' : 'No'}</div>
          </div> */}
        </div>


      </div>
    </section>
    </section>
  )
}

export default SubscriptionDetails
