import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router";  
import api from "../../api/api";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function AddClientByAdmin() {
  const navigate = useNavigate();  
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    cin: "",
    phoneNumber: "",
    adresse: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    const { username, email, firstName, lastName, cin, phoneNumber, adresse } = formData;

    if (!username || !email || !firstName || !lastName || !cin || !phoneNumber || !adresse) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("Auth/add-client", formData, {
        headers: { "Content-Type": "application/json" 
        , Authorization: `Bearer ${user.token}` 
        },
      });

      toast.success(res.data?.message || "Client ajouté avec succès ! Email envoyé.");
      setFormData({
        username: "", email: "", firstName: "", lastName: "",
        cin: "", phoneNumber: "", adresse: "",
      });
      navigate('/Admin/Clients')
    } catch (error) {
      toast.error(error?.response?.data || "Erreur lors de l'ajout du client.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-white" data-theme="silk">
      <ToastContainer />

      <div className="card bg-white shadow-2xl w-full max-w-2xl">
        <div className="card-body gap-y-4">

          {/* Header */}
          <div className="flex items-center gap-3 mb-2">

            {/* 👇 Bouton retour */}
            <button
              onClick={() => navigate(-1)}
              className="btn btn-ghost btn-sm btn-circle"
              title="Retour"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
              </svg>
            </button>

            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-primary"
                fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 
                     0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 
                     6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 
                     0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>

            <div>
              <h1 className="text-2xl font-bold text-primary">Ajouter un client</h1>
              {/*<p className="text-sm text-base-content/60">
                Un email avec les identifiants sera envoyé automatiquement
              </p>*/}
            </div>
          </div>

          {/* Info badge */}
          {/*<div className="alert alert-info text-sm py-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 shrink-0"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>
              Le mot de passe temporaire <strong>Client123!</strong> sera envoyé au client par email.
              Il devra le changer lors de sa première connexion.
            </span>
          </div>*/}

          {/* Formulaire - 2 colonnes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label"><span className="label-text">Prénom</span></label>
              <input type="text" name="firstName" className="input input-bordered w-full bg-white"
                placeholder="Prénom" value={formData.firstName} onChange={handleChange} />
            </div>
            <div>
              <label className="label"><span className="label-text">Nom</span></label>
              <input type="text" name="lastName" className="input input-bordered w-full bg-white"
                placeholder="Nom" value={formData.lastName} onChange={handleChange} />
            </div>
            <div>
              <label className="label"><span className="label-text">Nom d'utilisateur</span></label>
              <input type="text" name="username" className="input input-bordered w-full bg-white"
                placeholder="Username" value={formData.username} onChange={handleChange} />
            </div>
            <div>
              <label className="label"><span className="label-text">Email</span></label>
              <input type="email" name="email" className="input input-bordered w-full bg-white"
                placeholder="Email" value={formData.email} onChange={handleChange} />
            </div>
            <div>
              <label className="label"><span className="label-text">CIN</span></label>
              <input type="text" name="cin" className="input input-bordered w-full bg-white"
                placeholder="CIN" maxLength={8} value={formData.cin} onChange={handleChange} />
            </div>
            <div>
              <label className="label"><span className="label-text">Téléphone</span></label>
              <input type="tel" name="phoneNumber" className="input input-bordered w-full bg-white"
                placeholder="Téléphone" maxLength={8} value={formData.phoneNumber} onChange={handleChange} />
            </div>
            <div className="md:col-span-2">
              <label className="label"><span className="label-text">Adresse</span></label>
              <input type="text" name="adresse" className="input input-bordered w-full bg-white"
                placeholder="Adresse complète" value={formData.adresse} onChange={handleChange} />
            </div>
          </div>

          {/* Boutons */}
          <div className="flex gap-3 mt-2">
            <button
              className="btn btn-outline flex-1"
              onClick={() => navigate(-1)}
              disabled={loading}
            >
              Annuler
            </button>
            <button
              className={`btn btn-primary flex-1 ${loading ? "loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Envoi en cours..." : "Créer le client"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}