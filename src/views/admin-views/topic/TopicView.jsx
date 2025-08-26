import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const TopicView = () => {
  const { id } = useParams()
  const [topic, setTopic] = useState(null)

  useEffect(() => {
    const fetchTopic = async () => {
      try {
        const res = await API.get(`/topic/${id}`)
        if (res.data.status) {
          setTopic(res.data.data)
        } else {
          Swal.fire('Error', 'Topic not found', 'error')
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
      }
    }
    fetchTopic()
  }, [id])

  if (!topic) {
    return <div className="text-center mt-5">Loading topic details...</div>
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-body">
          <h2>Topic Details</h2>

          <div className="mb-3">
            <strong>Title:</strong>
            <p>{topic.title}</p>
          </div>

          <div className="mb-3">
            <strong>Chapter:</strong>
            <p>{topic.chapterId?.title || '-'}</p>
          </div>

          <div className="mb-3">
            <strong>Description:</strong>
            <p>{topic.description || '-'}</p>
          </div>

          <div className="mb-3">
            <strong>Status:</strong>
            <p>{topic.status}</p>
          </div>

          <Link to="/topic-list" className="btn btn-secondary mt-3">
            Back to Topics
          </Link>
        </div>
      </div>
    </section>
  )
}

export default TopicView
