import React, { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import API from "../../../api"
import Swal from "sweetalert2"
import { MathJax, MathJaxContext } from "better-react-mathjax"

const QuestionEdit = () => {
  const { id } = useParams()
  const [question, setQuestion] = useState("")
  const [optionType, setOptionType] = useState("text")
  const [options, setOptions] = useState(["", "", "", ""])
  const [optionFiles, setOptionFiles] = useState([null, null, null, null])
  const [optionPreviews, setOptionPreviews] = useState([null, null, null, null])
  const [answer, setAnswer] = useState(0)
  const [explanationType, setExplanationType] = useState("text")
  const [explanation, setExplanation] = useState("")
  const [explanationFile, setExplanationFile] = useState(null)
  const [explanationPreview, setExplanationPreview] = useState(null)
  const [status, setStatus] = useState("active")
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  // --- MathJax Config ---
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

  // --- Fetch Existing Question ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.get(`/questions/${id}`)
        const q = res.data?.data || res.data || {}
        setQuestion(q.question || "")
        setOptionType(q.optionType || "text")

        if (q.optionType === "text") {
          setOptions(q.options || ["", "", "", ""])
        } else {
          setOptionPreviews(q.options || [null, null, null, null])
        }

        setAnswer(Number.isInteger(q.answer) ? q.answer : 0)

        setExplanationType(q.explanationType || "text")
        if (q.explanationType === "text") {
          setExplanation(q.explanation || "")
        } else {
          setExplanationPreview(q.explanation || null)
        }

        setStatus(q.status || "active")
      } catch (err) {
        console.error("Fetch error:", err)
        Swal.fire("Error", "Failed to fetch question", "error")
      }
    }
    fetchData()
  }, [id])


  // --- Handlers ---
  const handleOptionChange = (index, value) => {
    const newOptions = [...options]
    newOptions[index] = value
    setOptions(newOptions)
  }

  const handleOptionFileChange = (index, file) => {
    const newFiles = [...optionFiles]
    const newPreviews = [...optionPreviews]
    newFiles[index] = file
    newPreviews[index] = file ? URL.createObjectURL(file) : null
    setOptionFiles(newFiles)
    setOptionPreviews(newPreviews)
  }

  const handleExplanationFileChange = (e) => {
    const file = e.target.files[0]
    setExplanationFile(file)
    setExplanationPreview(file ? URL.createObjectURL(file) : null)
  }

  // --- Submit Update ---
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("question", question)
      formData.append("optionType", optionType)
      formData.append("answer", answer)
      formData.append("explanationType", explanationType)
      formData.append("status", status)

      if (optionType === "text") {
        formData.append("options", JSON.stringify(options))
      } else {
        optionFiles.forEach((file, idx) => {
          if (file) {
            formData.append(`options[${idx}]`, file)
          }
        })
      }

      if (explanationType === "text") {
        formData.append("explanation", explanation)
      } else if (explanationFile) {
        formData.append("explanation", explanationFile)
      }

      const res = await API.put(`/questions/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (res.data.status) {
        Swal.fire("Success", "Question updated successfully", "success")
        navigate("/question-list")
      }
    } catch (err) {
      console.error(err)
      Swal.fire("Error", err.response?.data?.message || err.message, "error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <MathJaxContext config={mathjaxConfig}>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="text-primary">Edit Question</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/question-list")}
          >
            ← Back
          </button>
        </div>

        <div className="row">
          {/* Form */}
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="form-group mb-3">
                    <label><strong>Question</strong></label>
                    <input
                      type="text"
                      className="form-control"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label><strong>Option Type</strong></label>
                    <select
                      className="form-control"
                      value={optionType}
                      onChange={(e) => setOptionType(e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                    </select>
                  </div>

                  {/* Options */}
                  {optionType === "text" ? (
                    options.map((opt, idx) => (
                      <div className="form-group mb-3" key={idx}>
                        <label>Option {idx + 1}</label>
                        <input
                          type="text"
                          className="form-control"
                          value={opt}
                          onChange={(e) => handleOptionChange(idx, e.target.value)}
                          required
                        />
                      </div>
                    ))
                  ) : (
                    optionPreviews.map((src, idx) => (
                      <div className="form-group mb-3" key={idx}>
                        <label>Option {idx + 1}</label>
                        <input
                          type="file"
                          className="form-control"
                          accept="image/*"
                          onChange={(e) => handleOptionFileChange(idx, e.target.files[0])}
                        />
                        {src && (
                          <img
                            src={src}
                            alt={`Option ${idx + 1}`}
                            className="img-thumbnail mt-2"
                            style={{ width: "100px", height: "100px", objectFit: "cover" }}
                          />
                        )}
                      </div>
                    ))
                  )}

                  <div className="form-group mb-3">
                    <label><strong>Answer (1-4)</strong></label>
                    <input
                      type="number"
                      className="form-control"
                      min="1"
                      max="4"
                      value={answer + 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value)
                        if (!isNaN(val) && val >= 1 && val <= 4) {
                          setAnswer(val - 1)
                        }
                      }}
                      required
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label><strong>Explanation Type</strong></label>
                    <select
                      className="form-control"
                      value={explanationType}
                      onChange={(e) => setExplanationType(e.target.value)}
                    >
                      <option value="text">Text</option>
                      <option value="image">Image</option>
                    </select>
                  </div>

                  {explanationType === "text" ? (
                    <div className="form-group mb-3">
                      <label>Explanation</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={explanation}
                        onChange={(e) => setExplanation(e.target.value)}
                      />
                    </div>
                  ) : (
                    <div className="form-group mb-3">
                      <label>Upload Explanation Image</label>
                      <input
                        type="file"
                        className="form-control"
                        accept="image/*"
                        onChange={handleExplanationFileChange}
                      />
                      {explanationPreview && (
                        <img
                          src={explanationPreview}
                          alt="Explanation"
                          className="img-thumbnail mt-2"
                          style={{ width: "200px", objectFit: "cover" }}
                        />
                      )}
                    </div>
                  )}

                  <div className="form-group mb-4">
                    <label><strong>Status</strong></label>
                    <select
                      className="form-control"
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-success w-100"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update Question"}
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="col-md-6">
            <div className="card shadow-sm mb-4">
              <div className="card-body">
                <h4 className="text-secondary mb-3">Live Preview</h4>

                <p><strong>Question:</strong></p>
                <MathJax dynamic>{processDescription(question)}</MathJax>

                <div className="mb-3">
                  <strong>Options:</strong>
                  <ul className="list-unstyled mt-2">
                    {optionType === "text"
                      ? options.map((opt, idx) => (
                        <li key={idx}>
                          • <MathJax dynamic>{processDescription(opt)}</MathJax>
                        </li>
                      ))
                      : optionPreviews.map(
                        (src, idx) =>
                          src && (
                            <li key={idx}>
                              <img
                                src={src}
                                alt={`Option ${idx}`}
                                className="img-thumbnail mb-2"
                                style={{ width: "100px", objectFit: "cover" }}
                              />
                            </li>
                          )
                      )}
                  </ul>
                </div>

                <p><strong>Correct Answer Index:</strong> {answer + 1}</p>

                <div className="mb-3">
                  <strong>Explanation:</strong>
                  {explanationType === "text" ? (
                    <MathJax dynamic>{processDescription(explanation)}</MathJax>
                  ) : (
                    explanationPreview && (
                      <img
                        src={explanationPreview}
                        alt="Explanation"
                        className="img-thumbnail"
                        style={{ width: "200px", objectFit: "cover" }}
                      />
                    )
                  )}
                </div>

                <p><strong>Status:</strong> {status}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MathJaxContext>
  )
}

export default QuestionEdit
