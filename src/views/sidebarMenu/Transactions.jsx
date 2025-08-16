import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const dummyTransactions = [
  {
    transaction_id: 'TXN123456',
    user_name: 'John Doe',
    coin: 50,
    type: 'credit',
    date: '2025-05-20',
    message: 'Reward for completing profile'
  },
  {
    transaction_id: 'TXN123457',
    user_name: 'Jane Smith',
    coin: 30,
    type: 'debit',
    date: '2025-05-21',
    message: 'Coins redeemed for discount'
  },
  {
    transaction_id: 'TXN123458',
    user_name: 'Michael Johnson',
    coin: 100,
    type: 'credit',
    date: '2025-05-22',
    message: 'Referral bonus'
  }
]

const Transactions = () => {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => {
      setTransactions(dummyTransactions)
      setLoading(false)
    }, 500)
  }, [])

  if (loading) return <div className="p-4">Loading...</div>
  if (!transactions.length) return <div className="p-4">No transactions found.</div>

  return (
    <section className="tableSection">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5>Transaction List</h5>
          <button className="btn btn-warning" onClick={() => navigate(-1)}>Back</button>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Transaction ID</th>
                  <th>User Name</th>
                  <th>Benifit</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Message</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{txn.transaction_id}</td>
                    <td>{txn.user_name}</td>
                    <td>{txn.coin} coins</td>
                    <td className={txn.type === 'credit' ? 'text-success' : 'text-danger'}>
                      {txn.type.charAt(0).toUpperCase() + txn.type.slice(1)}
                    </td>
                    <td>{txn.date}</td>
                    <td>{txn.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Transactions
