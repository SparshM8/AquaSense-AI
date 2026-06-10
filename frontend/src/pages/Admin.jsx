import { useState, useEffect } from 'react'
import api from '../services/api'

export default function Admin() {
  const [users, setUsers] = useState([])
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([api.get('/admin/users'), api.get('/admin/analytics')])
      .then(([u, a]) => { setUsers(u.data); setAnalytics(a.data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-5">
      {loading ? <div className="text-gray-400 text-sm">Loading admin data...</div> : (
        <>
          <div className="grid grid-cols-4 gap-4">
            {[['👥 Total Users', analytics?.totalUsers||0],
              ['📋 Total Records', analytics?.totalRecords||0],
              ['💧 Water Saved', `${((analytics?.totalLiters||0)*0.1).toFixed(0)} L`],
              ['🚨 Leakage Reports', analytics?.totalAlerts||0]].map(([l,v]) => (
              <div key={l} className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="text-xs text-gray-500 mb-1">{l}</div>
                <div className="text-2xl font-semibold text-gray-900">{typeof v === 'number' ? v.toLocaleString() : v}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 text-sm font-medium text-gray-700">All Users</div>
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>{['Name','Email','Role','Joined','Status'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {users.map(u => (
                  <tr key={u._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{u.name}</td>
                    <td className="px-4 py-3 text-gray-600">{u.email}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${u.role==='admin'?'bg-purple-50 text-purple-700':'bg-gray-100 text-gray-600'}`}>{u.role}</span></td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-md text-xs font-medium">Active</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
