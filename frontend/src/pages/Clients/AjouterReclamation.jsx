import React, { useEffect, useState, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { X, MessageSquareWarning, Shield, ImagePlus, Loader2, FileImage } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import api from '../../api/api';

export default function AjouterReclamation({ open, setOpenPopup, ArticleClient }) {
  const { user } = useContext(AuthContext)
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [file, setFile] = useState(null)
  const [filePreview, setFilePreview] = useState(null)
  const [isGrantie, setIsGarantie] = useState(false)

  const handleFileChange = (e) => {
    const f = e.target.files[0]
    setFile(f)
    if (f) setFilePreview(URL.createObjectURL(f))
  }

  const handleSubmit = async () => {
    if (!description.trim()) return toast.error("La description est obligatoire !")
    if (isGrantie && !file) return toast.error("L'image de garantie est obligatoire !")

    const formData = new FormData()
    formData.append("Description", description)
    formData.append("ArticleClientId", ArticleClient.articleClientId)
    formData.append("UtilisateurId", ArticleClient.utilisateurId)
    if (isGrantie) formData.append("ImageGarantie", file)

    try {
      setLoading(true)
      const res = await api.post("/Reclamation", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${user.token}`
        },
      })
      toast.success("Réclamation créée avec succès !")
      setOpenPopup(false)
      window.location.reload()
    } catch (err) {
      toast.error("Erreur lors de la création de la réclamation.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setOpenPopup(false)
    setDescription("")
    setFile(null)
    setFilePreview(null)
    setIsGarantie(false)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <ToastContainer />

      {/* Modal */}
      <div
        data-theme="silk"
        className="bg-base-100 rounded-2xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-base-300"
      >

        {/* ══ Header ══ */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-base-200 bg-base-200">
          <div className="p-2 bg-primary/10 rounded-xl">
            <MessageSquareWarning size={18} className="text-primary" />
          </div>
          <div className="flex-1">
            <h2 className="text-sm font-extrabold text-base-content leading-none">Nouvelle réclamation</h2>
            {ArticleClient?.articleNom && (
              <p className="text-[11px] text-base-content/45 mt-0.5 truncate">{ArticleClient.articleNom}</p>
            )}
          </div>
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm btn-circle text-base-content/40 hover:text-base-content"
          >
            <X size={16} />
          </button>
        </div>

        {/* ══ Body ══ */}
        <div className="px-6 py-5 flex flex-col gap-5">

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
              Description <span className="text-error">*</span>
            </label>
            <textarea
              placeholder="Décrivez votre problème en détail..."
              className="textarea textarea-bordered rounded-xl w-full text-sm resize-none h-28 bg-base-100 focus:outline-none focus:border-primary transition-colors"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <p className="text-[10px] text-base-content/30 text-right">{description.length} / 1000</p>
          </div>

          {/* Garantie toggle */}
          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="checkbox checkbox-primary"
                  checked={isGrantie}
                  onChange={(e) => {
                    setIsGarantie(e.target.checked)
                    if (!e.target.checked) { setFile(null); setFilePreview(null) }
                  }}
                />
              </div>
              <div className="flex items-center gap-2">
                <Shield size={14} className={isGrantie ? "text-primary" : "text-base-content/30"} />
                <span className="text-sm font-bold text-base-content/70 group-hover:text-base-content transition-colors">
                  Joindre une preuve de garantie
                </span>
              </div>
            </label>

            {/* File upload */}
            {isGrantie && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-base-content/60 uppercase tracking-wider">
                  Image de garantie <span className="text-error">*</span>
                </label>

                {/* Preview ou dropzone */}
                {filePreview ? (
                  <div className="relative rounded-xl overflow-hidden border border-base-300 aspect-video bg-base-200">
                    <img src={filePreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setFile(null); setFilePreview(null) }}
                      className="absolute top-2 right-2 btn btn-xs btn-circle bg-black/50 border-0 text-white hover:bg-black/70"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-base-300 bg-base-200 hover:border-primary hover:bg-primary/5 transition-all duration-150 cursor-pointer">
                    <ImagePlus size={22} className="text-base-content/30" />
                    <span className="text-xs font-semibold text-base-content/45">Cliquez pour choisir une image</span>
                    <span className="text-[10px] text-base-content/30">PNG, JPG, WEBP</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            )}
          </div>

        </div>

        {/* ══ Footer ══ */}
        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-base-200 bg-base-200">
          <button
            onClick={handleClose}
            className="btn btn-ghost btn-sm rounded-xl border border-base-300 font-bold text-xs"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !description.trim()}
            className="btn btn-primary btn-sm rounded-xl font-bold text-xs gap-2 disabled:opacity-50"
          >
            {loading
              ? <><Loader2 size={13} className="animate-spin" /> Envoi...</>
              : <><MessageSquareWarning size={13} /> Soumettre</>
            }
          </button>
        </div>

      </div>
    </div>
  )
}