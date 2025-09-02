import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../../api';
import Swal from 'sweetalert2';

export default function QuizAdd() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [amount, setAmount] = useState('0');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      Swal.fire('Error', 'Both title and description are required', 'error');
      return;
    }

    if (isPaid && (!amount || isNaN(amount) || Number(amount) < 0)) {
      Swal.fire('Error', 'Please enter a valid amount for paid quizzes', 'error');
      return;
    }

    try {
      setLoading(true);

      const payload = {
        title,
        description,
        is_paid: isPaid,
        amount: isPaid ? amount : '0',
        status,
      };

      const res = await API.post('/quizzes', payload);

      if (res.data.status) {
        Swal.fire('Success', 'Quiz added successfully!', 'success').then(() => {
          navigate('/admin/quiz-list'); 
        });
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="formSection">
      <div className="card">
        <div className="card-body">
          <h2>Add New Quiz</h2>
          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter quiz title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Enter quiz description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
              ></textarea>
            </div>

            {/* Paid Quiz Toggle */}
            <div className="mb-3 form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id="isPaid"
                checked={isPaid}
                onChange={(e) => setIsPaid(e.target.checked)}
              />
              <label className="form-check-label" htmlFor="isPaid">
                Paid Quiz
              </label>
            </div>

            {isPaid && (
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  required={isPaid}
                />
              </div>
            )}

            {/* Status */}
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Submit */}
            <button type="submit" className="btn btn-warning" disabled={loading}>
              {loading ? 'Saving...' : 'Add Quiz'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
