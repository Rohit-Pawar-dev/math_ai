import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import API from '../../api';
import Swal from 'sweetalert2';

const EditUser = () => {
  const { id } = useParams();
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    status: '',
    profilePicture: '',
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null);

  useEffect(() => {
    API.get('/users/' + id)
      .then(res => {
        if (res.status === 200) {
          setForm(res.data);
        }
      })
      .catch(err => {
        Swal.fire('Something went wrong', err.message, 'error');
        console.error(err);
      });
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (newProfilePicture) {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('email', form.email);
        formData.append('mobile', form.mobile);
        formData.append('status', form.status);
        formData.append('profilePicture', newProfilePicture);

        response = await API.put(`/users/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
      } else {
        response = await API.put(`/users/${id}`, {
          name: form.name,
          email: form.email,
          mobile: form.mobile,
          status: form.status
        });
      }

      if (response.status === 200) {
        Swal.fire('Success', 'User updated successfully!', 'success');
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.error || err.message, 'error');
    }
  };

  return (
    <section className="tableSection">
      <div className="container-fliud">
        <h2>Edit User</h2>
        <div className="mainContent">
          <div className="card">
            <div className="card-body">
              <h6 className="mb-4">General Information</h6>
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Name</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Phone</label>
                      <input
                        type="text"
                        className="form-control"
                        value={form.mobile}
                        onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                        required
                        maxLength={10}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">User Image</label>
                      <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setNewProfilePicture(e.target.files[0])}
                      />
                      {form.profilePicture && (
                        <img
                          className="mt-2"
                          src={`../server/${form.profilePicture}`}
                          alt="Profile"
                          width="150px"
                        />
                      )}
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="form-group mb-4">
                      <label className="mb-2">Status</label>
                      <select
                        name="status"
                        className="form-control"
                        value={form.status}
                        onChange={(e) => setForm({ ...form, status: e.target.value })}
                        required
                      >
                        <option value="">-- Select --</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                  <div className="formSubmitDiv">
                    <button className="btn btn-outline-warning active" type="submit">
                      Update
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditUser;
