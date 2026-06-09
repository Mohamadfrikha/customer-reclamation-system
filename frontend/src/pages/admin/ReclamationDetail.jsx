import React, { useState, useEffect, useContext } from 'react'
import { useNavigate, useParams } from 'react-router'
import api from '../../api/api'
import {
  ChevronLeft, Shield, ShieldOff, Clock, MessageSquareWarning,
  CheckCircle, ExternalLink, Loader2, User, Package, Hash,
  AlertCircle, Phone, Wrench ,Euro         // ← ajout Wrench
} from 'lucide-react'
import { AuthContext } from '../../context/AuthContext'
import { ToastContainer, toast } from 'react-toastify'
import AjouterIntervention from './AjouterIntervention'

export default function ReclamationDetail() {
  const { id } = useParams()
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [reclamation, setReclamation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [articleClient, setArticleClient] = useState(null)

  // ── Intervention ──────────────────────────────────────────
  const [showInterventionModal, setShowInterventionModal] = useState(false)
  const [interventionNote, setInterventionNote] = useState('')
  const [addingIntervention, setAddingIntervention] = useState(false)

  const handleAjouterIntervention = async () => {
    try {
      setAddingIntervention(true)
      await api.post(
        `/Intervention`,
        { reclamationId: reclamation.reclamationId, note: interventionNote },
        { headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' } }
      )
      setReclamation(prev => ({ ...prev, aIntervention: true }))
      setShowInterventionModal(false)
      setInterventionNote('')
      toast.success('Intervention ajoutée avec succès.')
    } catch (err) {
      toast.error("Erreur lors de l'ajout de l'intervention.")
      console.error(err)
    } finally {
      setAddingIntervention(false)
    }
  }
  // ─────────────────────────────────────────────────────────

  const getArticleClient = async (articleClientId) => {
    try {
      const res = await api.get(`ArticleClient/${articleClientId}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setArticleClient(res.data)
    } catch (err) { console.error(err) }
  }

  const getReclamation = async () => {
    try {
      setLoading(true)
      const res = await api.get(`/Reclamation/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      setReclamation(res.data)
      await getArticleClient(res.data.articleClientId)
    } catch (err) {
      console.error(err)
      toast.error('Erreur lors du chargement.')
    } finally {
      setLoading(false)
    }
  }

  const statutMap = { EnAttente: 0, Acceptee: 1, Rejetee: 2, Traitee: 3 }

  const allowedTransitions = {
    EnAttente: ['Acceptee', 'Rejetee'],
    Acceptee:  ['Rejetee'],
    Rejetee:   [],
    Traitee:   [],
  }

  const handleUpdateStatut = async (statut) => {
    try {
      setUpdating(true)
      await api.put(`/Reclamation/statut/${id}`, { statut: statutMap[statut] }, {
        headers: { Authorization: `Bearer ${user.token}`, 'Content-Type': 'application/json' }
      })
      setReclamation(prev => ({ ...prev, statut }))
      toast.success(`Statut mis à jour : ${statut}`)
    } catch (err) {
      toast.error('Erreur lors de la mise à jour.')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => { getReclamation() }, [id])
  console.log("Reclamation data:", reclamation)
  const isAdmin = user?.roles?.includes('Admin')
  const StatusBadge = ({ statut }) => {
    const config = {
      EnAttente: { cls: 'bg-warning/10 text-warning border-warning/30',  label: 'En attente', icon: <Clock size={11} /> },
      Acceptee:  { cls: 'bg-info/10 text-info border-info/30',            label: 'Acceptée',   icon: <CheckCircle size={11} /> },
      Rejetee:   { cls: 'bg-error/10 text-error border-error/30',         label: 'Rejetée',    icon: <ShieldOff size={11} /> },
      Traitee:   { cls: 'bg-success/10 text-success border-success/30',   label: 'Traitée',    icon: <Shield size={11} /> },
    }
    const s = config[statut] ?? config.EnAttente
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${s.cls}`}>
        {s.icon} {s.label}
      </span>
    )
  }

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-base-content/35" data-theme="silk">
      <Loader2 size={32} className="animate-spin text-primary" />
      <p className="text-sm font-medium">Chargement de la réclamation...</p>
    </div>
  )

  if (!reclamation) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-base-content/40" data-theme="silk">
      <AlertCircle size={32} strokeWidth={1.3} />
      <p className="text-sm font-bold">Réclamation introuvable</p>
      <button onClick={() => navigate(-1)} className="btn btn-sm btn-ghost border border-base-300 rounded-xl text-xs">Retour</button>
    </div>
  )

  const isStatutFinal = ['Rejetee', 'Traitee'].includes(reclamation.statut)

  return (
    <div className="w-[85%] mx-auto mt-8 space-y-6 bg-white" data-theme="silk">
      <ToastContainer />
      {/* ══ Header ══ */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn btn-circle btn-ghost">
          <ChevronLeft />
        </button>
        <div className="flex-1">
          <h1 className="text-xl font-extrabold text-base-content leading-none">
            Réclamation <span className="text-base-content/30">#{reclamation.reclamationId}</span>
          </h1>
          <p className="text-xs text-base-content/40 mt-0.5 flex items-center gap-1">
            <Clock size={10} />
            {new Date(reclamation.dateReclamation).toLocaleString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
          </p>
        </div>
        <StatusBadge statut={reclamation.statut} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* ══ Colonne gauche ══ */}
        <div className="lg:col-span-2 flex flex-col gap-5">

          {/* Article */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/30">
              <Package size={12} /> Article concerné
            </div>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-base-300 bg-base-200">
                <img
                  src={`https://localhost:7205${reclamation.articleImageUrl}`}
                  alt={reclamation.articleNom}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col gap-1">
                <h2 className="font-extrabold text-base-content text-base leading-tight">{reclamation.articleNom}</h2>
                <p className="text-[11px] font-mono text-base-content/35 uppercase">{reclamation.articleReference}</p>
                {articleClient && (
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {articleClient.garantieActive ? (
                      <div className="inline-flex items-center gap-1 bg-success/10 border border-success/25 px-2 py-0.5 rounded-full text-[10px] font-bold text-success">
                        <Shield size={8} /> Garantie active — {articleClient.joursRestantsGarantie}j restants
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-error/10 border border-error/25 px-2 py-0.5 rounded-full text-[10px] font-bold text-error">
                        <ShieldOff size={8} /> Garantie expirée
                      </div>
                    )}
                    {articleClient.dateAchat && (
                      <div className="inline-flex items-center gap-1 bg-base-200 border border-base-300 px-2 py-0.5 rounded-full text-[10px] font-medium text-base-content/50">
                        <Clock size={8} />
                        Acheté le {new Date(articleClient.dateAchat).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                    {articleClient.dateFinGarantie && (
                      <div className="inline-flex items-center gap-1 bg-base-200 border border-base-300 px-2 py-0.5 rounded-full text-[10px] font-medium text-base-content/50">
                        <Clock size={8} />
                        Expire le {new Date(articleClient.dateFinGarantie).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/30">
              <MessageSquareWarning size={12} /> Description
            </div>
            <p className="text-sm text-base-content/70 leading-relaxed">{reclamation.description}</p>
          </div>

          {/* Preuve garantie */}
          {reclamation.imageGarantie && (
            <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
              <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/30">
                <Shield size={12} /> Preuve de garantie
              </div>
              
              <a  href={`https://localhost:7205${reclamation.imageGarantie}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-xl border border-base-300 bg-base-200 hover:bg-base-300 transition-colors duration-150 w-fit"
              >
                <ExternalLink size={13} className="text-primary shrink-0" />
                <span className="text-xs font-bold text-base-content/70">Ouvrir en plein écran</span>
              </a>
            </div>
          )}

          {reclamation.interventionTechnique && (
            <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
              
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/30">
                  <Wrench size={12} /> Intervention technique
                </div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                  reclamation.interventionTechnique.estGratuite
                    ? 'bg-success/10 text-success border-success/25'
                    : 'bg-warning/10 text-warning border-warning/25'
                }`}>
                  {reclamation.interventionTechnique.estGratuite
                    ? <><Shield size={9} /> Gratuite</>
                    : <><Euro size={9} /> Payante</>
                  }
                </span>
              </div>

              {/* Date */}
              <div className="flex items-center gap-2 text-[11px] text-base-content/50">
                <Clock size={10} />
                Effectuée le{' '}
                <span className="font-bold text-base-content">
                  {new Date(reclamation.interventionTechnique.dateIntervention)
                    .toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30">Description</p>
                <p className="text-sm text-base-content/70 leading-relaxed">
                  {reclamation.interventionTechnique.description}
                </p>
              </div>

              {/* Garantie badge */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-bold ${
                reclamation.interventionTechnique.estSousGarantie
                  ? 'bg-success/10 border-success/25 text-success'
                  : 'bg-error/10 border-error/25 text-error'
              }`}>
                {reclamation.interventionTechnique.estSousGarantie
                  ? <><Shield size={12} /> Sous garantie constructeur</>
                  : <><ShieldOff size={12} /> Hors garantie</>
                }
              </div>

              {/* Coûts — affichés seulement si payante */}
              {!reclamation.interventionTechnique.estGratuite && (
                <div className="flex flex-col gap-2 pt-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-base-content/30">Coûts</p>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex flex-col gap-0.5 bg-base-200 rounded-xl p-3 border border-base-300">
                      <span className="text-[10px] text-base-content/40 font-bold">Main d'œuvre</span>
                      <span className="text-sm font-extrabold text-base-content">
                        {reclamation.interventionTechnique.coutMainOeuvre.toFixed(2)} DT
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 bg-base-200 rounded-xl p-3 border border-base-300">
                      <span className="text-[10px] text-base-content/40 font-bold">Pièces</span>
                      <span className="text-sm font-extrabold text-base-content">
                        {reclamation.interventionTechnique.coutPieces.toFixed(2)} DT
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5 bg-primary/5 rounded-xl p-3 border border-primary/20">
                      <span className="text-[10px] text-primary/60 font-bold">Total</span>
                      <span className="text-sm font-extrabold text-primary">
                        {(reclamation.interventionTechnique.coutMainOeuvre + reclamation.interventionTechnique.coutPieces).toFixed(2)} DT
                      </span>
                    </div>
                  </div>
                </div>
              )}

              
            </div>
          )}

        </div>

        {/* ══ Colonne droite ══ */}
        <div className="flex flex-col gap-5">

          {/* Client */}
          <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm flex flex-col gap-4">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/30">
              <User size={12} /> Client
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-black uppercase shrink-0">
                {reclamation.utilisateurPrenom?.[0]}{reclamation.utilisateurNom?.[0]}
              </div>
              <div>
                <p className="text-sm font-extrabold text-base-content leading-none">
                  {reclamation.utilisateurPrenom} {reclamation.utilisateurNom}
                </p>
                <p className="text-[11px] text-base-content/40 mt-0.5">{reclamation.utilisateurEmail}</p>
              </div>
            </div>
            <div className="flex flex-col gap-1.5 pt-3 border-t border-base-200">
              <div className="flex items-center gap-2 text-[11px] text-base-content/50">
                <Hash size={10} />
                CIN : <span className="font-bold text-base-content">{reclamation.utilisateurCIN}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-base-content/50">
                <Phone size={10} />
                Tél : <span className="font-bold text-base-content">{reclamation.phoneNumber}</span>
              </div>
            </div>
          </div>

          

          {/* Changer statut */}
          {isAdmin && (
          <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/30">
              <CheckCircle size={12} /> Changer le statut
            </div>

            {isStatutFinal ? (
              <div className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-bold ${
                reclamation.statut === 'Traitee'
                  ? 'bg-success/10 border-success/25 text-success'
                  : 'bg-error/10 border-error/25 text-error'
              }`}>
                {reclamation.statut === 'Traitee' ? <Shield size={13} /> : <ShieldOff size={13} />}
                Réclamation {reclamation.statut === 'Traitee' ? 'traitée' : 'rejetée'} — aucune modification possible
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {[
                  { key: 'Acceptee', label: 'Accepter',        cls: 'border-info/40 text-info hover:bg-info hover:text-white hover:border-info' },
                  { key: 'Rejetee',  label: 'Rejeter',         cls: 'border-error/40 text-error hover:bg-error hover:text-white hover:border-error' },
                  //{ key: 'Traitee',  label: 'Marquer traitée', cls: 'border-success/40 text-success hover:bg-success hover:text-white hover:border-success' },
                ].map(s => {
                  const isCurrentStatut = reclamation.statut === s.key
                  const isAllowed = allowedTransitions[reclamation.statut]?.includes(s.key)
                  const isDisabled = updating || isCurrentStatut || !isAllowed
                  return (
                    <button
                      key={s.key}
                      onClick={() => handleUpdateStatut(s.key)}
                      disabled={isDisabled}
                      className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl border text-xs font-bold transition-all duration-150 disabled:opacity-30 disabled:cursor-not-allowed ${s.cls}`}
                    >
                      {updating ? <Loader2 size={12} className="animate-spin" /> : s.label}
                      {isCurrentStatut && <span className="text-[10px] opacity-60">(actuel)</span>}
                    </button>
                  )
                })}
              </div>
            )}
          </div>)}

          {/* Intervention badge OU bouton ajout */}
          {reclamation.aIntervention ? (
            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center gap-3">
              <Shield size={16} className="text-primary shrink-0" />
              <p className="text-xs font-bold text-primary">Intervention effectuée</p>
            </div>
          ) : (<>{isAdmin && (
            <button
              onClick={() => setShowInterventionModal(true)}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-2xl border-2 border-dashed border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/60 transition-all duration-150 text-xs font-bold w-full"
            >
              <Wrench size={13} />
              Ajouter une intervention
            </button>)}</>
          )}

          {/* ══ Modale Ajout Intervention ══ */}
            {showInterventionModal  && (
        <AjouterIntervention reclamation={reclamation} setShowInterventionModal={setShowInterventionModal} setReclamation={setReclamation}/>
          )}

          {/* ══ Facture ══ */}
    {reclamation.interventionTechnique?.facture && (
      <div className="bg-base-100 border border-base-300 rounded-2xl p-5 shadow-sm flex flex-col gap-3">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-base-content/30">
            <Euro size={12} /> Facture
          </div>
          <span className="text-[10px] font-mono text-base-content/30">
            N° {String(reclamation.interventionTechnique.facture.factureId).padStart(6, '0')}
          </span>
        </div>

        {/* Date */}
        <div className="flex items-center gap-2 text-[11px] text-base-content/50">
          <Clock size={10} />
          Émise le{' '}
          <span className="font-bold text-base-content">
            {new Date(reclamation.interventionTechnique.facture.dateFacture)
              .toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
          </span>
        </div>

        {/* Montant */}
        <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-base-200 border border-base-300">
          <span className="text-xs font-bold text-base-content/50">Montant total</span>
          <span className={`text-sm font-extrabold ${
            reclamation.interventionTechnique.facture.montantTotal === 0
              ? 'text-success'
              : 'text-base-content'
          }`}>
            {reclamation.interventionTechnique.facture.montantTotal === 0
              ? 'Gratuit'
              : `${reclamation.interventionTechnique.facture.montantTotal.toFixed(2)} DT`
            }
          </span>
        </div>

        {/* Télécharger PDF */}
        {reclamation.interventionTechnique.facture.pdfPath && (
          
        <a   href={`https://localhost:7205${reclamation.interventionTechnique.facture.pdfPath}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all duration-150"
          >
            <ExternalLink size={12} />
            Télécharger la facture PDF
          </a>
        )}

          </div>
        )}
        </div>
      </div>
    </div>
  )
}