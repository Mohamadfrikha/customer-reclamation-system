import React from 'react'
import { useState } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { useNavigate } from 'react-router'
import { toast, ToastContainer } from 'react-toastify'
import api from '../api/api'

export default function Login() {
  const navigate=useNavigate()
  const [email, setEmail] = useState("");
  const { login } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  {/*const [token, setToken] = useState("");*/}

  const handleLogin = async () => {
  if (!email || !password) {
    toast.error("Veuillez remplir tous les champs !");
    return;
  }

  try {
    const res = await api.post("Auth/token", {
      email: email,
      password: password,
    }, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (res.status !== 200) {
      toast.error("Erreur lors de la récupération des données utilisateur.");
      return;
    }

    login(res.data);
    toast.success("Connexion réussie !");
    const roles = Array.isArray(res.data.roles) ? res.data.roles : [res.data.roles];

    if (roles.includes("Admin")) {
      navigate("/admin/Clients");
    } else if (roles.includes("Client")) {
      navigate("/Client/Articles");
    }

  } catch (error) {
    // 👇 Gérer le 403 PASSWORD_CHANGE_REQUIRED
    if (error?.response?.status === 403) {
      const data = error.response.data;
      if (data?.message === "PASSWORD_CHANGE_REQUIRED") {
        toast.info("Vous devez changer votre mot de passe.");
        navigate("/change-first-password", {
          state: { email: data.email }// 👈 passer l'email à la page suivante
        });
        return;
      }
    }

    toast.error(error?.response?.data || "Connexion échouée");
  }
};

  return (
    // Ajout du thème abyss ici
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-100" data-theme="silk">
  <ToastContainer />

  <div className="bg-white card lg:card-side  shadow-2xl max-w-4xl w-full">

    {/* Image */}
    <figure className="relative lg:w-1/2">
      <img
        src="\images\loginPage.png"
        alt="Hospital system"
        className="h-full w-full object-cover"
      />

      {/* Overlay texte */}
      <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-bold text-base-100 mb-2">
          Système de gestion des réclamations SAV
        </h2>
        <p className="text-base-200 text-sm max-w-md">
          Veuillez vous connecter pour accéder à la plateforme de suivi des réclamations et interventions techniques.
        </p>
      </div>
    </figure>

   
    {/* Form */}
<div className="card-body lg:w-1/2 text-base-content items-center gap-y-3">

  {/* Icon */}
  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
    </svg>
  </div>

  <h1 className="text-2xl font-bold text-center text-primary">
    Connexion
  </h1>

  <p className="text-sm text-base-content/60 text-center">Accédez à votre espace</p>

  <div className="flex justify-center gap-2 flex-wrap">
    <div className="badge badge-primary badge-outline">Client</div>
    <div className="badge badge-primary badge-outline">Admin</div>
  </div>

  <fieldset className="fieldset w-full mt-2">
    <label className="label">
      <span className="label-text">Email</span>
    </label>
    <input
      type="email"
      className="input input-bordered w-full bg-white"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />

    <label className="label mt-2">
      <span className="label-text">Mot de passe</span>
    </label>
    <input
      type="password"
      className="input input-bordered w-full bg-white"
      placeholder="Mot de passe"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />

    <div className="flex justify-end mt-1">
      <a className="link link-primary text-sm" onClick={() => navigate("/forgot-password")}>
        Mot de passe oublié ?
      </a>
    </div>

    <button className="btn btn-primary mt-4 w-full" onClick={handleLogin}>
      Se connecter
    </button>

    <button
      className="btn btn-outline btn-secondary mt-2 w-full hover:text-white"
      onClick={() => navigate("/register")}
    >
      Créer un compte
    </button>
  </fieldset>

</div>
  </div>
</div>

  );
}

