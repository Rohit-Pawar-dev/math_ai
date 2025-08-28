import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

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

const QuizResultView = () => {
  const { attemptId } = useParams()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [openIndexes, setOpenIndexes] = useState({}) // to handle collapses

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const res = await API.get(`/result/${attemptId}`)
        if (res.data.status) {
          setResult(res.data.data)
        } else {
          Swal.fire('Error', res.data.message, 'error')
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchResult()
  }, [attemptId])

  const toggleExplanation = (index) => {
    setOpenIndexes((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  if (loading) return <div className="text-center mt-5">Loading...</div>
  if (!result) return <div className="text-center mt-5">Result not found.</div>

  const {
    quiz,
    user,
    score,
    percentage,
    passed,
    totalQuestions,
    correctAnswers,
    attempt,
  } = result

  return (
    <MathJaxContext config={mathjaxConfig}>
      <div className="">
        <div className="card shadow">
          <div className="card-body">

            <div className="card-header"> <h3 className="mb-3">Quiz Result</h3></div>


            <div className="mb-3"><strong>User:</strong> {user?.name} ({user?.email})</div>
            <div className="mb-3"><strong>Quiz:</strong> {quiz?.title}</div>
            <div className="mb-3"><strong>Score:</strong> {score} / {totalQuestions}</div>
            <div className="mb-3"><strong>Correct Answers:</strong> {correctAnswers}</div>
            <div className="mb-3"><strong>Percentage:</strong> {percentage.toFixed(2)}%</div>
            <div className="mb-3">
              <strong>Status:</strong>{' '}
              <span className={`badge ${passed ? 'bg-success' : 'bg-danger'}`}>
                {passed ? 'Passed' : 'Failed'}
              </span>
            </div>

            <hr />
            <h5>Answers:</h5>

            {attempt?.answers?.map((answer, index) => {
              const question = answer.question
              const isCorrect = answer.isCorrect
              const isOpen = openIndexes[index]

              return (
                // <div key={answer._id} className="mb-4 p-3 border rounded">
                //   <p
                //     onClick={() => toggleExplanation(index)}
                //     style={{ cursor: 'pointer', fontWeight: 'bold' }}
                //   >
                //     Q{index + 1}: {question?.questionText}
                //     <span style={{ float: 'right' }}>
                //       {isOpen ? '▲' : '▼'}
                //     </span>
                //   </p>

                //   <ul className="mb-2">
                //     {question?.options?.map((option, i) => {
                //       const isSelected = answer.selectedOption === i
                //       const isAnswer = question.correctOption === i

                //       return (
                //         <li
                //           key={i}
                //           style={{
                //             fontWeight: isAnswer ? 'bold' : 'normal',
                //             color: isSelected
                //               ? isCorrect
                //                 ? 'green'
                //                 : 'red'
                //               : isAnswer
                //                 ? 'green'
                //                 : '',
                //           }}
                //         >
                //           {option}{' '}
                //           {isSelected && <strong>(Your Answer)</strong>}{' '}
                //           {isAnswer && <span>✓</span>}
                //         </li>
                //       )
                //     })}
                //   </ul>

                //   {isOpen && question?.explanation && (
                //     <div className="mt-2">
                //       <strong>Explanation:</strong>
                //       {question.explanationType === 'image' ? (
                //         <div className="mt-2">
                //           <img
                //             src={question.explanation}
                //             alt="Explanation"
                //             style={{ maxWidth: '100%', border: '1px solid #ddd' }}
                //           />
                //         </div>
                //       ) : (
                //         // <p className="mt-2">{question.explanation}</p>
                //         <MathJax dynamic>{processDescription(question.explanation)}</MathJax>
                //       )}
                //     </div>
                //   )}
                // </div>
                 <div key={answer._id} className="mb-4 p-3 border rounded">
      {/* QUESTION TEXT with MathJax */}
      <p
        onClick={() => toggleExplanation(index)}
        style={{ cursor: 'pointer', fontWeight: 'bold' }}
      >
        Q{index + 1}:{' '}
        <MathJax dynamic>{processDescription(question?.questionText)}</MathJax>
        {/* <span style={{ float: 'right' }}>{isOpen ? '▲' : '▼'}</span> */}
        <span style={{ float: 'right' }}>
  <i className={`bi ${isOpen ? 'bi-chevron-up' : 'bi-chevron-down'}`}></i>
</span>
      </p>

      {/* OPTIONS with MathJax */}
      <ul className="mb-2">
        {question?.options?.map((option, i) => {
          const isSelected = answer.selectedOption === i
          const isAnswer = question.correctOption === i

          return (
            <li
              key={i}
              style={{
                fontWeight: isAnswer ? 'bold' : 'normal',
                color: isSelected
                  ? isCorrect
                    ? 'green'
                    : 'red'
                  : isAnswer
                    ? 'green'
                    : '',
              }}
            >
              <MathJax dynamic>{processDescription(option)}</MathJax>{' '}
              {isSelected && <strong>(Your Answer)</strong>}{' '}
              {isAnswer && <span>✓</span>}
            </li>
          )
        })}
      </ul>

      {/* EXPLANATION with MathJax */}
      {isOpen && question?.explanation && (
        <div className="mt-2">
          <strong>Explanation:</strong>
          {question.explanationType === 'image' ? (
            <div className="mt-2">
              <img
                src={question.explanation}
                alt="Explanation"
                style={{ maxWidth: '100%', border: '1px solid #ddd' }}
              />
            </div>
          ) : (
            <div className="mt-2">
              <MathJax dynamic>
                {processDescription(question.explanation)}
              </MathJax>
            </div>
          )}
        </div>
      )}
    </div>
              )
            })}
          </div>
        </div>
      </div>
    </MathJaxContext>
  )
}

export default QuizResultView
