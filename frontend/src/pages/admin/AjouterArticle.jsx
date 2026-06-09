import React, { use, useEffect, useState } from 'react'

import { ToastContainer,toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import api from '../../api/api';

export default function AjouterArticle({ open, setOpenPopup }) {

    const [isSold, setIsSold] = useState(false);
    const {user}=useContext(AuthContext)
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [file, setFile] = useState(null);
  const [prix, setPrix] = useState("");
  const [DureeGarantie, setDureeGarantie] = useState("");
  const [reference , setReference] = useState("");
    const [loading, setLoading] = useState(false)
  const navigate=useNavigate()
  const [categories, setCategories] = useState([]);
  const [discountPercent, setDiscountPercent] = useState(0);
  
  const getCategoryName = async(id) => {
    try {
      const res = await api.get("Categories");
      if (res.status === 200) setCategories(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  }
  useEffect(() => { getCategoryName(); }, []);
  

  const handleSubmit = async () => {
  if (!selectedCategory) {
    toast.error("Veuillez sélectionner une catégorie !");
    return;
  }

if (!nom) return toast.error("Le nom est obligatoire !");
  if (!prix) return toast.error("Le prix est obligatoire !");
  if (!file) return toast.error("L'image est obligatoire !");
  if (!reference) return toast.error("La référence est obligatoire !");
  if (!selectedCategory) return toast.error("Veuillez choisir une catégorie !");

    const formData = new FormData();

formData.append("nom", nom);
formData.append("imageFile", file); 
formData.append("dureeGarantie", DureeGarantie);
formData.append("description", description);
formData.append("prix", prix);
formData.append("categorieId", selectedCategory);
formData.append("reference", reference);

if (isSold) {
  formData.append("discountPercent", discountPercent);
}
  

  try {
    const res = await api.post("/Articles", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${user.token}` 
      },
    });

    toast.success("Article créé avec succès !");
    setOpenPopup(false); // ferme le popup après création
    setSelectedCategory("")
    navigate(0);
    console.log(res.data);
  } catch (err) {
    console.log("STATUS:", err.response?.status);
  console.log("DATA:", JSON.stringify(err.response?.data));
  console.log("ERRORS:", JSON.stringify(err.response?.data?.errors));
  }
    
  
};
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl shadow-xl w-[90%] md:w-1/3 p-6 relative">
      <ToastContainer />
      <button
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
        onClick={() => setOpenPopup(false)}
      >
        <X className="w-5 h-5" />
      </button>

      <h2 className="text-xl md:text-2xl font-bold text-center mb-4">
        Ajouter un Article
      </h2>

        <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Référence de l'article"
          className="input input-bordered w-full md:w-3/4"
          value={reference}
          onChange={(e) => setReference(e.target.value)}
        />
      </div>
      <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Nom de l'article"
          className="input input-bordered w-full md:w-3/4"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
      </div>
      <div className="flex justify-center mb-6">
        <input type='number'
          placeholder="Prix de l'article"
          className="input input-bordered w-full md:w-3/4"
          value={prix}
          onChange={(e) => setPrix(e.target.value)}
        />
      </div>
      <div className="flex justify-center mb-6">
        <input type='number'
          placeholder="Durée de la garantie (en ans)"
          className="input input-bordered w-full md:w-3/4"
          value={DureeGarantie}
          onChange={(e) => setDureeGarantie(e.target.value)}
        />
      </div>
      <div className="flex justify-center mb-6">
        <textarea
          placeholder="Description de l'article"
          className="textarea textarea-bordered w-full md:w-3/4"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        >
        </textarea>
      </div>
      <div className="flex justify-center mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          className="file-input file-input-bordered w-full md:w-3/4 "
        />
      </div>

      

      <div className="flex justify-center mb-6">
        {loading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : (
          <select
            className="select w-full md:w-3/4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="" disabled>Choisir une catégorie</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categorieName}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex items-center justify-center gap-4 mb-6">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="checkbox" checked={isSold} onChange={(e) => setIsSold(e.target.checked)} />
            <span className="font-medium">On sale</span>
          </label>
          {isSold && (
            <input type="number" min={0} value={discountPercent} onChange={(e) => setDiscountPercent(Number(e.target.value))} placeholder="%" className="input input-sm input-bordered w-20" />
          )}
        </div>

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
        >
          Ajouter
        </button>
      </div>
    </div>
  </div>
  )
}
