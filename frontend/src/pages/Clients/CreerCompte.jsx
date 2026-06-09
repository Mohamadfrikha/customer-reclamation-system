import React, { useState ,useEffect, use} from 'react'
import { useNavigate } from 'react-router'
import { ToastContainer, toast } from "react-toastify";
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import api from '../../api/api'
export default function CreerCompte() {
   const { login } = useContext(AuthContext);


  const navigate = useNavigate();

  const [cin, setCin] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [adresse, setAdresse] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!/^\d{8}$/.test(cin)) {
  toast.error("Le CIN doit contenir 8 chiffres");
  return;
}

if (password !== passwordConfirm) {
  toast.error("Les mots de passe ne correspondent pas");
  return;
}

if (/\s/.test(username)) {
  toast.error("Username ne doit pas contenir des espaces");
  return;
}

if (!/^[a-zA-Z0-9_]+$/.test(username)) {
  toast.error("Username invalide (seulement lettres, chiffres et _)");
  return;
}

// 👇 phone validation
if (!/^\d{8}$/.test(phoneNumber)) {
  toast.error("Le numéro de téléphone doit contenir exactement 8 chiffres");
  return;
}

    setLoading(true);

    try {
      const res = await api.post("Auth/register/", {
        firstName,
        lastName,
        adresse,
        username,
        email,
        password,
        cin,
        phoneNumber
      });

      toast.success("Compte créé avec succès !");
      login( res.data);
      navigate("/login");

      const roles = Array.isArray(res.data.roles)? res.data.roles: [res.data.roles];

      if (roles.includes("Admin")) {
      navigate("/admin/Clients");
      } else if (roles.includes("Client")) {
      navigate("/Client/Articles");
      } 
    } catch (error) {
      const message = error?.response?.data
        ? JSON.stringify(error.response.data.message, null, 2)
        : "Erreur serveur";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };
  return (
    <div
  className="min-h-screen flex items-center justify-center bg-base-100 px-4"
  data-theme="silk"
>
    {loading && (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <span className="loading loading-spinner loading-xl text-primary"></span>
    </div>
  )}
  <ToastContainer />
  <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md">
    
    {/* Titre */}
    <div className="flex items-center justify-center gap-3 mb-2">
    <h2 className="text-2xl font-extrabold text-gray-800">
      Créer un compte
    </h2>

    <span className="badge badge-outline badge-primary  bg-gray-100">
      Clinet
    </span>
  </div>
    <p className="text-gray-500 text-sm text-center mb-6">
      Rejoignez HospitalMS en quelques étapes simples
    </p>
    
    {/* Formulaire */}
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <input
        type="text"
        name="cin"
        required
        placeholder="CIN"
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary" maxLength={8}
        value={cin}
        onChange={(e)=>setCin(e.target.value)}
      />
      <input
        type="text"
        placeholder="Nom"
        required
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary"
        value={firstName}
        onChange={(e)=>setFirstName(e.target.value)}
      />
      <input
        type="text"
        required
        placeholder="Prenom"
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary"
        value={lastName }
        onChange={(e)=>setLastName(e.target.value)}
      />
      <input
        type="text"
        required
        placeholder="username"
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary"
        value={username}
        onChange={(e)=>setUsername(e.target.value)}
      />
      
      <input
        type="text"
        required
        placeholder="phone number (8 chiffres)"
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary"
        value={phoneNumber}
        maxLength={8}
        onChange={(e)=>{
          const val = e.target.value.replace(/\D/g, '').slice(0, 8); 
          setPhoneNumber(val)}}
      />

      <input
        type="text"
        required
        placeholder="adresse"
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary"
        value={adresse}
        onChange={(e)=>setAdresse(e.target.value)}
      />

      <input
        type="email"
        required
        placeholder="Adresse e-mail"
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
      />

      <input
        type="password"
        required
        placeholder="Mot de passe (min. 8 caractères ) "
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary"
        value={password}
        onChange={(e)=>setPassword(e.target.value)}
      />

      <input
        type="password"
        required
        placeholder="Confirmer le mot de passe"
        className="input input-bordered w-full
        border-gray-300 bg-white
        focus:outline-none focus:ring-2 focus:ring-primary"
        value={passwordConfirm}
        onChange={(e)=>setPasswordConfirm(e.target.value)}
      />
      {/* Bouton */}
      <button className="btn btn-primary w-full mt-2 text-2xl" type="submit">
        {loading ? "Chargement..." : "S’inscrire"}
      </button>
    </form>

    {/* Lien login */}
    <p className="text-sm text-gray-500 text-center mt-6">
      Vous avez déjà un compte ?
      <span
        onClick={() => navigate("/login")}
        className="text-primary cursor-pointer ml-1 hover:underline"
      >
        Se connecter
      </span>
    </p>
  </div>
</div>

  )
}
