import { useState } from 'react'
import type { Customer } from '../types'

const KEYS = {
  name:         'tokma_customer_name',
  phone:        'tokma_customer_phone',
  address:      'tokma_customer_address',
  deliveryDate: 'tokma_customer_delivery_date',
} as const

function loadFromStorage(): Customer {
  return {
    name:         localStorage.getItem(KEYS.name)         ?? '',
    phone:        localStorage.getItem(KEYS.phone)        ?? '',
    address:      localStorage.getItem(KEYS.address)      ?? '',
    deliveryDate: localStorage.getItem(KEYS.deliveryDate) ?? '',
  }
}

function saveToStorage(customer: Customer): void {
  localStorage.setItem(KEYS.name,         customer.name)
  localStorage.setItem(KEYS.phone,        customer.phone)
  localStorage.setItem(KEYS.address,      customer.address)
  localStorage.setItem(KEYS.deliveryDate, customer.deliveryDate)
}

export function useCustomer() {
  const [customer, setCustomerState] = useState<Customer>(loadFromStorage)

  function setCustomer(updated: Customer): void {
    setCustomerState(updated)
    saveToStorage(updated)
  }

  function updateField(field: keyof Customer, value: string): void {
    const updated = { ...customer, [field]: value }
    setCustomer(updated)
  }

  const isValid =
    customer.name.trim() !== '' &&
    customer.phone.trim() !== '' &&
    customer.address.trim() !== '' &&
    customer.deliveryDate.trim() !== ''

  return { customer, setCustomer, updateField, isValid }
}
