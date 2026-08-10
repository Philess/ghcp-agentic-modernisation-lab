const BASE = '/api/orders'

async function handle(res) {
  if (!res.ok) {
    let detail = ''
    try {
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        const body = await res.json()
        detail = body.message || body.error || ''
      } else {
        detail = await res.text()
      }
    } catch {
      detail = ''
    }
    throw new Error(detail || `Request failed (${res.status} ${res.statusText})`)
  }
  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : res.text()
}

export function getOrders() {
  return fetch(BASE).then(handle)
}

export function createOrder(order) {
  return fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  }).then(handle)
}

export function getCustomerTotal(customer) {
  return fetch(`${BASE}/customer/${encodeURIComponent(customer)}/total`).then(handle)
}

export function updateOrderStatus(id, status) {
  const nextStatus = encodeURIComponent(status)
  return fetch(`${BASE}/${id}/status?status=${nextStatus}`, { method: 'PATCH' }).then(handle)
}
