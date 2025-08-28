import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { BlockMath } from "react-katex";
import "katex/dist/katex.min.css";

const cheatsheetList = () => {
  const navigate = useNavigate()

  const [calculatorList, setSeriesList] = useState([])

  function deleteQuiz(id) {
    API.delete(`/cheat-sheet/${id}`)
      .then((res) => {
        if (res.status === 200) {
         var list = calculatorList.filter((elm, ind) => {
          return elm._id != id
         })
         console.log('---------- list --------------- ', list)
         setSeriesList(list)
        }
      })
      .catch((err) => {
        console.log('err -------------- ', err.message)
        Swal.fire(err.code, err.message, 'error')
      })
  }

  const formatMath = (raw) => {
    return String.raw`\begin{aligned}
    ${raw.replace(/\n/g, " \\\\ ")}
    \end{aligned}`;
  };


  useEffect(() => {
    API.get('/cheat-sheet')
      .then((res) => {
        if (res.status === 200) {
          setSeriesList(res.data)
        }
      })
      .catch((err) => {
        console.log('err -------------- ', err.message)
        Swal.fire(err.code, err.message, 'error')
      })
  }, [])


  return (
    <section className="formSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between">
          <h5>Cheat Sheet</h5>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/cheat-sheet/create')}>Add</button>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                calculatorList.length > 0 ?
                calculatorList.map((elm,ind) => {
                  return <tr key={ind+1}>
                    <td>{ind+1}</td>
                    <td>{elm.title}</td>
                    <td>{elm.type}</td>
                    <td>
                      <button type="button" className="btn btn-primary btn-sm m-2 editbtn" onClick={() => navigate('/cheat-sheet/edit/' + elm._id)}><i className="fa fa-pencil"></i></button>
                      <button type="button" className="btn btn-primary btn-sm m-2 deletebtn" onClick={() => deleteQuiz(elm._id)}><i className="fa fa-trash"></i></button>
                    </td>
                  </tr>
                })
                : (
                  <tr>
                    <th className="text-center" colSpan="4">No Record Found</th>
                  </tr>
                )
              }
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default cheatsheetList
