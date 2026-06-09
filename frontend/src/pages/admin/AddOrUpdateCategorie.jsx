import { ToastContainer,toast } from 'react-toastify';
import { X } from 'lucide-react';
import { useContext ,useState} from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router';
import api from '../../api/api';
export default function AddOrUpdateCategorie({ categorieName, open, setOpenPopup, setCategorieName, action,selectedCategory}) {
  
  const {user}=useContext(AuthContext)
    const navigate=useNavigate()
    console.log("Selected Category ID:", selectedCategory);
    const handleSubmit = async () => {
        try{
            if(action==="update"){
                const res = await api.put(`Categories/${selectedCategory}`, {
                    categorieId: selectedCategory,
                    categorieName: categorieName
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": `Bearer ${user.token}`
                    }
                });
                navigate(0);
                toast.success("Catégorie modifiée avec succès.");
            } else {
                const res = await api.post("Categories", {
                    
                    categorieName: categorieName
                }, {
                    headers: {
                        'Content-Type': 'application/json', 
                        "Authorization": `Bearer ${user.token}`
                    }
                });
                navigate(0);
                toast.success("Catégorie ajoutée avec succès.");
            }
            
                
                setOpenPopup(false);
                 // Refresh the page
           
        }
        catch(error){
            console.error("Erreur lors de l'ajout de la catégorie:", error);
            toast.error(error?.response?.data || "Une erreur est survenue lors de l'ajout de la catégorie.");
        }
    }
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
        {action === "add" ? "Ajouter" : "Modifier"} un Categorie
      </h2>

        <div className="flex justify-center mb-6">
        <input
          type="text"
          placeholder="Nom de la catégorie"
          className="input input-bordered w-full md:w-3/4"
          value={categorieName}
          onChange={(e) => setCategorieName(e.target.value)}
        />
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
          {action === "add" ? "Ajouter" : "Modifier"}
        </button>
      </div>
    </div>
  </div>
  )
}
