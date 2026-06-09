import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import api from '../api/api'
import {
  ChevronLeft, ShieldCheck, Tag, Hash, Star, Zap,
  Package, Info, CheckCircle, XCircle, Loader2, AlertCircle,
  ShoppingBag, Clock, Award
} from 'lucide-react'

export default function ArticleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [imgLoaded, setImgLoaded] = useState(false)

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await api.get(`/Articles/${id}`)
        setArticle(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticle()
  }, [id])

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4" data-theme="silk">
      <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      <p className="text-sm font-semibold text-base-content/40">Chargement...</p>
    </div>
  )

  if (!article) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3" data-theme="silk">
      <AlertCircle size={36} strokeWidth={1.2} className="text-base-content/30" />
      <p className="text-sm font-bold text-base-content/40">Article introuvable</p>
      <button onClick={() => navigate(-1)} className="btn btn-sm btn-ghost border border-base-300 rounded-xl text-xs">Retour</button>
    </div>
  )

  const hasPromo = article.prixPromo != null
  const economie = hasPromo ? (article.prix - article.prixPromo).toFixed(2) : null

  return (
    <div className="min-h-screen bg-white" data-theme="silk">

      {/* ══ Hero ══ */}
      <div className="relative bg-gradient-to-br from-[#0f0f1a] via-[#1a1a2e] to-[#16213e] overflow-hidden">
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #6366f1 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 40%)' }} />
        <div className="relative w-[88%] mx-auto py-5 flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="btn btn-circle btn-sm bg-white/10 border-white/20 hover:bg-white/20 text-white">
            <ChevronLeft size={16} />
          </button>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-cyan-400/70">
              {article.categorie?.categorieName}
            </p>
            <h1 className="text-xl font-black text-white leading-tight">{article.nom}</h1>
          </div>
        </div>
      </div>

      {/* ══ Content ══ */}
      <div className="w-[88%] mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">

          {/* ── Image col ── */}
          <div className="lg:col-span-2 flex flex-col gap-4">

            {/* Main image */}
            <div className="relative bg-base-100 border border-base-300 rounded-3xl overflow-hidden shadow-lg aspect-square">
              {!imgLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-200">
                  <Loader2 size={24} className="animate-spin text-base-content/20" />
                </div>
              )}
              <img
                src={`https://localhost:7205${article.imageUrl}`}
                alt={article.nom}
                onLoad={() => setImgLoaded(true)}
                className={`w-full h-full object-cover transition-opacity duration-300 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
              />

              {/* Badges overlay */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasPromo && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-500 text-white text-xs font-black shadow-lg">
                    <Zap size={10} /> -{article.discountPercent}%
                  </span>
                )}
                {!article.isActive && (
                  <span className="px-3 py-1 rounded-full bg-error text-white text-xs font-black shadow-lg">
                    Indisponible
                  </span>
                )}
              </div>

              <div className="absolute top-4 right-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/60 backdrop-blur text-white text-xs font-bold">
                  <ShieldCheck size={11} /> {article.dureeGarantie} ans
                </span>
              </div>
            </div>

            {/* Statut disponibilité */}
            <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm font-bold ${
              article.isActive
                ? 'bg-success/10 border-success/25 text-success'
                : 'bg-error/10 border-error/25 text-error'
            }`}>
              {article.isActive
                ? <><CheckCircle size={16} /> Disponible en stock</>
                : <><XCircle size={16} /> Indisponible</>
              }
            </div>
          </div>

          {/* ── Info col ── */}
          <div className="lg:col-span-3 flex flex-col gap-5">

            {/* Prix */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm flex flex-col gap-4">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  {hasPromo ? (
                    <>
                      <div className="flex items-baseline gap-3">
                        <span className="text-3xl font-black text-primary">{article.prixPromo.toLocaleString()} DT</span>
                        <span className="text-lg text-base-content/30 line-through font-medium">{article.prix.toLocaleString()} DT</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-500/10 border border-orange-400/25 text-orange-500 text-xs font-bold">
                          <Zap size={10} /> Vous économisez {economie} DT
                        </span>
                      </div>
                    </>
                  ) : (
                    <span className="text-3xl font-black text-base-content">{article.prix?.toLocaleString()} DT</span>
                  )}
                </div>
              </div>

              {/* Référence + Catégorie */}
              <div className="flex flex-wrap gap-2 pt-2 border-t border-base-200">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200 border border-base-300 text-xs font-bold text-base-content/60">
                  <Hash size={10} /> {article.reference}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-base-200 border border-base-300 text-xs font-bold text-base-content/60">
                  <Tag size={10} /> {article.categorie?.categorieName}
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary/10 border border-primary/20 text-xs font-bold text-primary">
                  <ShieldCheck size={10} /> Garantie {article.dureeGarantie} ans
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/30">
                <Info size={11} /> Description
              </div>
              <p className="text-sm text-base-content/70 leading-relaxed">
                {article.description}
              </p>
            </div>
            
            
            

          </div>
        </div>
      </div>
    </div>
  )
}
