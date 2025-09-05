import React, { useEffect, useState } from 'react'
import API from '../../api'
import Swal from 'sweetalert2'

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  const limit = 10

  const fetchTransactions = async (pageNo = 1, searchText = '') => {
    try {
      const offset = (pageNo - 1) * limit
      const res = await API.get(
        `/transactions?limit=${limit}&offset=${offset}&search=${searchText}`,
      )
      if (res.data.status) {
        setTransactions(res.data.data)
        setTotalPages(res.data.totalPages)
      }
    } catch (err) {
      Swal.fire('Error', err.response?.data?.message || err.message, 'error')
    }
  }

  useEffect(() => {
    fetchTransactions(page, search)
  }, [page])

  const handleSearch = () => {
    setPage(1)
    fetchTransactions(1, search)
  }

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-body">
          {/* Search */}
          <div className="searchFeald">
            <div className="searchBox">
              <input
                type="text"
                placeholder="Search by transaction id or user name"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                className="btn btn-outline-warning active"
                type="button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="container-fliud">
            <h2>All Transactions</h2>
            <div className="mainContent table-responsive">
              <table>
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>User</th>
                    <th>Plan</th>
                    <th>Transaction ID</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center' }}>
                        No transactions found...
                      </td>
                    </tr>
                  ) : (
                    transactions.map((txn, index) => (
                      <tr key={txn._id}>
                        <td>{(page - 1) * limit + (index + 1)}</td>
                        <td>{txn.user?.name || 'N/A'}</td>
                        <td>{txn.plan?.title || 'N/A'}</td>
                        <td>{txn.transaction_id}</td>
                        <td>{txn.payment_method}</td>
                        <td>₹ {txn.amount}</td>
                        <td
                          className={
                            txn.status === 'success'
                              ? 'text-success'
                              : txn.status === 'failed'
                              ? 'text-danger'
                              : 'text-warning'
                          }
                        >
                          {txn.status}
                        </td>
                        <td>{new Date(txn.date).toLocaleDateString()}</td>
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
                      className={`btn ${
                        page === pageNumber ? 'btn-warning' : 'btn-outline-secondary'
                      }`}
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

export default Transactions
