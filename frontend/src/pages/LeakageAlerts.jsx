import { useState, useEffect } from 'react'
import api from '../services/api'

const sevStyle = { high: 'bg-red-50 text-red-700', medium: 'bg-yellow-50 text-yellow-700', low: 'bg-green-50 text-green-700' }

export default function LeakageAlerts() {
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/ai/anomaly')
      .then(r => setResult(r.data))
      .catch(() => setResult({ anomalies: [], anomalyCount: 0, totalAnalyzed: 0 }))
      .finally(() => setLoading(false))
  }, [])

  const stats = result ? [
    { label: 'High Risk', value: result.anomalies?.filter(a=>a.severity==='high').length||0, color: 'border-l-red-500 text-red-600' },
    { label: 'Medium Risk', value: result.anomalies?.filter(a=>a.severity==='medium').length||0, color: 'border-l-yellow-500 text-yellow-600' },
    { label: 'Total Anomalies', value: result.anomalyCount||0, color: 'border-l-gray-400 text-gray-700' },
    { label: 'Records Analyzed', value: result.totalAnalyzed||0, color: 'border-l-primary text-primary' },
  ] : []

  return (
    <div className="space-y-5">
      {loading ? <div className="text-gray-400 text-sm">Running Isolation Forest anomaly detection...</div> : (
        <>
          <div className="grid grid-cols-4 gap-4">
            {stats.map(s => (
              <div key={s.label} className={`bg-white rounded-xl border border-gray-100 border-l-4 ${s.color} p-4`}>
                <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                <div className={`text-2xl font-semibold ${s.color.split(' ')[1]}`}>{s.value}</div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-3.5 border-b border-gray-100 text-sm font-medium text-gray-700">
              Anomaly Detection Log — Isolation Forest Algorithm
            </div>
            {!result?.anomalies?.length ? (
              <div className="p-8 text-center text-gray-400">✅ No anomalies detected. System looks healthy.</div>
            ) : (
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>{['Date','Location','Usage (L)','Deviation','Risk','Anomaly Score'].map(h=><th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {result.anomalies.map((a, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-4 py-3">{a.date}</td>
                      <td className="px-4 py-3 font-medium">{a.location}</td>
                      <td className="px-4 py-3">{a.liters.toLocaleString()}</td>
                      <td className="px-4 py-3 text-red-600">+{a.deviation}%</td>
                      <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${sevStyle[a.severity]}`}>{a.severity}</span></td>
                      <td className="px-4 py-3 text-gray-400 text-xs font-mono">{a.anomalyScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  )
}
