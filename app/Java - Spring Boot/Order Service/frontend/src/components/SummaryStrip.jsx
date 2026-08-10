import React from 'react'

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export default function SummaryStrip({ summary, loading }) {
  const metrics = [
    { label: 'Total orders', value: summary.totalOrders },
    { label: 'Active orders', value: summary.activeOrders },
    { label: 'Total value', value: currency.format(summary.totalValue) },
    { label: 'Average value', value: currency.format(summary.averageValue) },
  ]

  return (
    <dl className="summary-strip" aria-label="Order summary" aria-busy={loading}>
      {metrics.map((metric) => (
        <div className="summary-metric" key={metric.label}>
          <dt>{metric.label}</dt>
          <dd>{loading ? <span className="metric-skeleton" aria-hidden="true" /> : metric.value}</dd>
        </div>
      ))}
    </dl>
  )
}