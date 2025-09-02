import React, { useState, useEffect } from 'react'
import API from '../../../api'
import Swal from 'sweetalert2'
import defaultImage from '../../../assets/images/default.png'
import { useNavigate } from 'react-router-dom'

const UserRegister = () => {
    const [form, setForm] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
        confirmPassword: '',
        classStandard: '',
    })

    const navigate = useNavigate()
    const [profilePicture, setProfilePicture] = useState(null)
    const [passwordError, setPasswordError] = useState('')
    const [classes, setClasses] = useState([])

    useEffect(() => {
        const fetchClasses = async () => {
            try {
                const response = await API.get('/classes')
                if (response.data?.status) {
                    setClasses(response.data.data)
                }
            } catch (error) {
                console.error('Error fetching classes:', error)
            }
        }

        fetchClasses()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if (form.password !== form.confirmPassword) {
            setPasswordError('Passwords do not match.')
            return
        }

        setPasswordError('')

        try {
            const formData = new FormData()
            formData.append('name', form.name)
            formData.append('email', form.email)
            formData.append('mobile', form.mobile)
            formData.append('password', form.password)
            formData.append('classStandard', form.classStandard)

            if (profilePicture) {
                formData.append('profilePicture', profilePicture)
            }

            const response = await API.post('/users', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            if (response.status === 201) {
                Swal.fire('Success', 'Registration successful! Please login.', 'success')

                setForm({
                    name: '',
                    email: '',
                    mobile: '',
                    password: '',
                    confirmPassword: '',
                    classStandard: '',
                })

                setProfilePicture(null)
                navigate('/login')
            }
        } catch (err) {
            const errorMsg = err.response?.data?.message || err.response?.data?.error || err.message
            Swal.fire('Error', errorMsg, 'error')
        }
    }

    return (
        <section className="registerSection py-3">
            <div className="container">
                <h2 className="text-center mb-4">User Registration</h2>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="card shadow-lg border-0 rounded-3">
                            <div className="card-body p-4">
                                <form onSubmit={handleSubmit}>
                                    <div className="row g-3">
                                        {/* Name */}
                                        <div className="col-md-6">
                                            <label className="form-label">Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={form.name}
                                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="col-md-6">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                value={form.email}
                                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                                required
                                            />
                                        </div>

                                        {/* Phone */}
                                        <div className="col-md-6">
                                            <label className="form-label">Phone</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={form.mobile}
                                                onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                                                maxLength={10}
                                                required
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="col-md-6">
                                            <label className="form-label">Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={form.password}
                                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                                required
                                            />
                                        </div>

                                        {/* Confirm Password */}
                                        <div className="col-md-6">
                                            <label className="form-label">Confirm Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={form.confirmPassword}
                                                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                                required
                                            />
                                            {passwordError && (
                                                <small className="text-danger">{passwordError}</small>
                                            )}
                                        </div>

                                        {/* Profile Picture */}
                                        <div className="col-md-6">
                                            <label className="form-label">Profile Picture</label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                accept="image/*"
                                                onChange={(e) => setProfilePicture(e.target.files[0])}
                                            />
                                            <div className="mt-2">
                                                <img
                                                    src={
                                                        profilePicture
                                                            ? URL.createObjectURL(profilePicture)
                                                            : defaultImage
                                                    }
                                                    alt="Preview"
                                                    className="rounded-circle border"
                                                    width={100}
                                                    height={100}
                                                />
                                            </div>
                                        </div>

                                        {/* Class */}
                                        <div className="col-md-6">
                                            <label className="form-label">Class</label>
                                            <select
                                                className="form-select"
                                                value={form.classStandard}
                                                onChange={(e) =>
                                                    setForm({ ...form, classStandard: e.target.value })
                                                }
                                                required
                                            >
                                                <option value="">Select a class</option>
                                                {classes.map((cls) => (
                                                    <option key={cls._id} value={cls._id}>
                                                        {cls.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Submit Button */}
                                        <div className="col-12 text-center mt-3">
                                            <button type="submit" className="btn btn-primary px-5">
                                                Register
                                            </button>
                                        </div>
                                    </div>
                                </form>

                                {/* Login Link */}
                                <p className="text-center mt-4">
                                    Already have an account?{" "}
                                    <span
                                        style={{ cursor: "pointer", color: "blue" }}
                                        onClick={() => navigate("/login")}
                                    >
                                        Login here
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default UserRegister
