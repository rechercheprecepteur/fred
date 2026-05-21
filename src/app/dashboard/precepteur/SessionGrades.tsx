// src/components/SessionGrades.tsx
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Trash2, Award, Star, Edit3, X, Check } from 'lucide-react'

type Grade = {
  id: number
  session_id: number
  title: string
  score: number
  max_score: number
  comment: string | null
  created_at: string
}

interface SessionGradesProps {
  sessionId: number
}

export default function SessionGrades({ sessionId }: SessionGradesProps) {
  const [grades, setGrades] = useState<Grade[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState({
    title: '',
    score: '',
    max_score: '20',
    comment: ''
  })

  useEffect(() => {
    loadGrades()
  }, [sessionId])

  const loadGrades = async () => {
    const { data } = await supabase
      .from('session_grades')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: false })

    if (data) setGrades(data)
    setLoading(false)
  }

  const resetForm = () => {
    setForm({ title: '', score: '', max_score: '20', comment: '' })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const gradeData = {
      session_id: sessionId,
      title: form.title,
      score: parseFloat(form.score),
      max_score: parseFloat(form.max_score),
      comment: form.comment || null
    }

    if (editingId) {
      const { error } = await supabase
        .from('session_grades')
        .update(gradeData)
        .eq('id', editingId)

      if (!error) {
        await loadGrades()
        resetForm()
      }
    } else {
      const { error } = await supabase
        .from('session_grades')
        .insert(gradeData)

      if (!error) {
        await loadGrades()
        resetForm()
      }
    }
  }

  const handleEdit = (grade: Grade) => {
    setForm({
      title: grade.title,
      score: grade.score.toString(),
      max_score: grade.max_score.toString(),
      comment: grade.comment || ''
    })
    setEditingId(grade.id)
    setShowForm(true)
  }

  const handleDelete = async (gradeId: number) => {
    const { error } = await supabase
      .from('session_grades')
      .delete()
      .eq('id', gradeId)

    if (!error) await loadGrades()
  }

  // Calculer la moyenne
  const average = grades.length > 0
    ? grades.reduce((acc, g) => acc + (g.score / g.max_score) * 20, 0) / grades.length
    : 0

  // Pourcentage pour la barre de progression
  const getPercentage = (score: number, max: number) => {
    return Math.min((score / max) * 100, 100)
  }

  // Couleur selon le score
  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600'
    if (percentage >= 60) return 'text-blue-600'
    if (percentage >= 40) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500'
    if (percentage >= 60) return 'bg-blue-500'
    if (percentage >= 40) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-gray-700">Cotations ({grades.length})</h3>
          {grades.length > 0 && (
            <span className={`text-xs font-medium ${getScoreColor(average)}`}>
              Moy: {average.toFixed(1)}/20
            </span>
          )}
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-3 h-3" />
            Noter
          </button>
        )}
      </div>

      {/* Formulaire d'ajout/édition */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600">
              {editingId ? 'Modifier la note' : 'Nouvelle note'}
            </span>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Titre (ex: Exercice 1, Devoir...)"
            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
            required
          />
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Note</label>
              <input
                type="number"
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                placeholder="15"
                step="0.5"
                min="0"
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-0.5">Sur</label>
              <input
                type="number"
                value={form.max_score}
                onChange={(e) => setForm({ ...form, max_score: e.target.value })}
                placeholder="20"
                min="1"
                className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                required
              />
            </div>
          </div>
          
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Commentaire (optionnel)"
            rows={2}
            className="w-full px-2 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
          
          <button
            type="submit"
            className="w-full px-3 py-1.5 bg-black text-white text-xs rounded-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-1"
          >
            <Check className="w-3 h-3" />
            {editingId ? 'Modifier' : 'Ajouter'}
          </button>
        </form>
      )}

      {/* Liste des notes */}
      {loading ? (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-400" />
        </div>
      ) : grades.length === 0 ? (
        <p className="text-xs text-gray-400 text-center py-4">Aucune cotation</p>
      ) : (
        <div className="space-y-2">
          {grades.map((grade) => {
            const percentage = getPercentage(grade.score, grade.max_score)
            const scoreOn20 = (grade.score / grade.max_score) * 20
            
            return (
              <div
                key={grade.id}
                className="bg-gray-50 p-3 rounded-lg group hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">{grade.title}</p>
                    {grade.comment && (
                      <p className="text-xs text-gray-400 mt-0.5">{grade.comment}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-2">
                    <span className={`text-sm font-bold ${getScoreColor(percentage)}`}>
                      {grade.score}/{grade.max_score}
                    </span>
                    <span className="text-xs text-gray-400">
                      ({scoreOn20.toFixed(1)}/20)
                    </span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleEdit(grade)}
                        className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit3 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(grade.id)}
                        className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Barre de progression */}
                <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${getProgressColor(percentage)}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}

          {/* Résumé */}
          <div className="flex items-center gap-2 p-2 bg-yellow-50 rounded-lg">
            <Award className="w-4 h-4 text-yellow-600" />
            <span className="text-xs text-yellow-700">
              <span className="font-medium">Moyenne session:</span> {average.toFixed(1)}/20
            </span>
          </div>
        </div>
      )}
    </div>
  )
}