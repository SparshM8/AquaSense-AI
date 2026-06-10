import { useState, useEffect } from 'react'
import api from '../services/api'

export function useDashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetch = async () => {
    try {
      setLoading(true)

      const r = await api.get('/water/dashboard')

      console.log("DASHBOARD:", r.data)

      setData(r.data)
      setError(null)

    } catch (e) {
      console.error(e)
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetch()
  }, [])

  return {
    data,
    loading,
    error,
    refetch: fetch
  }
}

export function useRecords() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

const fetchRecords = async (params = {}) => {
  try {
    setLoading(true)

    const r = await api.get('/water', {
      params
    })

    setRecords(r.data?.records || [])
    setTotal(r.data?.total || 0)

  } catch (e) {
    console.error(e)
  } finally {
    setLoading(false)
  }
}

  const createRecord = async (data) => {
    await api.post('/water', data)
    fetchRecords()
  }

  const updateRecord = async (id, data) => {
    await api.put(`/water/${id}`, data)
    fetchRecords()
  }

  const deleteRecord = async (id) => {
    await api.delete(`/water/${id}`)
    fetchRecords()
  }

  useEffect(() => {
    fetchRecords()
  }, [])

  return {
    records,
    loading,
    total,
    fetchRecords,
    createRecord,
    updateRecord,
    deleteRecord
  }
}