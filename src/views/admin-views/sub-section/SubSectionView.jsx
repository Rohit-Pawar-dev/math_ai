import React, { useEffect, useState } from 'react'
import { useParams, NavLink } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'

const SubsectionView = () => {
    const { id } = useParams()
    const [subsection, setSubsection] = useState(null)

    useEffect(() => {
        API.get(`/subsection/${id}`)
            .then(res => {
                if (res.data.status) setSubsection(res.data.data)
            })
            .catch(err => Swal.fire('Error', err.response?.data?.message || err.message, 'error'))
    }, [id])

    if (!subsection) return <p>Loading...</p>

    return (
        <div className="card">
            <div className="card-body">
                <h2>Subsection Details</h2>
                <p><strong>Title:</strong> {subsection.title}</p>
                <p><strong>Chapter:</strong> {subsection.chapterId?.title}</p>
                <p><strong>Topic:</strong> {subsection.topicId?.title}</p>
                <p><strong>Section:</strong> {subsection.sectionId?.title}</p>
                <p><strong>Content:</strong> {subsection.content}</p>
                <p><strong>Status:</strong> {subsection.status}</p>

                {/* <NavLink to={`/subsection-edit/${subsection._id}`} className="btn btn-warning">Edit</NavLink> */}
                <NavLink to="/subsection-list" className="btn btn-secondary ms-2">Back</NavLink>
            </div>
        </div>
    )
}

export default SubsectionView
