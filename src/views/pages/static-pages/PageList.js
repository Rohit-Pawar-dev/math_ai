import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import CKEditor4 from '../../../components/CkEditor'

const PageList = () => {
  
  const { id } = useParams();
  const [pages, setPage] = useState([])
  const [content, setContent] = useState("")
  useEffect(function(){
    API.get('/page') // Replace with actual API route
      .then(res => {
        console.log('res ---------------- ', res, res.status)
        if(res.status == 200) {            
          setPage(res.data)
        }
      })
      .catch(err => console.error(err));
  }, [])

  return (
    <>
      <section className="tableSection">
        <div className="card">
          <div className="card-body">
            <div className="container-fliud">
              <h2>Static Pages</h2>
              <div className="mainContent">
                <table>
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Title</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pages.length == 0 ? 
                      <tr><td colSpan="6">No data found ...</td></tr>
                    : pages.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item.title}</td>
                        <td>
                          <div className="actionTable">
                            <NavLink to={"/page-edit/" + item._id}>
                              <CIcon icon={cilPencil} custom='true' className="nav-icon" />
                            </NavLink>
                          </div>
                        </td>
                      </tr>
                    )
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default PageList
