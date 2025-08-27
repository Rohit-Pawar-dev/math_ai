import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

const TopicView = () => {
  const { id } = useParams()
  const [topic, setTopic] = useState(null)


  
  const mathjaxConfig = {
    tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
  }

  const processDescription = (desc) => {
  if (!desc) return "";

  // If the whole input already looks like LaTeX, wrap it once.
  const looksLikeFullLatex = /^[^a-zA-Z0-9]*x\^.*\\left|\\right|\\mathrm|\\quad/.test(desc);
  if (looksLikeFullLatex) {
    return `$${desc}$`;
  }

  // Otherwise, only wrap inline math pieces with ^ or _
  let processed = desc.replace(/([^\s]*[\^_][^\s]*)/g, (match) => {
    if (/^\$.*\$$/.test(match)) return match;
    return `$${match}$`;
  });

  // Replace newlines with LaTeX line breaks
  processed = processed.replace(/\n/g, " \\\\ ");
  return processed;
};


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
        <MathJaxContext config={mathjaxConfig}>
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
            <MathJax dynamic>{processDescription(topic.description) || "-"}</MathJax>
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
    </MathJaxContext>
  )
}

export default TopicView
