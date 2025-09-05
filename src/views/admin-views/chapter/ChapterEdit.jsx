import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'
import MEDIA_URL from '../../../media'

const EditChapter = () => {
    const navigate = useNavigate()
    const { id } = useParams()

    const [formData, setFormData] = useState({
        title: '',
        status: 'active',
        icon: null,
    })
    const [preview, setPreview] = useState(defaultImage)

    useEffect(() => {
        const fetchChapter = async () => {
            try {
                const res = await API.get(`/chapter/${id}`)
                if (res.data.status) {
                    const data = res.data.data
                    setFormData({
                        title: data.title,
                        status: data.status,
                        icon: null,
                    })
                    setPreview(
                        data.icon ? `${MEDIA_URL}/${data.icon}` : defaultImage
                    )
                }
            } catch (err) {
                Swal.fire('Error', err.response?.data?.message || err.message, 'error')
            }
        }
        fetchChapter()
    }, [id])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setFormData({ ...formData, icon: file })
            setPreview(URL.createObjectURL(file))
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formDataToSend = new FormData()
            formDataToSend.append('title', formData.title)
            formDataToSend.append('status', formData.status)

            if (formData.icon) {
                formDataToSend.append('icon', formData.icon)
            }

            const res = await API.put(`/chapter/${id}`, formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            if (res.data.status) {
                Swal.fire('Updated!', 'Chapter updated successfully', 'success')
                navigate('/admin/chapter-list')
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || err.message, 'error')
        }
    }

    return (
        <section className="formSection">
            <div className="card">
                <div className="card-body">
                    <h2>Edit Chapter</h2>
                    <form onSubmit={handleSubmit}>

                        {/* Title */}
                        <div className="mb-3">
                            <label className="form-label">Title</label>
                            <input
                                type="text"
                                className="form-control"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Icon Upload */}
                        <div className="mb-3">
                            <label className="form-label">Icon</label>
                            <input
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleImageChange}
                            />
                            <div style={{ marginTop: '10px' }}>
                                <img src={preview} alt="Preview" width="100px" />
                            </div>
                        </div>

                        {/* Status */}
                        <div className="mb-3">
                            <label className="form-label">Status</label>
                            <select
                                className="form-select"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                            >
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                        </div>

                        {/* Submit */}
                        <button type="submit" className="btn btn-warning">
                            Update Chapter
                        </button>
                    </form>
                </div>
            </div>
        </section>
    )
}

export default EditChapter
