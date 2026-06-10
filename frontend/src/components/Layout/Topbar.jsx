import { useLocation } from 'react-router-dom'

const titles = {
  '/dashboard': 'Dashboard',
  '/records': 'Water Records',
  '/ai': 'AI Predictions',
  '/leakage': 'Leakage Alerts',
  '/insights': 'Sustainability Insights',
  '/goals': 'Goals & Leaderboard',
  '/reports': 'Reports',
  '/admin': 'Admin Panel',
}

export default function Topbar() {
  const { pathname } = useLocation()
  return (
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between">
      <h1 className="text-base font-semibold text-gray-900">{titles[pathname] || 'AquaSense AI'}</h1>
      <div className="flex items-center gap-3">
        <span className="text-xs text-gray-400">{new Date().toLocaleDateString('en-IN', {weekday:'short',year:'numeric',month:'short',day:'numeric'})}</span>
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" title="System online"></div>
      </div>
    </header>
  )
}
