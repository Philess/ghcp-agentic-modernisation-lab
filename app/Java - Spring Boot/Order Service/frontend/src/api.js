const BASE = '/api/orders'

async function handle(res) {
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`${res.status} ${res.statusText}${text ? ` - ${text}` : ''}`)
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
