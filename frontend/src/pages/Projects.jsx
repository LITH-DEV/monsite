import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    estimated_cost: '',
    start_date: '',
    end_date: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_URL}/projects`)
      setProjects(res.data)
    } catch (error) {
      console.error('Erreur lors du chargement des projets:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${API_URL}/projects`, formData)
      setFormData({ name: '', estimated_cost: '', start_date: '', end_date: '' })
      setShowForm(false)
      fetchProjects()
    } catch (error) {
      console.error('Erreur lors de la création du projet:', error)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Êtes-vous sûr?')) {
      try {
        await axios.delete(`${API_URL}/projects/${id}`)
        fetchProjects()
      } catch (error) {
        console.error('Erreur lors de la suppression:', error)
      }
    }
  }

  const getStatusBadge = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      active: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      late: 'bg-red-100 text-red-800'
    }
    return colors[status] || 'bg-gray-100 text-gray-800'
  }

  if (loading) return <div className="p-8">Chargement...</div>

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Projets</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Annuler' : '+ Nouveau Projet'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Nom du projet"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="border rounded px-4 py-2"
              />
              <input
                type="number"
                placeholder="Budget estimé"
                required
                value={formData.estimated_cost}
                onChange={(e) => setFormData({...formData, estimated_cost: parseFloat(e.target.value)})}
                className="border rounded px-4 py-2"
              />
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({...formData, start_date: e.target.value})}
                className="border rounded px-4 py-2"
              />
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                className="border rounded px-4 py-2"
              />
            </div>
            <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
              Créer le Projet
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {projects.map(project => (
          <div key={project.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-xl font-bold">{project.name}</h3>
                <span className={`inline-block px-3 py-1 rounded text-sm font-semibold mt-2 ${getStatusBadge(project.status)}`}>
                  {project.status}
                </span>
              </div>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 hover:text-red-800 font-semibold"
              >
                Supprimer
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Budget Estimé</p>
                <p className="text-lg font-bold">{project.estimated_cost.toLocaleString('fr-FR')} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Dépensé</p>
                <p className="text-lg font-bold">{project.spent.toLocaleString('fr-FR')} €</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Progression</p>
                <p className="text-lg font-bold">{((project.spent / project.estimated_cost) * 100).toFixed(1)}%</p>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all"
                style={{ width: `${Math.min((project.spent / project.estimated_cost) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
