export default function Goals() {
  const goals = [
    { label: 'Monthly target: 70,000 L', current: 74100, target: 70000, pct: 94, warn: true },
    { label: 'Leak incidents: 0', current: 7, target: 0, pct: 30, warn: true },
    { label: 'Sustainability score: 80+', current: 74, target: 80, pct: 93, warn: false },
  ]
  const board = [
    { rank: 1, name: 'Hostel South', saved: 2840, badge: '🥇' },
    { rank: 2, name: 'Library Block', saved: 2110, badge: '🥈' },
    { rank: 3, name: 'Admin Block', saved: 1760, badge: '🥉' },
    { rank: 4, name: 'Cafeteria', saved: 980, badge: '' },
    { rank: 5, name: 'Sports Complex', saved: 510, badge: '' },
  ]
  return (
    <div className="grid grid-cols-2 gap-5">
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4">💧 Water Saving Goals</h2>
        <div className="space-y-4">
          {goals.map(g => (
            <div key={g.label} className="bg-gray-50 rounded-lg p-3">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-900">{g.label}</span>
                <span className={g.warn ? 'text-red-600 font-medium' : 'text-primary font-medium'}>{g.current.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${g.warn ? 'bg-red-400' : 'bg-primary'}`} style={{width:`${Math.min(g.pct,100)}%`}}></div>
              </div>
              <div className="text-xs text-gray-400 mt-1">{g.pct}% of target</div>
            </div>
          ))}
        </div>
      </div>
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-700 mb-4">🏆 Conservation Leaderboard</h2>
        <div className="space-y-1">
          {board.map(b => (
            <div key={b.rank} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50">
              <span className="text-sm font-medium w-6 text-gray-500">{b.badge || b.rank}</span>
              <div className="w-7 h-7 rounded-full bg-primary-light flex items-center justify-center text-xs font-medium text-primary">
                {b.name.slice(0,2)}
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900">{b.name}</div>
                <div className="text-xs text-gray-400">Saved {b.saved.toLocaleString()} L this month</div>
              </div>
              {b.rank === 1 && <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-md font-medium">Top Saver</span>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
