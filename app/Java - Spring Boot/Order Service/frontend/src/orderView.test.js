import test from 'node:test'
import assert from 'node:assert/strict'

import { getOrderSummary, getVisibleOrders } from './orderView.js'

const orders = [
  {
    id: 1,
    customer: 'Alice',
    amount: 120.5,
    status: 'PENDING',
    createdAt: '2026-08-01T10:00:00.000Z',
  },
  {
    id: 2,
    customer: 'Bob',
    amount: 42.99,
    status: 'COMPLETED',
    createdAt: '2026-08-03T10:00:00.000Z',
  },
  {
    id: 3,
    customer: 'alice cooper',
    amount: 80,
    status: 'PROCESSING',
    createdAt: '2026-08-02T10:00:00.000Z',
  },
]

test('search matches customers case-insensitively and IDs exactly', () => {
  assert.deepEqual(
    getVisibleOrders(orders, { search: 'ALI', status: 'ALL', sort: 'newest' }).map(
      (order) => order.id,
    ),
    [3, 1],
  )
  assert.deepEqual(
    getVisibleOrders(orders, { search: '2', status: 'ALL', sort: 'newest' }).map(
      (order) => order.id,
    ),
    [2],
  )
})

test('status filtering and each sort mode can be combined', () => {
  assert.deepEqual(
    getVisibleOrders(orders, { search: '', status: 'PENDING', sort: 'newest' }).map(
      (order) => order.id,
    ),
    [1],
  )
  assert.deepEqual(
    getVisibleOrders(orders, { search: '', status: 'ALL', sort: 'oldest' }).map(
      (order) => order.id,
    ),
    [1, 3, 2],
  )
  assert.deepEqual(
    getVisibleOrders(orders, { search: '', status: 'ALL', sort: 'amount-high' }).map(
      (order) => order.id,
    ),
    [1, 3, 2],
  )
  assert.deepEqual(
    getVisibleOrders(orders, { search: '', status: 'ALL', sort: 'amount-low' }).map(
      (order) => order.id,
    ),
    [2, 3, 1],
  )
})

test('summary reports totals over the loaded order list', () => {
  assert.deepEqual(getOrderSummary(orders), {
    totalOrders: 3,
    activeOrders: 2,
    totalValue: 243.49,
    averageValue: 81.16333333333334,
  })
  assert.deepEqual(getOrderSummary([]), {
    totalOrders: 0,
    activeOrders: 0,
    totalValue: 0,
    averageValue: 0,
  })
})

test('deriving visible orders does not mutate the loaded list', () => {
  const originalIds = orders.map((order) => order.id)

  getVisibleOrders(orders, { search: '', status: 'ALL', sort: 'oldest' })

  assert.deepEqual(orders.map((order) => order.id), originalIds)
})