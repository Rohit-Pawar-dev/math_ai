import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

const notesList = () => {
  const navigate = useNavigate()

  const [notesList, setNotesList] = useState([])

  function deleteQuiz(id) {
    API.delete(`/saved-notes/${id}`)
      .then((res) => {
        if (res.status === 200) {
         var list = notesList.filter((elm, ind) => {
          return elm._id != id
         }) 
         console.log('---------- list --------------- ', list)
         setNotesList(list)
        }
      })
      .catch((err) => {
        console.log('err -------------- ', err.message)
        Swal.fire(err.code, err.message, 'error')
      })
  }

  useEffect(() => {
    API.get('/saved-notes')
      .then((res) => {
        if (res.status === 200) {
          setNotesList(res.data)
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
          <h5>Saved Notes</h5>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>S.No</th>
                <th>Title</th>
                <th>Description</th>
                <th>Saved by</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {
                notesList.length > 0 ?
                notesList.map((elm,ind) => {
                  return <tr key={ind+1}>
                    <td>{ ind+1 }</td>
                    <td>{ elm.title }</td>
                    <td>{ elm.description.substring(0, 150) }</td>
                    <td>{ elm.user_id.name }</td>
                    <td>
                      <button type="button" className="btn btn-primary btn-sm m-2" onClick={() => navigate('/saved-notes/edit/' + elm._id)}><i className="fa fa-pencil"></i></button>
                      <button type="button" className="btn btn-primary btn-sm m-2" onClick={() => deleteQuiz(elm._id)}><i className="fa fa-trash"></i></button>
                    </td>
                  </tr>
                })
                : (
                  <tr>
                    <th className="text-center" colSpan="6">No Record Found</th>
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

export default notesList
