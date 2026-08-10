import React, { useEffect, useRef, useState } from 'react'

export default function CreateOrderDialog({ open, submitting, onClose, onSubmit }) {
  const dialogRef = useRef(null)
  const [customer, setCustomer] = useState('')
  const [amount, setAmount] = useState('')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (open && !dialog.open) {
      setCustomer('')
      setAmount('')
      setErrors({})
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
  }, [open])

  async function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = {}
    const customerName = customer.trim()
    const orderAmount = Number(amount)

    if (!customerName) nextErrors.customer = 'Enter a customer name.'
    if (!amount || !Number.isFinite(orderAmount) || orderAmount < 0.01) {
      nextErrors.amount = 'Enter an amount of at least $0.01.'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    try {
      await onSubmit({ customer: customerName, amount: orderAmount })
      onClose()
    } catch (error) {
      setErrors({ form: error.message })
    }
  }

  return (
    <dialog
      className="order-dialog"
      ref={dialogRef}
      aria-labelledby="create-order-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <form className="dialog-form" noValidate onSubmit={handleSubmit}>
        <header className="dialog-heading">
          <p>New record</p>
          <h2 id="create-order-title">Create order</h2>
        </header>

        {errors.form && <div className="inline-error" role="alert">{errors.form}</div>}

        <label className="field" htmlFor="order-customer">
          <span>Customer</span>
          <input
            id="order-customer"
            autoFocus
            value={customer}
            aria-invalid={Boolean(errors.customer)}
            aria-describedby={errors.customer ? 'customer-error' : undefined}
            onChange={(event) => setCustomer(event.target.value)}
            placeholder="e.g. alice"
          />
          {errors.customer && <small id="customer-error">{errors.customer}</small>}
        </label>

        <label className="field" htmlFor="order-amount">
          <span>Amount</span>
          <div className="amount-input">
            <span aria-hidden="true">$</span>
            <input
              id="order-amount"
              type="number"
              step="0.01"
              min="0.01"
              value={amount}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
            />
          </div>
          {errors.amount && <small id="amount-error">{errors.amount}</small>}
        </label>

        <footer className="dialog-actions">
          <button className="button-secondary" type="button" disabled={submitting} onClick={onClose}>
            Cancel
          </button>
          <button className="button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create order'}
          </button>
        </footer>
      </form>
    </dialog>
  )
}