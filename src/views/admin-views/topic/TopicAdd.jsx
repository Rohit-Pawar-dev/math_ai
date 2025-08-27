
import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

const AddTopic = () => {
  const navigate = useNavigate()
  const [chapters, setChapters] = useState([])
  const [formData, setFormData] = useState({
    chapterId: '',
    title: '',
    description: '',
    status: 'active',
  })
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
    const fetchChapters = async () => {
      try {
        const res = await API.get('/chapter')
        if (res.data.status) setChapters(res.data.data)
      } catch (err) {
        console.error(err)
      }
    }
    fetchChapters()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.chapterId) return Swal.fire('Error', 'Please select chapter', 'error')
    try {
      const res = await API.post('/topic', formData)
      if (res.data.status) {
        Swal.fire('Success', 'Topic added successfully!', 'success')
        navigate('/topic-list')
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  const mathjaxConfig = {
    tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
  }

  return (
    <MathJaxContext config={mathjaxConfig}>
      <section className="formSection">
        <div className="card">
          <div className="card-body">
            <h2>Add New Topic</h2>
            <form onSubmit={handleSubmit}>
              {/* Chapter */}
              <div className="mb-3">
                <label className="form-label">Chapter</label>
                <select
                  className="form-select"
                  name="chapterId"
                  value={formData.chapterId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Chapter</option>
                  {chapters.map((ch) => (
                    <option key={ch._id} value={ch._id}>
                      {ch.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Description */}
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              {/* Live MathJax Preview */}
              {formData.description && (
                <div className="mb-3 p-3 border rounded bg-light">
                  <label className="form-label fw-bold">Preview:</label>
                  {/* <MathJax dynamic>{"$$" + formData.description + "$$"}</MathJax> */}
                  <MathJax dynamic>{processDescription(formData.description)}</MathJax>

                </div>
              )}

              {/* Status */}
              <div className="mb-3">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              <button type="submit" className="btn btn-warning">Save Topic</button>
            </form>
          </div>
        </div>
      </section>
    </MathJaxContext>
  )
}

export default AddTopic
