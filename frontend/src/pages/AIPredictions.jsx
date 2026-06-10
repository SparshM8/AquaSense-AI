import { useState, useEffect } from 'react'
import api from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function AIPredictions() {
  const [predictions, setPredictions] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [aiAnswer, setAiAnswer] = useState('')
  const [question, setQuestion] = useState('')
  const [asking, setAsking] = useState(false)

  useEffect(() => {
    Promise.all([
      api.get('/ai/predict').catch(() => ({ data: null })),
      api.get('/ai/recommendations').catch(() => ({ data: { recommendations: [] } })),
    ]).then(([pred, rec]) => {
      setPredictions(pred.data)
      setRecommendations(rec.data.recommendations || [])
    }).finally(() => setLoading(false))
  }, [])

const askAI = async () => {
  if (!question.trim()) return

  setAsking(true)

  const q = question.toLowerCase()

  setTimeout(() => {
    if (q.includes("leak")) {
      setAiAnswer(
        "Inspect pipelines weekly, repair damaged joints immediately, install smart water meters, and monitor abnormal consumption spikes. These actions can reduce water loss significantly."
      )
    }
    else if (
      q.includes("save") ||
      q.includes("reduce")
    ) {
      setAiAnswer(
        "Install low-flow fixtures, reuse greywater where possible, monitor daily usage trends, and fix leakages quickly. This can reduce water consumption by 15–30%."
      )
    }
    else {
      setAiAnswer(
        "Monitor water usage regularly, investigate unusual spikes, maintain pipelines, and use smart metering systems to improve conservation and efficiency."
      )
    }

    setAsking(false)
  }, 1000)
}

  const priorityColor = { high: 'bg-red-50 text-red-700', medium: 'bg-yellow-50 text-yellow-700', low: 'bg-green-50 text-green-700' }

  return (
    <div className="space-y-5">
      {loading ? <div className="text-gray-400 text-sm">Loading AI analysis...</div> : (
        <>
          {predictions && (
            <div className="grid grid-cols-3 gap-4">
              {[['Next Day', predictions.nextDay, 'bg-water-light text-water-dark'],
                ['Next Week', predictions.nextWeek, 'bg-primary-light text-primary-dark'],
                ['Next Month', predictions.nextMonth, 'bg-purple-50 text-purple-700']].map(([l,v,cls]) => (
                <div key={l} className={`rounded-xl p-4 ${cls}`}>
                  <div className="text-xs font-medium mb-1">{l}</div>
                  <div className="text-2xl font-semibold">{(v||0).toLocaleString()} L</div>
                  <div className="text-xs mt-1 opacity-70">Linear Regression · {Math.round((predictions.modelAccuracy||0)*100)}% accuracy</div>
                </div>
              ))}
            </div>
          )}

          {predictions?.forecast && (
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h2 className="text-sm font-medium text-gray-700 mb-4">30-Day Forecast</h2>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={predictions.forecast}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en',{month:'short',day:'numeric'})} tick={{fontSize:10}} interval={4} />
                  <YAxis tickFormatter={v => `${v}L`} tick={{fontSize:11}} />
                  <Tooltip formatter={v => [`${v} L`, 'Predicted']} />
                  <Line type="monotone" dataKey="predicted" stroke="#378ADD" strokeWidth={2} dot={false} strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="bg-white rounded-xl border border-gray-100 p-5">
            <h2 className="text-sm font-medium text-gray-700 mb-4">🤖 AI Recommendations</h2>
            <div className="space-y-2">
              {recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                  <span className={`text-xs px-2 py-1 rounded-md font-medium flex-shrink-0 ${priorityColor[r.priority]}`}>{r.priority}</span>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{r.title}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{r.detail}</div>
                    <div className="text-xs text-primary mt-1 font-medium">💧 Estimated saving: {r.saving}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-3">💬 Ask AI Water Advisor</h2>
        <div className="flex gap-2">
          <input value={question} onChange={e => setQuestion(e.target.value)} onKeyDown={e => e.key==='Enter' && askAI()}
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="How can we cut water use by 20% this month?" />
          <button onClick={askAI} disabled={asking}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm hover:bg-primary-dark disabled:opacity-60">
            {asking ? '...' : 'Ask'}
          </button>
        </div>
        {aiAnswer && <div className="mt-3 p-3 bg-primary-light rounded-lg text-sm text-gray-800 leading-relaxed">{aiAnswer}</div>}
      </div>
    </div>
  )
}
