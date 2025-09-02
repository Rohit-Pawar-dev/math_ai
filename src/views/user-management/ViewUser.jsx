import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../assets/images/default.png'

const ViewUser = () => {
  const { id } = useParams()
  const [user, setUser] = useState({})
  const [plan, setPlan] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    API.get(`/users/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setUser(res.data)
        }
      })
      .catch((err) => {
        Swal.fire('Error', err.message, 'error')
      })
  }, [id])

  // Fetch plan details if planId exists in subscription
  useEffect(() => {
    const planId = user.subscription?.planId
    if (planId) {
      setLoading(true)
      API.get(`/plan/${planId}`)
        .then((res) => {
          if (res.status === 200) {
            setPlan(res.data)
          }
        })
        .catch((err) => {
          // console.error(err);
          Swal.fire('Error', 'Failed to fetch plan data', 'error')
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [user.subscription?.planId])

  return (
    <>
      <section className="tableSection">
        <div className="container-fliud">
          <h2>User View</h2>
          <div className="mainContent">
            <div className="card">
              <div className="card-body">
                <h6 className="mb-4">General Information</h6>
                <form>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="mb-2">Name</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user.name || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="mb-2">Email</label>
                        <input
                          type="email"
                          className="form-control"
                          value={user.email || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="mb-2">Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user.mobile || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      {user.classStandard && (
                        <div className="form-group mb-4">
                          <label className="mb-2">Class / Standard</label>
                          <input
                            type="text"
                            className="form-control"
                            value={user.classStandard.name}
                            readOnly
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-4">
                        <label className="mb-2">Status</label>
                        <input
                          type="text"
                          className="form-control"
                          value={user.status || ''}
                          readOnly
                        />
                      </div>
                    </div>
                    {user.profilePicture ? (
                      <div className="col-md-6">
                        <div className="form-group mb-4">
                          <label className="mb-2">User Image</label>
                          <div>
                            <img
                              src={user.profilePicture}
                              alt="Profile"
                              width="150px"
                              className="img-thumbnail"
                              onError={(e) => {
                                e.target.onerror = null
                                e.target.src = defaultImage
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="col-md-6">
                        <div className="form-group mb-4">
                          <label className="mb-2">User Image</label>
                          <div>
                            <img
                              src={defaultImage}
                              alt="Default Profile"
                              width="150px"
                              className="img-thumbnail"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </form>

                {user.subscription?.planId ? (
                  plan && (
                    <>
                      <h6 className="mt-5 mb-3">Subscription Plan</h6>
                      <div className="row">
                        <div className="col-md-6">
                          <label>Plan Name:</label>
                          <p>{plan.title}</p>
                        </div>
                        <div className="col-md-6">
                          <label>Price:</label>
                          <p>{plan.amount}</p>
                        </div>
                        <div className="col-md-6">
                          <label>Benefit:</label>
                          <p>{plan.coins}</p>
                        </div>
                        <div className="col-md-6">
                          <label>Duration:</label>
                          <p>
                            {plan.validity_time} {plan.validity_type}
                          </p>
                        </div>
                        <div className="col-md-6">
                          <label>Start Date:</label>
                          <p>{new Date(user.subscription?.startDate).toLocaleDateString()}</p>
                        </div>
                        <div className="col-md-6">
                          <label>End Date:</label>
                          <p>{new Date(user.subscription?.endDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </>
                  )
                ) : (
                  <div className="mt-4">
                    <h6>Subscription Plan</h6>
                    <p>No plan purchased.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default ViewUser
