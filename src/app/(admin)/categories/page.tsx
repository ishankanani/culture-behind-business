'use client'
import { useState, useEffect } from 'react'

type Category = { id: string; name: string; createdAt: string }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [newName, setNewName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function fetchCategories() {
    const res = await fetch('/api/categories')
    const data = await res.json()
    setCategories(data)
  }

  useEffect(() => { fetchCategories() }, [])

  async function add() {
    if (!newName.trim()) return
    setLoading(true); setError(''); setSuccess('')
    const res = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newName.trim() }),
    })
    const d = await res.json()
    if (res.ok) {
      setSuccess(`"${newName}" added successfully`)
      setNewName('')
      fetchCategories()
    } else {
      setError(d.error || 'Failed to add')
    }
    setLoading(false)
  }

  async function del(id: string, name: string) {
    if (!confirm(`Delete category "${name}"? Episodes using it will lose their category.`)) return
    await fetch(`/api/categories/${id}`, { method: 'DELETE' })
    fetchCategories()
  }

  return (
    <div>
      <div className="bg-white border-b border-stone-200 px-6 h-14 flex items-center">
        <h1 className="text-base font-medium">Categories</h1>
      </div>

      <div className="p-6 max-w-xl">
        {/* Add new */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 mb-6">
          <h2 className="text-sm font-medium text-stone-900 mb-4">Add new category</h2>
          <div className="flex gap-3">
            <input
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && add()}
              className="input flex-1"
              placeholder="e.g. Innovation, Finance, Leadership..."
            />
            <button
              onClick={add}
              disabled={loading || !newName.trim()}
              className="btn-primary px-5 disabled:opacity-50">
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
          {success && <p className="text-[#0F6E56] text-xs mt-2">✓ {success}</p>}
        </div>

        {/* List */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="px-5 py-3 bg-stone-50 border-b border-stone-200 text-[10px] font-medium text-stone-500 uppercase tracking-wider">
            All categories ({categories.length})
          </div>
          {categories.length === 0 ? (
            <div className="p-10 text-center text-stone-400 text-sm">
              No categories yet. Add your first one above.
            </div>
          ) : (
            categories.map(cat => (
              <div key={cat.id}
                className="flex items-center justify-between px-5 py-3 border-b border-stone-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-[#1D9E75]" />
                  <span className="text-sm text-stone-800 font-medium">{cat.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-stone-400">
                    {new Date(cat.createdAt).toLocaleDateString('en-GB')}
                  </span>
                  <button
                    onClick={() => del(cat.id, cat.name)}
                    className="text-[10px] px-2 py-1 rounded border border-red-300 text-red-500 hover:bg-red-50 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}