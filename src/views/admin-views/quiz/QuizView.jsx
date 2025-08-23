import React, { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";
import API from "../../../api";
import Swal from "sweetalert2";

const QuizView = () => {
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  // Format date
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

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
        <NavLink to="/quiz-list" className="btn btn-warning mt-3">
          Back to List
        </NavLink>
      </div>
    );
  }

  return (
    <section className="quizView container mt-4">
      <div className="card shadow-lg p-4">
        <div className="d-flex justify-content-between align-items-center">
          <h2>{quiz.title}</h2>
          <NavLink to="/quiz-list" className="btn btn-secondary">
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
            {quiz.questions.map((q, index) => (
              <div className="accordion-item mb-2" key={q._id}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded="false"
                    aria-controls={`collapse-${index}`}
                  >
                    Q{index + 1}. {q.question}
                  </button>
                </h2>
                <div
                  id={`collapse-${index}`}
                  className="accordion-collapse collapse"
                  aria-labelledby={`heading-${index}`}
                  data-bs-parent="#questionsAccordion"
                >
                  <div className="accordion-body">
                    <h6>Options:</h6>
                    <ul>
                      {q.options.map((opt, i) => (
                        <li key={opt._id}>
                          {opt.type === "text" ? (
                            opt.value
                          ) : (
                            <img
                              src={`/${opt.value}`}
                              alt={`Option ${i + 1}`}
                              style={{
                                maxWidth: "120px",
                                borderRadius: "5px",
                                margin: "5px 0",
                              }}
                            />
                          )}
                        </li>
                      ))}
                    </ul>

                    <p>
                      <b>Answer:</b> {q.answer}
                    </p>

                    {q.explanation && (
                      <div className="mt-2">
                        <b>Explanation:</b>
                        {q.explanation.type === "text" ? (
                          <p className="mt-1">{q.explanation.value}</p>
                        ) : (
                          <img
                            src={`/${q.explanation.value}`}
                            alt="Explanation"
                            style={{ maxWidth: "250px", borderRadius: "5px" }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No questions added yet.</p>
        )}
      </div>
    </section>
  );
};

export default QuizView;
