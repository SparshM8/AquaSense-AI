import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const savings = [
  { month: 'Jan', saved: 3200 }, { month: 'Feb', saved: 4100 }, { month: 'Mar', saved: 5600 },
  { month: 'Apr', saved: 6800 }, { month: 'May', saved: 7100 }, { month: 'Jun', saved: 8420 },
]

export default function Insights() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-3 gap-4">
        {[['💧 Water Saved', '8,420 L', 'This month vs baseline','text-primary'],
          ['🌍 SDG-6 Score', '74 / 100', 'Good — on track','text-water'],
          ['🌿 CO₂ Offset', '2.1 kg', 'Water treatment energy','text-purple-600']].map(([l,v,s,c]) => (
          <div key={l} className="bg-white rounded-xl border border-gray-100 p-5 text-center">
            <div className="text-xs text-gray-500 mb-2">{l}</div>
            <div className={`text-3xl font-semibold ${c} mb-1`}>{v}</div>
            <div className="text-xs text-gray-400">{s}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Monthly Water Savings Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={savings}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{fontSize:11}} />
              <YAxis tickFormatter={v => `${v}L`} tick={{fontSize:11}} />
              <Tooltip formatter={v => [`${v} L`,'Saved']} />
              <Bar dataKey="saved" fill="#1D9E75" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">🌿 SDG-6 Impact Metrics</h2>
          <div className="space-y-3">
            {[['Clean water access contribution','85%','primary'],
              ['Pollution reduction index','62%','blue-500'],
              ['Ecosystem protection score','71%','purple-600'],
              ['Water efficiency rating','78%','primary']].map(([l,v,c]) => (
              <div key={l}>
                <div className="flex justify-between text-xs text-gray-600 mb-1"><span>{l}</span><span className="font-medium">{v}</span></div>
                <div className="w-full bg-gray-100 rounded-full h-1.5">
                  <div className={`bg-${c} h-1.5 rounded-full`} style={{width:v}}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4">💡 Conservation Tips</h2>
        <div className="grid grid-cols-2 gap-3">
          {['Turn off taps when not in active use — saves up to 8 L/min',
            'Check meters weekly to catch silent leaks early',
            'Reuse RO reject water for toilet flushing',
            'Install sensor-based taps in common areas',
            'Report visible drips within 24 hours',
            'Shift irrigation to 5–6 AM to cut evaporation by 30%'].map(tip => (
            <div key={tip} className="flex items-start gap-2 p-3 bg-primary-light rounded-lg">
              <span className="text-primary mt-0.5">🌱</span>
              <span className="text-xs text-gray-700 leading-relaxed">{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
