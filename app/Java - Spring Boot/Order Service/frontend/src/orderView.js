const ACTIVE_STATUSES = new Set(['PENDING', 'PROCESSING'])

function timestamp(value) {
  const parsed = Date.parse(value)
  return Number.isNaN(parsed) ? 0 : parsed
}

const sorters = {
  newest: (left, right) => timestamp(right.createdAt) - timestamp(left.createdAt),
  oldest: (left, right) => timestamp(left.createdAt) - timestamp(right.createdAt),
  'amount-high': (left, right) => Number(right.amount) - Number(left.amount),
  'amount-low': (left, right) => Number(left.amount) - Number(right.amount),
}

export function getVisibleOrders(orders, { search = '', status = 'ALL', sort = 'newest' }) {
  const query = search.trim().toLowerCase()
  const compare = sorters[sort] || sorters.newest

  return orders
    .filter((order) => {
      const matchesSearch =
        !query ||
        String(order.customer || '').toLowerCase().includes(query) ||
        String(order.id) === query
      const matchesStatus = status === 'ALL' || order.status === status
      return matchesSearch && matchesStatus
    })
    .sort(compare)
}

export function getOrderSummary(orders) {
  const totalValue = orders.reduce((total, order) => total + Number(order.amount || 0), 0)

  return {
    totalOrders: orders.length,
    activeOrders: orders.filter((order) => ACTIVE_STATUSES.has(order.status)).length,
    totalValue,
    averageValue: orders.length ? totalValue / orders.length : 0,
  }
}