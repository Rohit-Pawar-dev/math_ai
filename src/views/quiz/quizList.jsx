import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
// import Select from 'react-select'
// import { color } from 'chart.js/helpers'
// import customSelectStyles from '../../assets/reactSelectStyles'

const quizList = () => {
  const navigate = useNavigate()

  const [seriesList, setSeriesList] = useState([])

  function deleteQuiz(id) {
    API.delete(`/quizes/${id}`)
      .then((res) => {
        if (res.status === 200) {
         var list = seriesList.filter((elm, ind) => {
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

  useEffect(() => {
    API.get('/quizes')
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
          <h5>Quizes</h5>
          <button type="button" className="btn btn-primary btn-sm" onClick={() => navigate('/quizes/create')}>Add</button>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Description</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                seriesList.length > 0 ?
                seriesList.map((elm,ind) => {
                  return <tr key={ind+1}>
                    <td>{ind+1}</td>
                    <td>{elm.title}</td>
                    <td>{elm.description}</td>
                    <td>
                      <button type="button" className="btn btn-primary btn-sm m-2" onClick={() => navigate('/quizes/edit')}><i className="fa fa-pencil"></i></button>
                      <button type="button" className="btn btn-primary btn-sm m-2" onClick={() => deleteQuiz(elm._id)}><i className="fa fa-trash"></i></button>
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

export default quizList
