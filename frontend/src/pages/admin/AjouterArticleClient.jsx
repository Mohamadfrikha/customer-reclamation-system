import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import api from '../../api/api';

export default function AjouterArticleClient({ open, setOpenPopup, article }) {

  const { user } = useContext(AuthContext)
  const [cin, setCin] = useState("")
  const [loading, setLoading] = useState(false)
  const [clientId, setClientId] = useState("")
  const [clientTrouve, setClientTrouve] = useState(null)
  const navigate = useNavigate()

  const getUserByCIN = async () => {
    if (!cin) return toast.warning("Entrez un CIN !")
      if (!/^\d{8}$/.test(cin)) {
        toast.error("Le CIN doit contenir 8 chiffres");
        return;
      }
    try {
      const res = await api.get(`/Auth/byCin/${cin}`, {
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      setClientId(res.data.id)
      setClientTrouve(res.data)
      toast.success("Client trouvé ✅")
    } catch (err) {
      setClientTrouve(null)
      setClientId("")
      toast.error("Client introuvable ❌")
    }
  }

  const handleSubmit = async () => {
    if (!clientId) return toast.warning("Cherchez un client d'abord !")
    setLoading(true)
    try {
      await api.post("/ArticleClient", {
        dateAchat: new Date().toISOString(),
        dureeGarantie: article.dureeGarantie,
        utilisateurId: clientId,
        articleId: article.articleId
      }, {
        headers: { "Authorization": `Bearer ${user.token}` }
      });
      toast.success("Article ajouté avec succès !");
      setOpenPopup(false);
      navigate(0);
    } catch (err) {
      toast.error("Erreur lors de l'ajout !")
      console.error(err);
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-1/3 p-6 relative">
        <ToastContainer />
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
          onClick={() => {setOpenPopup(false)
            setClientTrouve(null)
            setCin("")
           }}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
          Ajouter un article client
        </h2>

        {/* Recherche par CIN */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="CIN client"
            className="input input-bordered w-full"
            value={cin}
            maxLength={8}
            onChange={(e) => setCin(e.target.value)}
          />
          <button
            className="btn btn-secondary"
            onClick={getUserByCIN}
          >
            Chercher
          </button>
        </div>

        {/* Affichage client trouvé */}
        {clientTrouve && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-sm">
            <p><span className="font-semibold">Nom :</span> {clientTrouve.firstName} {clientTrouve.lastName}</p>
            <p><span className="font-semibold">Email :</span> {clientTrouve.email}</p>
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            className="btn btn-outline px-4 py-2 rounded-lg hover:bg-gray-100 transition"
            onClick={() => setOpenPopup(false)}
          >
            Annuler
          </button>
          <button
            className="btn btn-primary px-4 py-2 rounded-lg hover:shadow-lg transition"
            onClick={handleSubmit}
            disabled={loading || !clientId}
          >
            {loading ? "Chargement..." : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  )
}