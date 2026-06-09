import React, { useState, useEffect, useContext, useMemo } from 'react'
import { Search, SlidersHorizontal, Tag, TrendingDown, X, ShieldCheck, Star, ChevronDown, Grid3X3, List, Zap } from 'lucide-react'
import api from '../api/api'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router'

export default function ArticlesCatalogue() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [selectedCategorie, setSelectedCategorie] = useState('Tous')
  const [sortBy, setSortBy] = useState('default')
  const [priceRange, setPriceRange] = useState([0, 10000])
  const [maxPrice, setMaxPrice] = useState(10000)
  const [viewMode, setViewMode] = useState('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [onlyPromo, setOnlyPromo] = useState(false)

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await api.get('/Articles', {
          headers: { Authorization: `Bearer ${user?.token}` }
        })
        setArticles(res.data)
        const max = Math.max(...res.data.map(a => a.prix ?? 0))
        setMaxPrice(max)
        setPriceRange([0, max])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])

  const categories = useMemo(() => {
    const cats = [...new Set(articles.map(a => a.categorie?.categorieName).filter(Boolean))]
    return ['Tous', ...cats]
  }, [articles])

  const filtered = useMemo(() => {
    let result = [...articles]
    if (search) result = result.filter(a => a.nom?.toLowerCase().includes(search.toLowerCase()) || a.reference?.toLowerCase().includes(search.toLowerCase()))
    if (selectedCategorie !== 'Tous') result = result.filter(a => a.categorie?.categorieName === selectedCategorie)
    result = result.filter(a => (a.prix ?? 0) >= priceRange[0] && (a.prix ?? 0) <= priceRange[1])
    if (onlyPromo) result = result.filter(a => a.prixPromo != null)
    if (sortBy === 'prix-asc') result.sort((a, b) => (a.prixPromo ?? a.prix) - (b.prixPromo ?? b.prix))
    if (sortBy === 'prix-desc') result.sort((a, b) => (b.prixPromo ?? b.prix) - (a.prixPromo ?? a.prix))
    if (sortBy === 'nom') result.sort((a, b) => a.nom.localeCompare(b.nom))
    if (sortBy === 'promo') result.sort((a, b) => (b.discountPercent ?? 0) - (a.discountPercent ?? 0))
    return result
  }, [articles, search, selectedCategorie, priceRange, sortBy, onlyPromo])

  const resetFilters = () => {
    setSearch('')
    setSelectedCategorie('Tous')
    setSortBy('default')
    setPriceRange([0, maxPrice])
    setOnlyPromo(false)
  }

  const activeFiltersCount = [
    search !== '',
    selectedCategorie !== 'Tous',
    sortBy !== 'default',
    priceRange[0] > 0 || priceRange[1] < maxPrice,
    onlyPromo
  ].filter(Boolean).length

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]" data-theme="silk">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-sm font-semibold text-base-content/40">Chargement du catalogue...</p>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white" data-theme="silk">
      {/* ══ Hero Banner ══ */}
      <div className="relative bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 40%)' }} />
        <div className="relative w-[88%] mx-auto py-12">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-cyan-400/70 mb-2">SAV Catalogue</p>
              <h1 className="text-4xl font-black text-white leading-none">
                Nos <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">Articles</span>
              </h1>
              <p className="text-white/40 text-sm mt-2 font-medium">{filtered.length} produit{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}</p>
            </div>
            {/* Search bar */}
            <div className="relative w-80">
              <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher un article..."
                className="w-full pl-10 pr-4 py-3 rounded-2xl bg-white/10 backdrop-blur border border-white/15 text-white text-sm placeholder-white/30 focus:outline-none focus:border-cyan-400/50 transition-all"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                  <X size={13} className="text-white/40 hover:text-white" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="w-[88%] mx-auto py-8">
        <div className="flex gap-7">

          {/* ══ Sidebar Filtres ══ */}
          <aside className="w-64 shrink-0 flex flex-col gap-4">

            {/* Réinitialiser */}
            {activeFiltersCount > 0 && (
              <button onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-error/10 border border-error/20 text-error text-xs font-bold hover:bg-error/20 transition-all">
                <X size={12} /> Réinitialiser ({activeFiltersCount})
              </button>
            )}

            {/* Catégories */}
            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-4 flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-1.5">
                <Tag size={10} /> Catégorie
              </p>
              <div className="flex flex-col gap-1">
                {categories.map(cat => (
                  <button key={cat}
                    onClick={() => setSelectedCategorie(cat)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCategorie === cat
                        ? 'bg-primary text-white'
                        : 'text-base-content/60 hover:bg-base-200'
                    }`}>
                    <span>{cat}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCategorie === cat ? 'bg-white/20' : 'bg-base-200'
                    }`}>
                      {cat === 'Tous' ? articles.length : articles.filter(a => a.categorie?.categorieName === cat).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prix */}
            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-4 flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-1.5">
                <TrendingDown size={10} /> Prix max
              </p>
              <input
                type="range"
                min={0} max={maxPrice}
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], Number(e.target.value)])}
                className="range range-primary range-xs"
              />
              <div className="flex justify-between text-[11px] font-bold text-base-content/50">
                <span>0 DT</span>
                <span className="text-primary">{priceRange[1].toLocaleString()} DT</span>
              </div>
            </div>

            {/* Tri */}
            <div className="bg-base-100 rounded-2xl border border-base-300 shadow-sm p-4 flex flex-col gap-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30 flex items-center gap-1.5">
                <SlidersHorizontal size={10} /> Trier par
              </p>
              {[
                { key: 'default', label: 'Par défaut' },
                { key: 'prix-asc', label: 'Prix croissant' },
                { key: 'prix-desc', label: 'Prix décroissant' },
                { key: 'nom', label: 'Nom A→Z' },
                { key: 'promo', label: 'Meilleures promos' },
              ].map(s => (
                <button key={s.key} onClick={() => setSortBy(s.key)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all text-left ${
                    sortBy === s.key ? 'bg-primary text-white' : 'text-base-content/60 hover:bg-base-200'
                  }`}>
                  {s.label}
                </button>
              ))}
            </div>

            {/* Promo toggle */}
            <div
              onClick={() => setOnlyPromo(p => !p)}
              className={`flex items-center gap-3 px-4 py-3 rounded-2xl border-2 cursor-pointer select-none transition-all ${
                onlyPromo ? 'bg-orange-500/10 border-orange-400/40 text-orange-500' : 'bg-base-100 border-base-300 text-base-content/40'
              }`}>
              <Zap size={14} />
              <span className="text-xs font-bold">Promotions uniquement</span>
              <div className={`ml-auto w-8 h-4 rounded-full flex items-center px-0.5 transition-all ${onlyPromo ? 'bg-orange-400 justify-end' : 'bg-base-300 justify-start'}`}>
                <div className="w-3 h-3 rounded-full bg-white shadow" />
              </div>
            </div>
          </aside>

          {/* ══ Grille Articles ══ */}
          <div className="flex-1 flex flex-col gap-5">

            {/* Toolbar */}
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold text-base-content/50">
                <span className="text-base-content font-extrabold">{filtered.length}</span> résultat{filtered.length > 1 ? 's' : ''}
              </p>
              <div className="flex items-center gap-2">
                <button onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-base-100 border border-base-300 text-base-content/40 hover:text-base-content'}`}>
                  <Grid3X3 size={14} />
                </button>
                <button onClick={() => setViewMode('list')}
                  className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-base-100 border border-base-300 text-base-content/40 hover:text-base-content'}`}>
                  <List size={14} />
                </button>
              </div>
            </div>

            {/* Empty state */}
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/30">
                <Search size={40} strokeWidth={1} />
                <p className="font-bold text-sm">Aucun article trouvé</p>
                <button onClick={resetFilters} className="text-xs text-primary font-bold hover:underline">Réinitialiser les filtres</button>
              </div>
            )}

            {/* Grid View */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map((article, i) => (
                  <div key={article.articleId}
                    onClick={() => navigate(`/articles/${article.articleId}`)}
                    className="group bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 cursor-pointer"
                    style={{ animationDelay: `${i * 40}ms` }}>

                    {/* Image */}
                    <div className="relative h-44 bg-base-200 overflow-hidden">
                      <img
                        src={`https://localhost:7205${article.imageUrl}`}
                        alt={article.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        {article.prixPromo && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black">
                            <Zap size={8} /> -{article.discountPercent}%
                          </span>
                        )}
                        {!article.isActive && (
                          <span className="px-2 py-0.5 rounded-full bg-error text-white text-[10px] font-black">Indisponible</span>
                        )}
                      </div>
                      <div className="absolute top-2 right-2">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur text-white text-[10px] font-bold">
                          <ShieldCheck size={8} /> {article.dureeGarantie} ans
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-2">
                      <div>
                        <p className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">{article.categorie?.categorieName}</p>
                        <h3 className="font-extrabold text-base-content text-sm leading-tight mt-0.5 group-hover:text-primary transition-colors">{article.nom}</h3>
                        <p className="text-[10px] font-mono text-base-content/30 mt-0.5">{article.reference}</p>
                      </div>
                      <p className="text-[11px] text-base-content/50 leading-relaxed line-clamp-2">{article.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex items-baseline gap-2">
                          {article.prixPromo ? (
                            <>
                              <span className="text-base font-extrabold text-primary">{article.prixPromo.toLocaleString()} DT</span>
                              <span className="text-xs text-base-content/30 line-through">{article.prix.toLocaleString()} DT</span>
                            </>
                          ) : (
                            <span className="text-base font-extrabold text-base-content">{article.prix?.toLocaleString()} DT</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="flex flex-col gap-3">
                {filtered.map((article, i) => (
                  <div key={article.articleId}
                    onClick={() => navigate(`/articles/${article.articleId}`)}
                    className="group bg-base-100 border border-base-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:border-primary/30 transition-all duration-150 cursor-pointer flex">

                    {/* Image */}
                    <div className="w-28 h-28 shrink-0 bg-base-200 overflow-hidden">
                      <img
                        src={`https://localhost:7205${article.imageUrl}`}
                        alt={article.nom}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 p-4 flex items-center justify-between gap-4">
                      <div className="flex flex-col gap-1">
                        <p className="text-[10px] font-bold text-base-content/30 uppercase tracking-widest">{article.categorie?.categorieName}</p>
                        <h3 className="font-extrabold text-base-content text-sm group-hover:text-primary transition-colors">{article.nom}</h3>
                        <p className="text-[11px] text-base-content/50 line-clamp-1">{article.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-base-200 border border-base-300 text-[10px] font-bold text-base-content/50">
                            <ShieldCheck size={8} /> {article.dureeGarantie} ans garantie
                          </span>
                          <span className="text-[10px] font-mono text-base-content/25">{article.reference}</span>
                        </div>
                      </div>
                      <div className="shrink-0 flex flex-col items-end gap-1">
                        {article.prixPromo ? (
                          <>
                            <span className="text-lg font-extrabold text-primary">{article.prixPromo.toLocaleString()} DT</span>
                            <span className="text-xs text-base-content/30 line-through">{article.prix.toLocaleString()} DT</span>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black">
                              <Zap size={8} /> -{article.discountPercent}%
                            </span>
                          </>
                        ) : (
                          <span className="text-lg font-extrabold text-base-content">{article.prix?.toLocaleString()} DT</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
