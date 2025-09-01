import React, { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import API from "../../../api"
import Swal from "sweetalert2"
import {
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CFormTextarea,
  CSpinner,
} from "@coreui/react"

const FeedbackView = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(true)
  const [response, setResponse] = useState("")

  // Fetch single feedback
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const res = await API.get(`/feedbacks/${id}`)
        if (res.data.status) {
          setFeedback(res.data.data)
          setResponse(res.data.data.response || "")
        }
      } catch (err) {
        Swal.fire("Error", "Failed to fetch feedback", "error")
      } finally {
        setLoading(false)
      }
    }
    fetchFeedback()
  }, [id])

  // Submit response
  const handleRespond = async () => {
    try {
      const res = await API.put(`/feedbacks/respond/${id}`, { response })
      if (res.data.status) {
        Swal.fire("Success", "Response submitted successfully", "success")
        setFeedback(res.data.data)
      }
    } catch (err) {
      Swal.fire("Error", "Failed to submit response", "error")
    }
  }

  if (loading) {
    return (
      <div className="text-center mt-5">
        <CSpinner />
      </div>
    )
  }

  if (!feedback) {
    return <div className="text-center mt-5">Feedback not found</div>
  }

  return (
    <div className="">
      <CCard>
        <CCardHeader className="headerdiv">
          <h4>Feedback Details</h4>
           <CButton color="secondary" className="" onClick={() => navigate(-1)}>
            Back
          </CButton>
        </CCardHeader>
        <CCardBody>

            <table className="table table-bordered mt-4">
              <thead>
                <tr>
                  <th>User Name:</th>
                  <th>User Email:</th>
                  <th>Description:</th>
                  <th>Date:</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{feedback.user_id?.name}</td>
                  <td>{feedback.user_id?.email}</td>
                  <td>{feedback.description}</td>
                  <td>{" "}
            {new Date(feedback.createdAt).toLocaleString()}</td>
                </tr>
              </tbody>
            </table>

          {/* <p>
            <strong>User Name:</strong> {feedback.user_id?.name}
          </p>
          <p>
            <strong>User Email:</strong> {feedback.user_id?.email}
          </p>
          <p>
            <strong>Description:</strong> {feedback.description}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(feedback.createdAt).toLocaleString()}
          </p> */}

          <div className="mt-3">
            <label>
              <strong>Admin Response:</strong>
            </label>
            <CFormTextarea
              rows={3}
              className="mt-2"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
            />
            <CButton color="primary" className="mt-3" onClick={handleRespond}>
              Submit Response
            </CButton>
          </div>


        </CCardBody>
      </CCard>
    </div>
  )
}

export default FeedbackView
