import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import API from "../../../api";
import Swal from "sweetalert2";
import MEDIA_URL from '../../../media'
import { MathJax, MathJaxContext } from 'better-react-mathjax'

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


const mathjaxConfig = {
  tex: { inlineMath: [["$", "$"], ["\\(", "\\)"]] },
}




const QuizView = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  useEffect(() => {
    if (quiz) {
      // Re-render MathJax after DOM update
      setTimeout(() => {
        if (window.MathJax) {
          window.MathJax.typesetPromise();
        }
      }, 0);
    }
  }, [quiz]);


  const fetchQuiz = async () => {
    try {
      const res = await API.get(`/quizzes/${id}`);
      if (res.data.status) {
        setQuiz(res.data.data);
      }
    } catch (err) {
      Swal.fire("Error", err.response?.data?.message || err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <h4>Loading quiz...</h4>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="text-center mt-5">
        <h4>Quiz not found</h4>
        <NavLink to="/admin/quiz-list" className="btn btn-warning mt-3">
          Back to List
        </NavLink>
      </div>
    );
  }

  return (
    <MathJaxContext config={mathjaxConfig}>
      <section className="quizView">
        <div className="card shadow-lg p-4">
          <div className="d-flex justify-content-between align-items-center">
            <h2>{quiz.title}</h2>
            <NavLink to="/admin/quiz-list" className="btn btn-secondary">
              Back
            </NavLink>
          </div>
          <p className="text-muted">{quiz.description}</p>

          {quiz.image && (
            <div className="mb-3">
              <img
                src={quiz.image}
                alt={quiz.title}
                style={{ maxWidth: "200px", borderRadius: "8px" }}
              />
            </div>
          )}

          <ul className="list-group mb-4">
            <li className="list-group-item">
              <b>Status:</b> {quiz.status}
            </li>
            <li className="list-group-item">
              <b>Paid:</b> {quiz.is_paid ? "Yes" : "No"}
            </li>
            {quiz.is_paid && (
              <li className="list-group-item">
                <b>Amount:</b> ₹{quiz.amount}
              </li>
            )}
            <li className="list-group-item">
              <b>Total Questions:</b> {quiz.questions?.length || 0}
            </li>
            <li className="list-group-item">
              <b>Created At:</b> {formatDate(quiz.created_at)}
            </li>
          </ul>

          <h4>Questions</h4>
          {quiz.questions && quiz.questions.length > 0 ? (
            <div className="accordion" id="questionsAccordion">
              {quiz.questions.map((q, index) => {
                const headingId = `heading-${index}`;
                const collapseId = `collapse-${index}`;
                return (
                  <div className="accordion-item mb-2" key={q._id}>
                    <h2 className="accordion-header" id={headingId}>
                      <button
                        className="accordion-button collapsed"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${collapseId}`}
                        aria-expanded="false"
                        aria-controls={collapseId}
                      >
                        {/* <span dangerouslySetInnerHTML={{ __html: `Q${index + 1}. ${q.question}` }} /> */}
                        <MathJax dynamic>{processDescription(q.question)}</MathJax>
                      </button>
                    </h2>
                    <div
                      id={collapseId}
                      className="accordion-collapse collapse"
                      aria-labelledby={headingId}
                      data-bs-parent="#questionsAccordion"
                    >
                      <div className="accordion-body">
                        <h6>Options:</h6>
                        <ul>
                          {q.options.map((opt, i) => (
                            <li key={i}>
                              {q.optionType === "text" ? (
                                // <span dangerouslySetInnerHTML={{ __html: opt }} />
                                <MathJax dynamic>{processDescription(opt)}</MathJax>
                              ) : (
                                <img
                                  src={`${MEDIA_URL}/${opt}`}
                                  alt={`Option ${i + 1}`}
                                  style={{
                                    maxWidth: "70px",
                                    borderRadius: "5px",
                                    margin: "5px 0",
                                  }}
                                />
                              )}
                            </li>
                          ))}

                        </ul>

                        <p>
                          <b>Answer:</b>{" "}
                          {q.optionType === "text" ? (
                            // <span
                            //   dangerouslySetInnerHTML={{
                            //     __html: q.options[q.answer],
                            //   }}
                            // />
                            <MathJax dynamic>{processDescription(q.options[q.answer])}</MathJax>
                          ) : (
                            `Option ${q.answer + 1}`
                          )}
                        </p>

                        {q.explanation && (
                          <div className="mt-2">
                            <b>Explanation:</b>
                            {q.explanationType === "text" ? (
                              // <p
                              //   className="mt-1"
                              //   dangerouslySetInnerHTML={{ __html: q.explanation }}
                              // />
                              <MathJax dynamic>{processDescription(q.explanation)}</MathJax>
                            ) : (
                              <img
                                src={`${MEDIA_URL}/${q.explanation}`}
                                alt="Explanation"
                                style={{ maxWidth: "100px", borderRadius: "5px" }}
                              />
                            )}
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted">No questions added yet.</p>
          )}
        </div>
      </section>
    </MathJaxContext>
  );
};

export default QuizView;
