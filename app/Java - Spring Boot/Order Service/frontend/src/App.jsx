import React, { useEffect, useState } from 'react'
import { createOrder, getCustomerTotal, getOrders, updateOrderStatus } from './api.js'
import CreateOrderDialog from './components/CreateOrderDialog.jsx'
import OrderTable from './components/OrderTable.jsx'
import SummaryStrip from './components/SummaryStrip.jsx'
import { getOrderSummary, getVisibleOrders } from './orderView.js'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function App() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [lastUpdated, setLastUpdated] = useState(null)
  const [activity, setActivity] = useState({ type: 'neutral', message: '' })

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL')
  const [sort, setSort] = useState('newest')

  const [createOpen, setCreateOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [updatingId, setUpdatingId] = useState(null)

  const [totalCustomer, setTotalCustomer] = useState('alice')
  const [totalResult, setTotalResult] = useState(null)
  const [totalLoading, setTotalLoading] = useState(false)
  const [totalError, setTotalError] = useState('')

  async function refresh({ announce = false } = {}) {
    setLoadError('')
    if (!orders.length) setLoading(true)
    try {
      setOrders(await getOrders())
      setLastUpdated(new Date())
      if (announce) setActivity({ type: 'success', message: 'Orders refreshed.' })
    } catch (err) {
      setLoadError(err.message)
      setActivity({ type: 'error', message: `Refresh failed: ${err.message}` })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
  }, [])

  async function handleCreate(order) {
    setSubmitting(true)
    try {
      const saved = await createOrder(order)
      setOrders((current) => [...current, saved])
      setLastUpdated(new Date())
      setActivity({ type: 'success', message: `Order #${saved.id} created for ${saved.customer}.` })
    } catch (err) {
      setActivity({ type: 'error', message: `Order could not be created: ${err.message}` })
      throw err
    } finally {
      setSubmitting(false)
    }
  }

  async function handleStatusChange(order, nextStatus) {
    setUpdatingId(order.id)
    try {
      const updated = await updateOrderStatus(order.id, nextStatus)
      setOrders((current) => current.map((item) => (item.id === updated.id ? updated : item)))
      setLastUpdated(new Date())
      setActivity({
        type: 'success',
        message: `Order #${order.id} moved to ${nextStatus.toLowerCase()}.`,
      })
    } catch (err) {
      setActivity({ type: 'error', message: `Status update failed: ${err.message}` })
    } finally {
      setUpdatingId(null)
    }
  }

  async function handleTotal(event) {
    event.preventDefault()
    const customer = totalCustomer.trim()
    if (!customer) {
      setTotalError('Enter a customer name.')
      return
    }

    setTotalLoading(true)
    setTotalError('')
    try {
      const value = await getCustomerTotal(customer)
      setTotalResult({ customer, value })
    } catch (err) {
      setTotalError(err.message)
    } finally {
      setTotalLoading(false)
    }
  }

  const visibleOrders = getVisibleOrders(orders, { search, status, sort })
  const summary = getOrderSummary(orders)
  const filtersActive = search || status !== 'ALL' || sort !== 'newest'

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">CO</span>
            <div>
              <p>Contoso operations</p>
              <h1>Order workspace</h1>
            </div>
          </div>
          <div className="header-actions">
            <button className="button-secondary" type="button" disabled={loading} onClick={() => refresh({ announce: true })}>
              {loading ? 'Refreshing...' : 'Refresh'}
            </button>
            <button className="button-primary" type="button" onClick={() => setCreateOpen(true)}>
              New order
            </button>
          </div>
        </div>
      </header>

      <main className="workspace-main">
        <section className="workspace-heading" aria-labelledby="overview-heading">
          <div>
            <p>Order operations</p>
            <h2 id="overview-heading">Orders at a glance</h2>
          </div>
          <div className={`sync-state ${loadError ? 'sync-error' : ''}`}>
            <span aria-hidden="true" />
            {loadError
              ? 'Connection issue'
              : lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                : 'Connecting'}
          </div>
        </section>

        <div className={`activity-line activity-${activity.type}`} role="status" aria-live="polite">
          {activity.message}
        </div>

        <SummaryStrip summary={summary} loading={loading} />

        <div className="workspace-grid">
          <div className="orders-column">
            <section className="filter-bar" aria-label="Order filters">
              <label className="field search-field" htmlFor="order-search">
                <span>Search</span>
                <input
                  id="order-search"
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Customer or order ID"
                />
              </label>
              <label className="field" htmlFor="status-filter">
                <span>Status</span>
                <select id="status-filter" value={status} onChange={(event) => setStatus(event.target.value)}>
                  <option value="ALL">All statuses</option>
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="COMPLETED">Completed</option>
                </select>
              </label>
              <label className="field" htmlFor="sort-orders">
                <span>Sort by</span>
                <select id="sort-orders" value={sort} onChange={(event) => setSort(event.target.value)}>
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="amount-high">Amount: high to low</option>
                  <option value="amount-low">Amount: low to high</option>
                </select>
              </label>
              <button
                className="clear-button"
                type="button"
                disabled={!filtersActive}
                onClick={() => {
                  setSearch('')
                  setStatus('ALL')
                  setSort('newest')
                }}
              >
                Clear
              </button>
            </section>

            <OrderTable
              orders={visibleOrders}
              totalCount={orders.length}
              loading={loading}
              loadError={loadError}
              updatingId={updatingId}
              onRetry={refresh}
              onStatusChange={handleStatusChange}
            />
          </div>

          <aside className="side-rail">
            <section className="lookup-panel" aria-labelledby="customer-total-heading">
              <header>
                <p>Customer lookup</p>
                <h2 id="customer-total-heading">Order total</h2>
              </header>
              <form className="lookup-form" noValidate onSubmit={handleTotal}>
                <label className="field" htmlFor="total-customer">
                  <span>Customer</span>
                  <input
                    id="total-customer"
                    value={totalCustomer}
                    aria-invalid={Boolean(totalError)}
                    aria-describedby={totalError ? 'total-error' : undefined}
                    onChange={(event) => setTotalCustomer(event.target.value)}
                    placeholder="e.g. alice"
                  />
                </label>
                {totalError && <small id="total-error" className="field-error">{totalError}</small>}
                <button className="button-secondary" type="submit" disabled={totalLoading}>
                  {totalLoading ? 'Calculating...' : 'Calculate total'}
                </button>
              </form>
              {totalResult && (
                <div className="total-result" aria-live="polite">
                  <span>{totalResult.customer}</span>
                  <strong>{currency.format(totalResult.value)}</strong>
                </div>
              )}
            </section>
          </aside>
        </div>
      </main>

      <CreateOrderDialog
        open={createOpen}
        submitting={submitting}
        onClose={() => setCreateOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  )
}
