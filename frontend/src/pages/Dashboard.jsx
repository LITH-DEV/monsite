import { useEffect, useState } from 'react'
import axios from 'axios'
import KpiCard from '../components/KpiCard'
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const API_URL = 'http://localhost:3000/api'

export default function Dashboard() {
  const [kpis, setKpis] = useState(null)
  const [chartData, setChartData] = useState([])
  const [donutData, setDonutData] = useState([])
  const [activity, setActivity] = useState([])
  const [loading, setLoading] = useState(true)

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899']

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, chartRes, donutRes, actRes] = await Promise.all([
          axios.get(`${API_URL}/dashboard/kpis`),
          axios.get(`${API_URL}/dashboard/chart`),
          axios.get(`${API_URL}/dashboard/donut`),
          axios.get(`${API_URL}/dashboard/activity`)
        ])

        setKpis(kpiRes.data)
        setChartData(chartRes.data)
        setDonutData(donutRes.data)
        setActivity(actRes.data)
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return <div className="p-8 text-center">Chargement...</div>
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Budget Total"
          value={`${kpis?.total_budget?.toLocaleString('fr-FR')} €`}
          icon="💰"
          color="blue"
        />
        <KpiCard
          title="Dépenses Totales"
          value={`${kpis?.total_spent?.toLocaleString('fr-FR')} €`}
          icon="💸"
          color="red"
        />
        <KpiCard
          title="Projets Actifs"
          value={kpis?.active_projects || 0}
          icon="📁"
          color="green"
        />
        <KpiCard
          title="Projets en Retard"
          value={kpis?.late_projects || 0}
          icon="⏳"
          color="purple"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* Courbe */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Entrées vs Sorties</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="income" stroke="#10B981" />
              <Line type="monotone" dataKey="expense" stroke="#EF4444" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Donut */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Répartition des Dépenses</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={donutData}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={130}
                paddingAngle={5}
                dataKey="value"
              >
                {donutData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Activité Récente */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Activité Récente</h2>
        <div className="space-y-3">
          {activity.map(item => (
            <div key={item.id} className="flex items-center justify-between border-b pb-3">
              <div>
                <p className="font-semibold">{item.projects?.name}</p>
                <p className="text-sm text-gray-600">{item.label}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-lg">{item.amount.toLocaleString('fr-FR')} €</p>
                <p className="text-sm text-gray-500">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
