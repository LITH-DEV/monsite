import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default function Tracking() {
  const [transactions, setTransactions] = useState([])
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    project_id: '',
    amount: '',
    label: '',
    type: 'expense'
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [transRes, projRes] = await Promise.all([
        axios.get(`${API_URL}/transactions`),
        axios.get(`${API_URL}/projects`)
      ])
      setTransactions(transRes.data)
      setProjects(projRes.data)
    } catch (error) {
      console.error('Erreur:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/transactions`, formData)
      setFormData({ project_id: '', amount: '', label: '', type: 'expense' })
      setShowForm(false)
      fetchData()
    } catch (error) {
      console.error('Erreur:', error)
    }
  }

  const filteredTransactions = selectedProject === 'all'
    ? transactions
    : transactions.filter(t => t.project_id === selectedProject)

  const totalIncome = filteredTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)

  const totalExpense = filteredTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)

  if (loading) return <div className="p-8">Chargement...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Suivi des Dépenses</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? 'Annuler' : '+ Ajouter Dépense'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <select
                required
                value={formData.project_id}
                onChange={(e) => setFormData({...formData, project_id: e.target.value})}
                className="border rounded px-4 py-2"
              >
                <option value="">Sélectionner un projet</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
              <input
                type="number"
                placeholder="Montant"
                required
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: parseFloat(e.target.value)})}
                className="border rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.label}
                onChange={(e) => setFormData({...formData, label: e.target.value})}
                className="border rounded px-4 py-2"
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="border rounded px-4 py-2"
              >
                <option value="expense">Dépense</option>
                <option value="income">Revenu</option>
              </select>
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Ajouter
            </button>
          </form>
        </div>
      )}

      {/* Filtres et Stats */}
      <div className="mb-8 space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-2">Filtrer par projet</label>
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="border rounded px-4 py-2 w-full md:w-64"
          >
            <option value="all">Tous les projets</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Revenus</p>
            <p className="text-2xl font-bold text-green-600">+{totalIncome.toLocaleString('fr-FR')} €</p>
          </div>
          <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Dépenses</p>
            <p className="text-2xl font-bold text-red-600">-{totalExpense.toLocaleString('fr-FR')} €</p>
          </div>
        </div>
      </div>

      {/* Historique */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold">Projet</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Description</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Montant</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Type</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filteredTransactions.map(t => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">{t.projects?.name}</td>
                <td className="px-6 py-4">{t.label || '-'}</td>
                <td className={`px-6 py-4 font-bold ${t.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                  {t.type === 'income' ? '+' : '-'}{t.amount.toLocaleString('fr-FR')} €
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded text-sm ${t.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {t.type === 'income' ? 'Revenu' : 'Dépense'}
                  </span>
                </td>
                <td className="px-6 py-4">{t.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
