import React, { useEffect, useState } from 'react'
import api from '../../api/api'
import { Search, Layers, Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import AddOrUpdateCategorie from './AddOrUpdateCategorie'

export default function Categories() {

  const [openPopup, setOpenPopup] = useState(false)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [categorieName, setCategorieName] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("")
  const [action, setAction] = useState("")

  const getCategories = async () => {
    try {
      const res = await api.get("Categories")
      if (res.status === 200) setCategories(res.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { getCategories() }, [])

  const filtered = categories.filter((a) =>
    a.categorieName?.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-base-content/35" data-theme="silk">
      <Loader2 size={32} className="animate-spin text-primary" />
      <p className="text-sm font-medium">Chargement des catégories...</p>
    </div>
  )

  return (
    <div className="w-[85%] mx-auto mt-6 space-y-6 bg-white" data-theme="silk">

      {/* ══ Header ══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-primary/10 rounded-xl">
            <Layers size={20} className="text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-base-content leading-none">Catégories</h1>
            <p className="text-[11px] text-base-content/40 mt-0.5">Gérez vos catégories de produits</p>
          </div>
        </div>
        <button
          onClick={() => { setCategorieName(""); setAction("add"); setOpenPopup(true) }}
          className="group/btn flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-content font-bold text-xs shadow-sm hover:shadow-md hover:brightness-110 active:scale-95 transition-all duration-150"
        >
          <Plus size={14} className="group-hover/btn:rotate-90 transition-transform duration-200" />
          Ajouter
        </button>

        <AddOrUpdateCategorie
          categorieName={categorieName}
          setCategorieName={setCategorieName}
          open={openPopup}
          setOpenPopup={setOpenPopup}
          action={action}
          selectedCategory={selectedCategory}
        />
      </div>

      {/* ══ Filter Bar ══ */}
      <div className="bg-base-100 border border-base-300 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30 w-3.5 h-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher une catégorie..."
              className="input input-bordered input-sm rounded-xl w-full pl-8 pr-7 bg-base-100 text-sm"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/25 hover:text-base-content/60 text-lg leading-none transition-colors"
                onClick={() => setSearch("")}
              >×</button>
            )}
          </div>
          <span className="text-[11px] text-base-content/40 whitespace-nowrap font-medium bg-base-200 px-2.5 py-1 rounded-full shrink-0">
            {filtered.length} catégorie{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* ══ Empty state ══ */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-base-content/40 bg-base-100 border border-base-300 rounded-2xl">
          <div className="p-4 bg-base-200 rounded-full">
            <Layers size={28} strokeWidth={1.3} />
          </div>
          <p className="text-sm font-bold text-base-content/50">Aucune catégorie trouvée</p>
          <p className="text-xs">Essayez de modifier votre recherche.</p>
          {search && (
            <button
              className="btn btn-sm btn-ghost border border-base-300 rounded-xl mt-1 text-xs"
              onClick={() => setSearch("")}
            >
              Réinitialiser
            </button>
          )}
        </div>
      )}

      {/* ══ Liste ══ */}
      {filtered.length > 0 && (
        <div className="bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
          <table className="table w-full">
            <thead>
              <tr className="bg-base-200 border-b border-base-300">
                <th className="text-[10px] font-black uppercase tracking-widest text-base-content/40 py-3 px-5">#</th>
                <th className="text-[10px] font-black uppercase tracking-widest text-base-content/40 py-3 px-5">Nom</th>
                <th className="text-[10px] font-black uppercase tracking-widest text-base-content/40 py-3 px-5 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item, index) => (
                <tr key={item.id} className="border-b border-base-200 hover:bg-base-200/50 transition-colors duration-100">
                  <td className="px-5 py-3 text-[11px] font-mono text-base-content/30">{index + 1}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Layers size={14} className="text-primary" />
                      </div>
                      <span className="text-sm font-bold text-base-content">{item.categorieName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setCategorieName(item.categorieName)
                          setAction("update")
                          setOpenPopup(true)
                          setSelectedCategory(item.id)
                        }}
                        className="group/edit p-1.5 rounded-xl border border-warning/30 bg-warning/5 text-warning hover:bg-warning hover:text-white hover:border-warning transition-all duration-150"
                      >
                        <Pencil size={13} className="group-hover/edit:scale-110 transition-transform duration-150" />
                      </button>
                      <button className="group/del p-1.5 rounded-xl border border-error/30 bg-error/5 text-error hover:bg-error hover:text-white hover:border-error transition-all duration-150">
                        <Trash2 size={13} className="group-hover/del:scale-110 transition-transform duration-150" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-base-200">
                <td colSpan={3} className="px-5 py-2.5 text-right text-[11px] text-base-content/40 font-medium">
                  Total : {filtered.length} catégorie{filtered.length !== 1 ? "s" : ""}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

    </div>
  )
}