import React, { useState, useContext } from 'react'
import { Wrench, Loader2, Shield, ShieldOff } from 'lucide-react'
import api from '../../api/api'
import { toast } from 'react-toastify'
import { AuthContext } from '../../context/AuthContext'

export default function AjouterIntervention({ setShowInterventionModal, reclamation, setReclamation }) {

  const [interventionNote, setInterventionNote]     = useState('')
  const [addingIntervention, setAddingIntervention] = useState(false)
  const [estSousGarantie, setEstSousGarantie]       = useState(false)
  const [coutMainOeuvre, setCoutMainOeuvre]         = useState(0)
  const [coutPieces, setCoutPieces]                 = useState(0)
  const { user } = useContext(AuthContext)

  const handleAjouterIntervention = async () => {
    try {
      setAddingIntervention(true)
      await api.post(
        `/Intervention`,
        {
          reclamationId:  reclamation.reclamationId,
          description:    interventionNote,
          estSousGarantie,
          coutMainOeuvre: estSousGarantie ? 0 : coutMainOeuvre,
          coutPieces:     estSousGarantie ? 0 : coutPieces,
        },
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-base-100 rounded-2xl shadow-2xl border border-base-300 w-full max-w-md mx-4 p-6 flex flex-col gap-5">

        {/* ── Header ── */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <Wrench size={16} className="text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-extrabold text-base-content">Ajouter une intervention</h2>
            <p className="text-[11px] text-base-content/40">Réclamation #{reclamation.reclamationId}</p>
          </div>
        </div>

        {/* ── Toggle garantie ── */}
        <div
          onClick={() => setEstSousGarantie(prev => !prev)}
          className={`flex items-center justify-between px-4 py-3 rounded-xl border-2 cursor-pointer select-none transition-all duration-150
            ${estSousGarantie
              ? 'bg-success/10 border-success/40 text-success'
              : 'bg-base-200 border-base-300 text-base-content/50'}`}
        >
          <div className="flex items-center gap-2 text-xs font-bold">
            {estSousGarantie ? <Shield size={14} /> : <ShieldOff size={14} />}
            {estSousGarantie ? 'Sous garantie — gratuite' : 'Hors garantie — coûts applicables'}
          </div>
          <div className={`w-9 h-5 rounded-full flex items-center px-0.5 transition-all duration-200
            ${estSousGarantie ? 'bg-success justify-end' : 'bg-base-300 justify-start'}`}>
            <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
          </div>
        </div>

        {/* ── Coûts — masqués si sous garantie ── */}
        {!estSousGarantie && (
          <div className="flex flex-col gap-3">
            <p className="text-xs font-black uppercase tracking-widest text-base-content/30">Coûts</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-base-content/50">Main d'œuvre (DT)</label>
                <input
                  type="number" min={0} step={0.5}
                  value={coutMainOeuvre}
                  onChange={e => setCoutMainOeuvre(parseFloat(e.target.value) || 0)}
                  className="input input-bordered input-sm rounded-xl text-sm focus:outline-none focus:border-primary w-full"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11px] font-bold text-base-content/50">Pièces (DT)</label>
                <input
                  type="number" min={0} step={0.5}
                  value={coutPieces}
                  onChange={e => setCoutPieces(parseFloat(e.target.value) || 0)}
                  className="input input-bordered input-sm rounded-xl text-sm focus:outline-none focus:border-primary w-full"
                />
              </div>
            </div>
            {/* Total */}
            <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-base-200 border border-base-300">
              <span className="text-xs font-bold text-base-content/50">Total estimé</span>
              <span className="text-sm font-extrabold text-base-content">
                {(coutMainOeuvre + coutPieces).toFixed(2)} DT
              </span>
            </div>
          </div>
        )}

        {/* ── Description ── */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-base-content/50 uppercase tracking-widest">
            Description (optionnelle)
          </label>
          <textarea
            rows={3}
            value={interventionNote}
            onChange={e => setInterventionNote(e.target.value)}
            placeholder="Décrivez l'intervention effectuée..."
            className="textarea textarea-bordered rounded-xl text-sm resize-none focus:outline-none focus:border-primary w-full"
          />
        </div>

        {/* ── Actions ── */}
        <div className="flex gap-2 justify-end pt-1">
          <button
            onClick={() => { setShowInterventionModal(false); setInterventionNote('') }}
            className="btn btn-sm btn-ghost border border-base-300 rounded-xl text-xs"
            disabled={addingIntervention}
          >
            Annuler
          </button>
          <button
            onClick={handleAjouterIntervention}
            disabled={addingIntervention}
            className="btn btn-sm btn-primary rounded-xl text-xs font-bold"
          >
            {addingIntervention
              ? <><Loader2 size={12} className="animate-spin" /> En cours...</>
              : <><Wrench size={12} /> Confirmer</>
            }
          </button>
        </div>

      </div>
    </div>
  )
}