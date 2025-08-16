import React, { useEffect, useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import CKEditor4 from '../../../components/CkEditor'
import Swal from 'sweetalert2'

const PageEdit = () => {
  
  const { id } = useParams();
  const [plan, setPlan] = useState({})
  const [content, setContent] = useState('')
  useEffect(function(){
    API.get('/page/' + id) // Replace with actual API route
      .then(res => {
        if(res.status == 200) {            
          setContent(res.data.content)
          setPlan(res.data)
        }
      })
      .catch(err => console.error(err));
  }, [])

  const handleFormSubmit = () => {
    plan.content = content
    API.put('/page/' + id, plan) // Replace with actual API route
      .then(res => {
        if(res.status == 200) {
          Swal.fire(`Success`, 'Page updated success', 'success').then(() => {
            window.location.reload()
          })
        }
      })
      .catch(err => console.error(err));
  }

  return (
    <>
      <form action="#" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }}>
        <section className="tableSection mt-4">
          <div className="card">
            <div className='card-header'>
              {plan.title}
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-lg-12">
                  <CKEditor4 value={content} onChange={(data) => setContent(data)} />
                </div>
              </div>
            </div>
            <div className='card-footer'>
              <button type="submit" className="btn btn-primary btn-sm">Save</button>
            </div>
          </div>
        </section>
      </form>
    </>
  )
}

export default PageEdit
