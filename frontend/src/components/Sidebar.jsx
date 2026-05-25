import { Link } from 'react-router-dom'

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: '📊' },
    { name: 'Projets', path: '/projects', icon: '📁' },
    { name: 'Analyse', path: '/analysis', icon: '🤖' },
    { name: 'Suivi', path: '/tracking', icon: '📈' }
  ]

  return (
    <div className="w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white p-6 h-screen">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">MonSite</h1>
        <p className="text-blue-200 text-sm">Gestion de Budget</p>
      </div>
      
      <nav className="space-y-2">
        {menuItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="text-xl">{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>
    </div>
  )
}
