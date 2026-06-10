import { useDashboard } from '../hooks/useWaterData'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'

const scoreColor = (s) => s >= 81 ? 'text-green-600' : s >= 61 ? 'text-primary' : s >= 31 ? 'text-yellow-600' : 'text-red-600'
const scoreLabel = (s) => s >= 81 ? 'Excellent' : s >= 61 ? 'Good' : s >= 31 ? 'Average' : 'Poor'

function StatCard({ label, value, delta, deltaType, icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">{icon} {label}</div>
      <div className="text-2xl font-semibold text-gray-900">{value}</div>
      {delta && <div className={`text-xs mt-1 ${deltaType === 'up' ? 'text-red-500' : 'text-primary'}`}>{delta}</div>}
    </div>
  )
}

export default function Dashboard() {
  const { data, loading } = useDashboard()

  if (loading) return <div className="flex items-center justify-center h-64 text-gray-400">Loading dashboard...</div>
  if (!data) return <div className="text-gray-500 text-sm">No data yet. Add your first water record.</div>

  const COLORS = ['#1D9E75', '#378ADD', '#7F77DD', '#EF9F27']

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Today's Usage" value={`${(data.today||0).toLocaleString()} L`} delta="vs yesterday" deltaType="neutral" icon="📅" />
        <StatCard label="Weekly Total" value={`${(data.weekly||0).toLocaleString()} L`} delta="last 7 days" deltaType="neutral" icon="📆" />
        <StatCard label="Monthly Total" value={`${(data.monthly||0).toLocaleString()} L`} delta="this month" deltaType="neutral" icon="🗓️" />
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">🏆 Sustainability Score</div>
          <div className={`text-2xl font-semibold ${scoreColor(data.sustainabilityScore||0)}`}>{data.sustainabilityScore||0}</div>
          <div className={`text-xs mt-1 font-medium ${scoreColor(data.sustainabilityScore||0)}`}>{scoreLabel(data.sustainabilityScore||0)}</div>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{width:`${data.sustainabilityScore||0}%`}}></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Daily Consumption Trend</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data.trend || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString('en',{month:'short',day:'numeric'})} tick={{fontSize:11}} />
              <YAxis tickFormatter={v => `${v}L`} tick={{fontSize:11}} />
              <Tooltip formatter={v => [`${v} L`, 'Consumption']} labelFormatter={l => new Date(l).toLocaleDateString()} />
              <Line type="monotone" dataKey="liters" stroke="#1D9E75" strokeWidth={2} dot={{ r: 3, fill: '#1D9E75' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <h2 className="text-sm font-medium text-gray-700 mb-4">Usage Analytics</h2>
          <div className="space-y-3">
            {[['Average Daily', data.average, '📊'],['Peak Usage', data.peak, '📈'],['Lowest Usage', data.lowest, '📉']].map(([l,v,i]) => (
              <div key={l} className="bg-gray-50 rounded-lg p-3">
                <div className="text-xs text-gray-500 mb-1">{i} {l}</div>
                <div className="text-lg font-semibold text-gray-900">{(v||0).toLocaleString()} <span className="text-xs text-gray-400 font-normal">L</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
