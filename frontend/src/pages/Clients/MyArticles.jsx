import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'
import api from '../../api/api'
import {
  Search, ChevronLeft, Package, Shield, ShieldOff,
  Tag, AlertCircle, Clock, ChevronRight, Loader2, LayoutGrid
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'

export default function MyArticles() {
  const { user } = useContext(AuthContext)
  const [loading, setLoading] = useState(true)
  const [articlesClient, setArticlesClient] = useState([])
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [filterGarantie, setFilterGarantie] = useState("tous")
  const [selectedCategory, setSelectedCategory] = useState("")
  const navigator = useNavigate()
  const ITEMS_PER_PAGE = 6
  const [categories, setCategories] = useState([])

  const getArticlesClient = async () => {
    try {
      setLoading(true)
      const res = await api.get("ArticleClient/myArticles", {
        headers: { Authorization: `Bearer ${user?.token}` }
      })
      if (res.status === 200) setArticlesClient(res.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des articles:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryName = async () => {
    try {
      const res = await api.get("Categories")
      if (res.status === 200) setCategories(res.data)
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error)
    }
  }

  useEffect(() => { getArticlesClient(); getCategoryName() }, [])
console.log(articlesClient)
  const filtered = articlesClient.filter((a) => {
    const matchSearch =
      a.articleNom?.toLowerCase().includes(search.toLowerCase()) ||
      a.articleReference?.toLowerCase().includes(search.toLowerCase())
    const matchGarantie =
      filterGarantie === "active" ? a.garantieActive :
      filterGarantie === "expiree" ? !a.garantieActive :
      true
    const matchCategory =
      selectedCategory === "" || a.categorieId === parseInt(selectedCategory)
    return matchSearch && matchGarantie && matchCategory
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  useEffect(() => { setCurrentPage(1) }, [search, filterGarantie, selectedCategory])

  const GarantieBadge = ({ active, jours }) => {
    if (active) return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 shadow-sm">
        <Shield size={10} /> {jours}j restants
      </span>
    )
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-red-100 text-red-600 border border-red-200 shadow-sm">
        <ShieldOff size={10} /> Expirée
      </span>
    )
  }

  return (
    <div className="w-[85%] mx-auto mt-6 bg-white" data-theme="silk">
<div className=' rounded-xl shadow p-6'>
      {/* ══ Header ══ */}
      <div >
        <div className="w-[88%] mx-auto py-3 flex items-center gap-3">
          <button onClick={() => navigator(-1)} className="btn btn-ghost btn-sm btn-circle">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <h1 className="text-base font-extrabold text-base-content tracking-tight leading-none">Mes Articles</h1>
            <p className="text-[11px] text-base-content/40 mt-0.5">Gérez vos produits et garanties</p>
          </div>
          {/* Chips header */}
          {!loading && (
            <div className="hidden sm:flex gap-2">
              <div className="badge badge-ghost gap-1 border border-base-300 py-2.5 text-xs font-medium">
                <Package size={11} /> {articlesClient.length} articles
              </div>
              <div className="badge badge-success gap-1 py-2.5 text-xs font-medium">
                <Shield size={11} /> {articlesClient.filter(a => a.garantieActive).length} actives
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-[88%] mx-auto py-6 space-y-5">

        {/* ══ Stats cards ══ */}
        {!loading && articlesClient.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {[
              {
                label: "Total articles",
                value: articlesClient.length,
                icon: <Package size={18} />,
                cls: "bg-base-100 text-base-content border-base-300",
                sub: "produits enregistrés"
              },
              {
                label: "Garanties actives",
                value: articlesClient.filter(a => a.garantieActive).length,
                icon: <Shield size={18} />,
                cls: "bg-success/10 text-success border-success/25",
                sub: "encore couvertes"
              },
              {
                label: "Réclamations",
                value: articlesClient.reduce((sum, a) => sum + (a.nombreReclamations || 0), 0),
                icon: <AlertCircle size={18} />,
                cls: "bg-warning/10 text-warning border-warning/25",
                sub: "en cours"
              },
            ].map((stat, i) => (
              <div key={i} className={`rounded-2xl border p-4 flex flex-col gap-2 ${stat.cls}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold opacity-60">{stat.label}</span>
                  <span className="opacity-40">{stat.icon}</span>
                </div>
                <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                <p className="text-[10px] opacity-50 font-medium">{stat.sub}</p>
              </div>
            ))}
          </div>
        )}

        {/* ══ Filter bar — une seule ligne ══ */}
        <div className="bg-base-100 border border-base-300 rounded-2xl px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">

            {/* Garantie toggles */}
            {[
              { key: "tous",    label: "Tous",     icon: <Package size={12} /> },
              { key: "active",  label: "Actives",  icon: <Shield size={12} /> },
              { key: "expiree", label: "Expirées", icon: <ShieldOff size={12} /> },
            ].map(f => (
              <button
                key={f.key}
                onClick={() => setFilterGarantie(f.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 ${
                  filterGarantie === f.key
                    ? "bg-base-content text-base-100 border-base-content shadow-sm scale-[1.02]"
                    : "bg-base-100 text-base-content/45 border-base-300 hover:border-base-content/30 hover:text-base-content/70"
                }`}
              >
                {f.icon} {f.label}
              </button>
            ))}

            {/* Separator */}
            <div className="w-px h-5 bg-base-300 mx-0.5 shrink-0" />

            {/* Catégorie */}
            {categories.length > 0 && (
              <div className="flex items-center gap-1.5 shrink-0">
                <LayoutGrid size={13} className="text-base-content/35 shrink-0" />
                <select
                  className="select select-bordered select-sm rounded-xl bg-base-100 w-40 text-xs font-medium"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Toutes catégories</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.categorieName}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Separator */}
            <div className="w-px h-5 bg-base-300 mx-0.5 shrink-0" />

            {/* Search */}
            <div className="relative flex-1 min-w-[160px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30 w-3.5 h-3.5 pointer-events-none" />
              <input
                type="text"
                placeholder="Rechercher un article..."
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

            {/* Count pill */}
            <span className="text-[11px] text-base-content/40 whitespace-nowrap font-medium bg-base-200 px-2.5 py-1 rounded-full shrink-0">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
            </span>

          </div>
        </div>

        {/* ══ Loading ══ */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/35">
            <Loader2 size={32} className="animate-spin text-primary" />
            <p className="text-sm font-medium">Chargement de vos articles...</p>
          </div>
        )}

        {/* ══ Empty state ══ */}
        {!loading && filtered.length === 0 && (
          <div className="bg-base-100 border border-base-300 rounded-2xl flex flex-col items-center justify-center py-20 gap-3 text-base-content/40">
            <div className="p-5 bg-base-200 rounded-full">
              <Package size={34} strokeWidth={1.3} />
            </div>
            <div className="text-center">
              <p className="text-sm font-bold text-base-content/55">Aucun article trouvé</p>
              <p className="text-xs mt-1">Essayez de modifier vos filtres ou votre recherche.</p>
            </div>
            <button
              className="btn btn-sm btn-ghost border border-base-300 rounded-xl mt-1 text-xs"
              onClick={() => { setSearch(""); setSelectedCategory(""); setFilterGarantie("tous") }}
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}

        {/* ══ Cards Grid ══ */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((item) => (
              <div
                key={item.articleClientId}
                className="group bg-base-100 rounded-2xl border border-base-300 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative bg-base-200 aspect-[4/3] overflow-hidden">
                  <img
                    src={`https://localhost:7205${item.articleImageUrl}`}
                    alt={item.articleNom}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient overlay bas */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {item.articleDiscountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 flex items-center gap-0.5 bg-error text-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-md">
                      <Tag size={9} /> -{item.articleDiscountPercent}%
                    </span>
                  )}
                  <div className="absolute top-2.5 right-2.5">
                    <GarantieBadge active={item.garantieActive} jours={item.joursRestantsGarantie} />
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      {item.categorieNom && (
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                          {item.categorieNom}
                        </span>
                      )}
                      <span className="text-[10px] font-mono text-base-content/35 uppercase tracking-wider">
                        {item.articleReference}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base-content text-sm leading-tight mt-1">
                      {item.articleNom}
                    </h3>
                    <p className="text-xs text-base-content/45 mt-1 line-clamp-2 leading-relaxed">
                      {item.articleDescription}
                    </p>
                  </div>

                  {/* Prix + Réclamations */}
                  
                    
                  <div className="mt-auto pt-2.5 border-t border-base-200 flex items-center justify-between gap-2">
                    
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-base font-black text-base-content">
                        {(item.articlePrixPromo ?? item.articlePrix)?.toLocaleString()} DA
                      </span>
                      {item.articlePrixPromo && item.articlePrixPromo !== item.articlePrix && (
                        <span className="text-[11px] text-base-content/30 line-through font-medium">
                          {item.articlePrix?.toLocaleString()} DA
                        </span>
                      )}
                    </div>
                    {item.nombreReclamations > 0 && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-warning bg-warning/10 border border-warning/20 px-2 py-0.5 rounded-full">
                        <AlertCircle size={10} /> {item.nombreReclamations}
                      </span>
                    )}
                  </div>

                  {/* Date achat */}
                  <div className="flex items-center gap-1 text-[11px] text-base-content/35 font-medium">
                    <Clock size={10} />
                    Acheté le {new Date(item.dateAchat).toLocaleDateString('fr-FR', {
                      day: '2-digit', month: 'short', year: 'numeric'
                    })}
                  </div>

                  <div className="flex items-center gap-1 mt-1">
                    <button
                      onClick={() => navigator(`${item.articleClientId}/reclamations`)}
                      className="group/btn flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border border-base-300 text-base-content/50 bg-base-300 hover:bg-base-content hover:text-base-100 hover:border-base-content transition-all duration-200 hover:shadow-md"
                    >
                      <AlertCircle size={11} className="group-hover/btn:rotate-12 transition-transform duration-200" />
                      Voir réclamations
                      <ChevronRight size={11} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </button>
                  </div>

                  </div>

                </div>
              
            ))}
          </div>
        )}

        {/* ══ Pagination ══ */}
        {totalPages >= 1 && (
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="btn btn-sm btn-ghost border border-base-300 rounded-xl disabled:opacity-25"
            >
              <ChevronLeft size={15} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={`btn btn-sm rounded-xl min-w-[2rem] font-bold ${
                  currentPage === p
                    ? "btn-primary shadow-sm"
                    : "btn-ghost border border-base-300 text-base-content/50"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-sm btn-ghost border border-base-300 rounded-xl disabled:opacity-25"
            >
              <ChevronRight size={15} />
            </button>
          </div>
        )}

      </div>
      </div>
    </div>
  )
}