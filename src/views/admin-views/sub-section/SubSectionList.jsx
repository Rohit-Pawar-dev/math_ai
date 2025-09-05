import React, { useEffect, useState, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import CIcon from '@coreui/icons-react'
import { cilPencil, cilTrash } from '@coreui/icons'
import API from '../../../api'
import Swal from 'sweetalert2'
import eyeIcon from '../../../assets/images/eyeIcon.svg'

const SubsectionList = () => {
    const [subsections, setSubsections] = useState([])
    const [search, setSearch] = useState('')
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const limit = 10

    // Fetch subsections
    const fetchSubsections = async (pageNo = 1, searchText = '') => {
        try {
            const offset = (pageNo - 1) * limit
            const res = await API.get(`/subsection?limit=${limit}&offset=${offset}&search=${searchText}`)
            if (res.data.status) {
                setSubsections(res.data.data)
                setTotalPages(res.data.totalPages)
            }
        } catch (err) {
            Swal.fire('Error', err.response?.data?.message || err.message, 'error')
        }
    }

    // Debounce helper
    const debounce = (func, delay) => {
        let timer
        return (...args) => {
            clearTimeout(timer)
            timer = setTimeout(() => func.apply(this, args), delay)
        }
    }

    const debouncedSearch = useCallback(
        debounce((searchText) => {
            setPage(1)
            fetchSubsections(1, searchText)
        }, 500),
        []
    )

    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearch(value)
        debouncedSearch(value)
    }

    useEffect(() => {
        fetchSubsections(page, search)
    }, [page])

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: 'This subsection will be deleted permanently!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
        }).then((result) => {
            if (result.isConfirmed) {
                API.delete(`/subsection/${id}`)
                    .then(() => {
                        Swal.fire('Deleted!', 'Subsection deleted successfully.', 'success')
                        setSubsections(prev => prev.filter(s => s._id !== id))
                    })
                    .catch(() => Swal.fire('Error', 'Failed to delete subsection', 'error'))
            }
        })
    }

    return (
        <section className="tableSection">
            <div className="card">
                <div className="card-body">
                    <div className="searchFeald">
                        <div className="searchBox">
                            <input
                                type="text"
                                placeholder="Search subsections..."
                                value={search}
                                onChange={handleSearchChange}
                            />
                        </div>
                        <div className="searchBtn">
                            <NavLink to="/admin/subsection-add">
                                <button className="btn btn-outline-warning active" type="button">
                                    Add Subsection
                                </button>
                            </NavLink>
                        </div>
                    </div>

                    <h2>All Subsections</h2>
                    <div className="mainContent">
                        <table>
                            <thead>
                                <tr>
                                    <th>SL</th>
                                    <th>Title</th>
                                    <th>Chapter</th>
                                    <th>Topic</th>
                                    <th>Section</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {subsections.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: 'center' }}>
                                            No subsections found
                                        </td>
                                    </tr>
                                ) : (
                                    subsections.map((sub, index) => (
                                        <tr key={sub._id}>
                                            <td>{(page - 1) * limit + (index + 1)}</td>
                                            <td>{sub.title}</td>
                                            <td>{sub.chapterId?.title}</td>
                                            <td>{sub.topicId?.title}</td>
                                            <td>{sub.sectionId?.title}</td>
                                            <td>
                                                <div className="actionTable">
                                                    <NavLink to={`/admin/subsection-view/${sub._id}`}>
                                                        <img src={eyeIcon} className="eyeIconClass" alt="view" />
                                                    </NavLink>
                                                    <NavLink to={`/admin/subsection-edit/${sub._id}`}>
                                                        <CIcon icon={cilPencil} custom="true" className="nav-icon" />
                                                    </NavLink>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(sub._id)}
                                                        title="Delete Subsection"
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

                        {/* Pagination */}
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
        </section>
    )
}

export default SubsectionList
