import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'
import MEDIA_URL from '../../../media'

const ChapterView = () => {
  const { id } = useParams()
  const [chapter, setChapter] = useState(null)

  useEffect(() => {
    const fetchChapter = async () => {
      try {
        const res = await API.get(`/chapter/${id}`)
        if (res.data.status) {
          setChapter(res.data.data)
        } else {
          Swal.fire('Error', 'Chapter not found', 'error')
        }
      } catch (err) {
        Swal.fire('Error', err.response?.data?.message || err.message, 'error')
      }
    }
    fetchChapter()
  }, [id])

  if (!chapter) {
    return <div className="text-center mt-5">Loading chapter details...</div>
  }

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-body">
          <div className="cardheaddiv">
          <h2>Chapter Details</h2>
             <Link to="/admin/chapter-list" className="btn btn-secondary">
            Back to Chapters
          </Link>
          </div>
          {/* <div className="mb-3">
            <strong>Icon:</strong>
            <div>
              <img
                src={chapter.icon ? `${MEDIA_URL}/${chapter.icon}` : defaultImage}
                alt="Chapter Icon"
                width="100px"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = defaultImage
                }}
              />
            </div>
          </div>

          <div className="mb-3">
            <strong>Title:</strong>
            <p>{chapter.title}</p>
          </div>


          <div className="mb-3">
            <strong>Status:</strong>
            <p>{chapter.status}</p>
          </div>

          <div className="mb-3">
            <strong>Created At:</strong>
            <p>{new Date(chapter.timestamp).toLocaleString()}</p>
          </div> */}

          {/* <Link to="/chapter-list" className="btn btn-secondary mt-3">
            Back to Chapters
          </Link> */}

             <table className="table table-bordered mt-4">
            <tbody>
              {/* Icon */}
              <tr>
                <th>Icon:</th>
                <th>Title:</th>
                <th>Status:</th>
                <th>Created At:</th>
              </tr>


              <tr>
                <td>
                  <img
                    src={chapter.icon ? `${MEDIA_URL}/${chapter.icon}` : defaultImage}
                    alt="Chapter Icon"
                    width="100px"
                    onError={(e) => {
                      e.target.onerror = null
                      e.target.src = defaultImage
                    }}
                  />
                </td>
                <td>{chapter.title}</td>
                <td>{chapter.status}</td>
                <td>{new Date(chapter.timestamp).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

export default ChapterView
