import React, { useEffect, useState, useContext } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { X } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import api from '../../api/api';

export default function EditArticle({ openEdit, setOpenPopupEdit, articleId }) {
  const [isSold, setIsSold] = useState(false);
  const { user } = useContext(AuthContext)
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState(null);
  const [prix, setPrix] = useState("");
  const [DureeGarantie, setDureeGarantie] = useState("");
  const [reference, setReference] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [categories, setCategories] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);

  const getArticle = async () => {
    if (!articleId) return;
    try {
      const res = await api.get(`Articles/${articleId}`);
      if (res.status === 200) {
        const a = res.data;
        setNom(a.nom ?? "");
        setDescription(a.description ?? "");
        setPrix(a.prix ?? "");
        setDureeGarantie(a.dureeGarantie ?? "");
        setReference(a.reference ?? "");
        setSelectedCategory(a.categorieId ?? "");
        if(a.discountPercent>0){
            setIsSold(true);
            setDiscountPercent(a.discountPercent ?? 0);}
      }
    } catch (error) {
      console.error("Erreur récupération article:", error);
    }
  }

  const getCategoryName = async () => {
    try {
      const res = await api.get("Categories");
      if (res.status === 200) setCategories(res.data);
    } catch (error) {
      console.error("Erreur récupération catégories:", error);
    }
  }

  useEffect(() => {
    if (openEdit) {
      getArticle();
      getCategoryName();
    }
  }, [articleId, openEdit]);

  const handleSubmit = async () => {
    if (!nom) return toast.error("Le nom est obligatoire !");
    if (!prix) return toast.error("Le prix est obligatoire !");
    if (!reference) return toast.error("La référence est obligatoire !");
    if (!selectedCategory) return toast.error("Veuillez choisir une catégorie !");

    const formData = new FormData();
    formData.append("ArticleId",articleId);
    formData.append("nom", nom);
    formData.append("dureeGarantie", DureeGarantie);
    formData.append("description", description);
    formData.append("prix", prix);
    formData.append("categorieId", selectedCategory);
    formData.append("reference", reference);
    if (file) formData.append("imageFile", file);
    formData.append("discountPercent", discountPercent ?? 0);

    // 👇 debug — montre exactement ce qui est envoyé
    for (let [key, val] of formData.entries()) {
      console.log(`formData → ${key}:`, val);
    }

    try {
      setLoading(true)
      const res = await api.put(`/Articles/${articleId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${user.token}`
        },
      });
      toast.success("Article modifié avec succès !");
      setOpenPopupEdit(false);
      navigate(0);
    } catch (err) {
      // 👇 affiche le message d'erreur exact du backend
      console.error("Erreur PUT:", err.response?.data ?? err.message);
      toast.error("Erreur: " + (JSON.stringify(err.response?.data) ?? "inconnue"));
    } finally {
      setLoading(false)
    }
  };

  if (!openEdit) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-base-100 rounded-2xl shadow-xl w-[90%] md:w-1/3 p-6 relative overflow-y-auto max-h-[90vh]" data-theme="silk">
        <ToastContainer />
        <button
          className="absolute top-4 right-4 text-base-content/50 hover:text-base-content transition"
          onClick={() => setOpenPopupEdit(false)}
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-center mb-6">Modifier l'article</h2>

        <div className="flex flex-col items-center gap-4">

          <div className="w-full md:w-3/4">
            <label className="label text-left"><span className="label-text font-medium">Référence</span></label>
            <input type="text" className="input input-bordered w-full" value={reference} onChange={(e) => setReference(e.target.value)} />
          </div>

          <div className="w-full md:w-3/4">
            <label className="label text-left"><span className="label-text font-medium">Nom de l'article</span></label>
            <input type="text" className="input input-bordered w-full" value={nom} onChange={(e) => setNom(e.target.value)} />
          </div>

          <div className="w-full md:w-3/4">
            <label className="label text-left"><span className="label-text font-medium">Prix (DZD)</span></label>
            <input type="number" className="input input-bordered w-full" value={prix} onChange={(e) => setPrix(e.target.value)} />
          </div>

          <div className="w-full md:w-3/4">
            <label className="label text-left"><span className="label-text font-medium">Durée de garantie (ans)</span></label>
            <input type="number" className="input input-bordered w-full" value={DureeGarantie} onChange={(e) => setDureeGarantie(e.target.value)} />
          </div>

          <div className="w-full md:w-3/4">
            <label className="label text-left"><span className="label-text font-medium">Description</span></label>
            <textarea className="textarea textarea-bordered w-full" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="w-full md:w-3/4">
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0])} className="file-input file-input-bordered w-full" />
          </div>

          <div className="w-full md:w-3/4">
            <label className="label"><span className="label-text font-medium">Catégorie</span></label>
            <select className="select select-bordered w-full" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="" disabled>Choisir une catégorie</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.categorieName}</option>
              ))}
            </select>
          </div>

          <div className="w-full md:w-3/4 flex  gap-2.5">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" className="checkbox" checked={isSold} onChange={(e) => setIsSold(e.target.checked)} />
              <span className="font-medium">On sale</span>
            </label>
            {isSold && (
              <div className="mt-2 w-[60%]">
                
                <input type="number" min={0} max={100} value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} className="input input-bordered w-full" />
              </div>
            )}
          </div>

        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button className="btn btn-outline" onClick={() => setOpenPopupEdit(false)}>Annuler</button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-sm"></span> : "Modifier"}
          </button>
        </div>
      </div>
    </div>
  )
}