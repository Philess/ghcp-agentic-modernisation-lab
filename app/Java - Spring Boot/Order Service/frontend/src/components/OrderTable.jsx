import React from 'react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

const dateTime = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
})

const statuses = ['PENDING', 'PROCESSING', 'COMPLETED']

function formatStatus(status) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

function StatusBadge({ status }) {
  return (
    <span className={`status-badge status-${status.toLowerCase()}`}>
      <span className="status-dot" aria-hidden="true" />
      {formatStatus(status)}
    </span>
  )
}

export default function OrderTable({
  orders,
  totalCount,
  loading,
  loadError,
  updatingId,
  onRetry,
  onStatusChange,
}) {
  let tableBody

  if (loading) {
    tableBody = Array.from({ length: 4 }, (_, index) => (
      <tr className="skeleton-row" key={index} aria-hidden="true">
        <td><span /></td>
        <td><span /></td>
        <td><span /></td>
        <td><span /></td>
        <td><span /></td>
      </tr>
    ))
  } else if (loadError && totalCount === 0) {
    tableBody = (
      <tr>
        <td className="table-message" colSpan="5">
          <strong>Orders could not be loaded.</strong>
          <span>{loadError}</span>
          <button className="text-button" type="button" onClick={onRetry}>Try again</button>
        </td>
      </tr>
    )
  } else if (orders.length === 0) {
    tableBody = (
      <tr>
        <td className="table-message" colSpan="5">
          <strong>{totalCount === 0 ? 'No orders yet.' : 'No matching orders.'}</strong>
          <span>
            {totalCount === 0
              ? 'Create the first order to get started.'
              : 'Adjust or clear the current filters.'}
          </span>
        </td>
      </tr>
    )
  } else {
    tableBody = orders.map((order) => {
      const updating = updatingId === order.id
      return (
        <tr key={order.id}>
          <td className="order-id">#{order.id}</td>
          <td><strong className="customer-name">{order.customer}</strong></td>
          <td className="date-cell">{dateTime.format(new Date(order.createdAt))}</td>
          <td className="amount-cell">{currency.format(order.amount)}</td>
          <td>
            <div className="status-cell" aria-busy={updating}>
              <StatusBadge status={order.status} />
              <label className="sr-only" htmlFor={`status-${order.id}`}>
                Status for order {order.id}
              </label>
              <select
                id={`status-${order.id}`}
                className="row-status-select"
                value={order.status}
                disabled={updating}
                onChange={(event) => onStatusChange(order, event.target.value)}
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>{formatStatus(status)}</option>
                ))}
              </select>
            </div>
          </td>
        </tr>
      )
    })
  }

  return (
    <section className="orders-panel" aria-labelledby="orders-heading">
      <div className="panel-heading">
        <div>
          <h2 id="orders-heading">Orders</h2>
          <p>{loading ? 'Loading records...' : `${orders.length} of ${totalCount} shown`}</p>
        </div>
      </div>
      <div className="table-frame">
        <table className="orders-table">
          <thead>
            <tr>
              <th scope="col">Order</th>
              <th scope="col">Customer</th>
              <th scope="col">Created</th>
              <th scope="col">Amount</th>
              <th scope="col">Status</th>
            </tr>
          </thead>
          <tbody>{tableBody}</tbody>
        </table>
      </div>
    </section>
  )
}