import { useEffect, useState } from 'react'
import axios from 'axios'

const API_URL = 'http://localhost:3000/api'

export default function Analysis() {
  const [kpis, setKpis] = useState(null)
  const [projects, setProjects] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiRes, projectRes] = await Promise.all([
          axios.get(`${API_URL}/dashboard/kpis`),
          axios.get(`${API_URL}/projects`)
        ])

        setKpis(kpiRes.data)
        setProjects(projectRes.data)

        // Générer les recommandations
        const availableAmount = kpiRes.data.total_budget - kpiRes.data.total_spent
        const recs = projectRes.data
          .filter(p => p.status !== 'completed')
          .map(p => ({
            ...p,
            progress: (p.spent / p.estimated_cost) * 100,
            remaining: p.estimated_cost - p.spent,
            urgency: new Date(p.end_date) < new Date() ? 'critical' : 'normal'
          }))
          .sort((a, b) => {
            if (a.urgency === 'critical' && b.urgency !== 'critical') return -1
            if (a.progress > b.progress) return -1
            return 1
          })

        setRecommendations(recs)
      } catch (error) {
        console.error('Erreur:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) return <div className="p-8">Chargement...</div>

  const availableAmount = kpis.total_budget - kpis.total_spent

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Conseiller d'Investissement</h1>

      {/* Situation actuelle */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-lg shadow mb-8">
        <h2 className="text-2xl font-bold mb-4">Situation Financière Actuelle</h2>
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-blue-200">Budget Total</p>
            <p className="text-3xl font-bold">{kpis.total_budget.toLocaleString('fr-FR')} €</p>
          </div>
          <div>
            <p className="text-blue-200">Dépenses</p>
            <p className="text-3xl font-bold text-red-300">{kpis.total_spent.toLocaleString('fr-FR')} €</p>
          </div>
          <div>
            <p className="text-blue-200">Disponible</p>
            <p className="text-3xl font-bold text-green-300">{availableAmount.toLocaleString('fr-FR')} €</p>
          </div>
        </div>
      </div>

      {/* Recommandations */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Recommandations d'Investissement</h2>
        <div className="space-y-4">
          {recommendations.map((project, index) => {
            const allocationPercentage = Math.min(
              ((project.remaining / recommendations.reduce((sum, p) => sum + p.remaining, 0)) * 100) || 0,
              100
            )
            const suggestedAmount = Math.min((availableAmount * allocationPercentage) / 100, project.remaining)

            return (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-600">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold">{index + 1}. {project.name}</h3>
                    {project.urgency === 'critical' && (
                      <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded text-sm font-semibold mt-2">
                        ⚠️ CRITIQUE - Dépassement de délai
                      </span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-green-600">{suggestedAmount.toLocaleString('fr-FR')} €</p>
                    <p className="text-sm text-gray-600">Allocation suggérée</p>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600">Progression</p>
                    <p className="text-lg font-bold">{project.progress.toFixed(1)}%</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Montant Restant</p>
                    <p className="text-lg font-bold">{project.remaining.toLocaleString('fr-FR')} €</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Priorité</p>
                    <p className="text-lg font-bold">{project.urgency === 'critical' ? '🔴 Critique' : '🟢 Normal'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Deadline</p>
                    <p className="text-lg font-bold">{project.end_date}</p>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-green-600 h-3 rounded-full"
                    style={{ width: `${project.progress}%` }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600 mt-4">
                  <strong>Raison:</strong> {project.urgency === 'critical' 
                    ? 'Ce projet est en retard et nécessite une injection immédiate de capital.'
                    : `Ce projet est le plus avancé (${project.progress.toFixed(1)}%) et peut être finalisé rapidement.`
                  }
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
