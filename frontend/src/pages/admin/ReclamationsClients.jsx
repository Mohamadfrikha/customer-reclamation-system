import React from 'react'
import { useState, useEffect ,useContext} from 'react'
import { useNavigate } from 'react-router'
import api from '../../api/api'
import { Search, ChevronLeft, ChevronRight, Package, Shield, Clock,
  MessageSquareWarning, CheckCircle, ShieldOff, ExternalLink, Loader2, Trash2,Eye} from 'lucide-react'

  import { AuthContext } from '../../context/AuthContext';
import { ToastContainer, toast } from "react-toastify";
export default function ReclamationsClients() {
    const {user} = useContext(AuthContext)
    const [reclamations, setReclamations] = useState([]);
    const [loading, setLoading] = useState(false);
    const [search, setSearch] = useState("")
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatut, setFilterStatut] = useState("tous")
    
    const navigate = useNavigate()

      const ITEMS_PER_PAGE = 5
    const getReclamations = async () => {
    try {
      setLoading(true)
      const response = await api.get(`Reclamation`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setReclamations(response.data)
    } catch (err) {
      console.error("Erreur lors de la récupération des réclamations:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getReclamations()
  }, [])
    const filtered = reclamations.filter((r) => {
    const matchSearch = (r.description?.toLowerCase().includes(search.toLowerCase())
    ||r.utilisateurNom.toLowerCase().includes(search.toLowerCase())
    ||r.utilisateurPrenom.toLowerCase().includes(search.toLowerCase())||
    r.utilisateurEmail.toLowerCase().includes(search.toLowerCase())||
    r.articleNom.toLowerCase().includes(search.toLowerCase())||
    r.articleReference.toLowerCase().includes(search.toLowerCase())
    ) 

    const matchStatut = filterStatut === "tous" || r.statut === filterStatut
    return matchSearch && matchStatut
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

    useEffect(() => { setCurrentPage(1) }, [search, filterStatut])

    

  const StatusBadge = ({ statut }) => {
    const config = {
      EnAttente: { cls: "bg-warning/10 text-warning border-warning/30",  label: "En attente", icon: <Clock size={10} /> },
      Acceptee:  { cls: "bg-info/10 text-info border-info/30",            label: "Acceptée",   icon: <CheckCircle size={10} /> },
      Rejetee:   { cls: "bg-error/10 text-error border-error/30",         label: "Rejetée",    icon: <ShieldOff size={10} /> },
      Traitee:   { cls: "bg-success/10 text-success border-success/30",   label: "Traitée",    icon: <Shield size={10} /> },
    }
    const s = config[statut] ?? config.EnAttente
    return (
      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${s.cls}`}>
        {s.icon} {s.label}
      </span>
    )
  }
  console.log(reclamations)
  return (
    <div className="w-[85%] mx-auto mt-8 space-y-6 bg-white" data-theme="silk">
      <ToastContainer />

      {/* ══ Header ══ */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn btn-circle btn-ghost">
          <MessageSquareWarning />
        </button>
        <h1 className="text-2xl font-semibold">Réclamations </h1>
      </div>



      <div className="bg-base-100 border border-base-300 rounded-2xl px-4 py-3 shadow-sm">
        <div className="flex flex-wrap items-center gap-2">

          {[
            { key: "tous",      label: "Tous",       icon: <Package size={12} /> },
            { key: "EnAttente", label: "En attente", icon: <Clock size={12} /> },
            { key: "Acceptee",  label: "Acceptées",  icon: <CheckCircle size={12} /> },
            { key: "Rejetee",   label: "Rejetées",   icon: <ShieldOff size={12} /> },
            { key: "Traitee",   label: "Traitées",   icon: <Shield size={12} /> },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilterStatut(f.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all duration-150 ${
                filterStatut === f.key
                  ? "bg-base-content text-base-100 border-base-content shadow-sm scale-[1.02]"
                  : "bg-base-100 text-base-content/45 border-base-300 hover:border-base-content/30 hover:text-base-content/70"
              }`}
            >
              {f.icon} {f.label}
            </button>
          ))}

          <div className="w-px h-5 bg-base-300 mx-0.5 shrink-0" />

          <div className="relative flex-1 min-w-[160px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/30 w-3.5 h-3.5 pointer-events-none" />
            <input
              type="text"
              placeholder="Rechercher dans les descriptions..."
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
            {filtered.length} résultat{filtered.length !== 1 ? "s" : ""}
          </span>

        </div>
      </div>

      {/* ══ Loading ══ */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-base-content/35">
          <Loader2 size={32} className="animate-spin text-primary" />
          <p className="text-sm font-medium">Chargement des réclamations...</p>
        </div>
      )}

      {/* ══ Empty state ══ */}
      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-base-content/40 bg-base-100 border border-base-300 rounded-2xl">
          <div className="p-4 bg-base-200 rounded-full">
            <MessageSquareWarning size={28} strokeWidth={1.3} />
          </div>
          <p className="text-sm font-bold text-base-content/50">Aucune réclamation</p>
          <p className="text-xs">Essayez de modifier vos filtres ou votre recherche.</p>
          <button
            className="btn btn-sm btn-ghost border border-base-300 rounded-xl mt-1 text-xs"
            onClick={() => { setSearch(""); setFilterStatut("tous") }}
          >
            Réinitialiser les filtres
          </button>
        </div>
      )}

      {/* ══ Liste Réclamations ══ */}
      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-3">
          {paginated.map((r) => (
            <div key={r.reclamationId} className="bg-base-100 border border-base-300 rounded-2xl p-4 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow duration-200">

                
              {/* Top : statut + date */}
              <div className="flex items-center justify-between">
                <StatusBadge statut={r.statut} />
                <span className="flex items-center gap-1 text-[11px] text-base-content/35 font-medium">
                  <Clock size={10} />
                  {new Date(r.dateReclamation).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                </span>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2  rounded-xl border border-base-300 w-fit">
                <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-base-300">
                    <img
                    src={`https://localhost:7205${r.articleImageUrl}`}
                    alt={r.articleNom}
                    className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <p className="text-xs font-extrabold text-base-content leading-none">{r.articleNom}</p>
                    <p className="text-[10px] font-mono text-base-content/40 mt-0.5 uppercase">{r.articleReference}</p>
                </div>
                </div>  

              {/* Description */}
              <p className="text-sm text-base-content/70 leading-relaxed line-clamp-3">
                {r.description}
              </p>

              {/* Footer : client + actions */}
              <div className="flex items-center justify-between pt-2 border-t border-base-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[11px] font-black uppercase">
                    {r.utilisateurPrenom?.[0]}{r.utilisateurNom?.[0]}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-base-content leading-none">{r.utilisateurPrenom} {r.utilisateurNom}</p>
                    <p className="text-[10px] text-base-content/40 mt-0.5">{r.utilisateurEmail}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {r.aIntervention && (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 border border-primary/20 px-2.5 py-1 rounded-full">
                      <Shield size={10} /> Intervention
                    </span>
                  )}
                  
                   <button
                        onClick={() => navigate(`/Admin/reclamation/${r.reclamationId}`)}
                        className="group/view p-1.5 rounded-xl border border-info/30 bg-info/5 text-info hover:bg-info hover:text-white hover:border-info transition-all duration-150"
                        >
                        <Eye size={13} className="group-hover/view:scale-110 transition-transform duration-150" />
                        </button> 

                  

                  
                </div>
              </div>

              {/* Lien garantie */}
              {r.imageGarantie && (
                
                <a  href={`https://localhost:7205${r.imageGarantie}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 bg-base-200 hover:bg-base-300 transition-colors duration-150 w-fit"
                >
                  <ExternalLink size={13} className="text-primary shrink-0" />
                  <span className="text-xs font-bold text-base-content/70">Voir preuve de garantie</span>
                </a>
              )}

            </div>
          ))}
        </div>
      )}

      {/* ══ Pagination ══ */}
      {!loading && totalPages >= 1 && (
        <div className="flex items-center justify-center gap-1.5 pt-2 pb-6">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="btn btn-sm btn-ghost  border border-base-300 rounded-xl disabled:opacity-25"
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
  )
}
