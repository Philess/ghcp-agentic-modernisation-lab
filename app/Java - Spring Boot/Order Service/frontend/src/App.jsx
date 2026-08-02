import { useEffect, useState } from 'react'
import { getOrders, createOrder, getCustomerTotal } from './api.js'

function formatAmount(value) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
}

function formatDate(value) {
  if (!value) return '-'
  try {
    return new Date(value).toLocaleString()
  } catch {
    return String(value)
  }
}

export default function App() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [customer, setCustomer] = useState('')
  const [amount, setAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [totalCustomer, setTotalCustomer] = useState('alice')
  const [total, setTotal] = useState(null)

  async function refresh() {
    setLoading(true)
    setError(null)
    try {
      setOrders(await getOrders())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreate(event) {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      await createOrder({ customer: customer.trim(), amount: Number(amount) })
      setCustomer('')
      setAmount('')
      await refresh()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleTotal(event) {
    event.preventDefault()
    setError(null)
    try {
      const value = await getCustomerTotal(totalCustomer.trim())
      setTotal(value)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="page">
      <header className="header">
        <h1>Order Service Console</h1>
        <p className="subtitle">
          React UI &rarr; Spring Boot REST API. The backend can be modernized underneath without
          changing this app.
        </p>
      </header>

      {error && <div className="banner error">{error}</div>}

      <section className="card">
        <div className="card-head">
          <h2>Orders</h2>
          <button className="ghost" onClick={refresh} disabled={loading}>
            {loading ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && !loading ? (
              <tr>
                <td colSpan="4" className="muted">No orders yet.</td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr key={o.id}>
                  <td>{o.id}</td>
                  <td>{o.customer}</td>
                  <td>{formatAmount(o.amount)}</td>
                  <td>{formatDate(o.createdAt)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      <div className="grid">
        <section className="card">
          <h2>Create order</h2>
          <form onSubmit={handleCreate} className="form">
            <label>
              Customer
              <input
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                placeholder="e.g. alice"
                required
              />
            </label>
            <label>
              Amount
              <input
                type="number"
                step="0.01"
                min="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 99.99"
                required
              />
            </label>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Saving…' : 'Add order'}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>Customer total</h2>
          <form onSubmit={handleTotal} className="form">
            <label>
              Customer
              <input
                value={totalCustomer}
                onChange={(e) => setTotalCustomer(e.target.value)}
                placeholder="e.g. alice"
                required
              />
            </label>
            <button type="submit">Get total</button>
          </form>
          {total !== null && (
            <p className="total">
              Total for <strong>{totalCustomer}</strong>: {formatAmount(total)}
            </p>
          )}
        </section>
      </div>
    </div>
  )
}
