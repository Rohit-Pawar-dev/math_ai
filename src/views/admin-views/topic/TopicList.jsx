import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const TopicList = () => {
    const [topics, setTopics] = useState([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10

    // Debounce timer
    const [debounceTimer, setDebounceTimer] = useState(null)

    const fetchTopics = async (pageNo = 1, searchText = '') => {
        try {
            const offset = (pageNo - 1) * limit
            const res = await API.get(`/topic?limit=${limit}&offset=${offset}&search=${searchText}`)
            if (res.data.status) {
                setTopics(res.data.data)
                setTotalPages(res.data.totalPages)
            }
        } catch (err) {
            console.error(err)
            Swal.fire('Error', err.response?.data?.message || err.message, 'error')
        }
    }

    // Fetch topics on page change
    useEffect(() => {
        fetchTopics(page, search)
    }, [page])

    // Fetch topics on search change with debounce
    useEffect(() => {
        if (debounceTimer) clearTimeout(debounceTimer)
        const timer = setTimeout(() => {
            setPage(1) // Reset to first page on search
            fetchTopics(1, search)
        }, 500) // Wait 500ms after last keypress
        setDebounceTimer(timer)

        return () => clearTimeout(timer)
    }, [search])

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                API.delete(`/topic/${id}`)
                    .then(() => {
                        Swal.fire('Deleted!', 'The topic has been deleted.', 'success')
                        setTopics((prev) => prev.filter((t) => t._id !== id))
                    })
                    .catch(() => {
                        Swal.fire('Error', 'Failed to delete the topic', 'error')
                    })
            }
        })
    }

    const handleStatusToggle = async (topic) => {
        const updatedStatus = topic.status === 'active' ? 'inactive' : 'active'
        try {
            const response = await API.put(`/topic/${topic._id}`, { ...topic, status: updatedStatus })
            if (response.status === 200) {
                Swal.fire('Success', 'Topic status updated successfully!', 'success')
                setTopics((prev) =>
                    prev.map((t) => (t._id === topic._id ? { ...t, status: updatedStatus } : t)),
                )
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.error || err.message, 'error')
        }
    }

    return (
        <section className="tableSection">
            <div className="card">
                <div className="card-body">
                    <div className="searchFeald">
                        <div className="searchBox">
                            <input
                                type="text"
                                placeholder="Search by title"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="searchBtn">
                            <NavLink to={'/topic-add'}>
                                <button className="btn btn-outline-warning active" type="button">
                                    Add Topic
                                </button>
                            </NavLink>
                        </div>
                    </div>

                    <div className="container-fliud">
                        <h2>All Topics</h2>
                        <div className="mainContent">
                            <table>
                                <thead>
                                    <tr>
                                        <th>SL</th>
                                        <th>Title</th>
                                        <th>Chapter</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {topics.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} style={{ textAlign: 'center' }}>
                                                No topics found
                                            </td>
                                        </tr>
                                    ) : (
                                        topics.map((topic, index) => (
                                            <tr key={topic._id}>
                                                <td>{(page - 1) * limit + (index + 1)}</td>
                                                <td>{topic.title}</td>
                                                <td>{topic.chapterId?.title || '-'}</td>
                                                <td>
                                                    <label className="switch">
                                                        <input
                                                            type="checkbox"
                                                            onChange={() => handleStatusToggle(topic)}
                                                            checked={topic.status === 'active'}
                                                        />
                                                        <span className="slider"></span>
                                                    </label>
                                                </td>
                                                <td>
                                                    <div className="actionTable">
                                                        <NavLink to={`/topic-view/${topic._id}`}>
                                                            <img src={eyeIcon} className="eyeIconClass" alt="view" />
                                                        </NavLink>
                                                        <NavLink to={`/topic-edit/${topic._id}`}>
                                                            <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                                                        </NavLink>
                                                        <button
                                                            className="btn btn-sm btn-danger"
                                                            onClick={() => handleDelete(topic._id)}
                                                            title="Delete Topic"
                                                        >
                                                            <CIcon icon={cilTrash} custom="true" className="nav-icon" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>

                            <div className="paginationControls">
                                <button
                                    className="btn btn-outline-secondary"
                                    disabled={page === 1}
                                    onClick={() => setPage(page - 1)}
                                >
                                    Prev
                                </button>
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNumber = i + 1
                                    return (
                                        <button
                                            key={pageNumber}
                                            className={`btn ${page === pageNumber ? 'btn-warning' : 'btn-outline-secondary'}`}
                                            onClick={() => setPage(pageNumber)}
                                            style={{ margin: '0 5px' }}
                                        >
                                            {pageNumber}
                                        </button>
                                    )
                                })}
                                <button
                                    className="btn btn-outline-secondary"
                                    disabled={page === totalPages}
                                    onClick={() => setPage(page + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TopicList
