import { useState ,useContext} from "react";
import { useLocation, useNavigate } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";  
export default function ChangeFirstPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || ""; // 👈 reçu depuis Login

  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { login } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!tempPassword || !newPassword || !confirmPassword) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas !");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("Auth/change-first-password", {
        email,
        tempPassword,
        newPassword,
      });

      toast.success("Mot de passe changé avec succès !");
      // Le backend retourne un token, on connecte directement
      login(res.data);
      const roles = Array.isArray(res.data.roles) ? res.data.roles : [res.data.roles];
      if (roles.includes("Admin")) {
        navigate("/admin/Clients");
      } else {
        navigate("/Client/Articles");
      }
    } catch (error) {
      toast.error(error?.response?.data || "Erreur lors du changement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-base-100" data-theme="silk">
      <ToastContainer />

      <div className="card bg-white shadow-2xl w-full max-w-md">
        <div className="card-body gap-y-4">

          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-warning" fill="none"
                viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 
                     2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 
                     2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-center text-warning">
            Changement de mot de passe
          </h1>
          <p className="text-sm text-center text-base-content/60">
            Première connexion — choisissez un nouveau mot de passe
          </p>

          {/* Email (readonly) */}
          <div>
            <label className="label"><span className="label-text">Email</span></label>
            <input type="email" className="input input-bordered w-full bg-base-200"
              value={email} readOnly />
          </div>

          {/* Mot de passe temporaire */}
          <div>
            <label className="label">
              <span className="label-text">Mot de passe temporaire</span>
            </label>
            <input type="password" className="input input-bordered w-full bg-white"
              placeholder="Mot de passe reçu par email"
              value={tempPassword}
              onChange={(e) => setTempPassword(e.target.value)} />
          </div>

          {/* Nouveau mot de passe */}
          <div>
            <label className="label">
              <span className="label-text">Nouveau mot de passe</span>
            </label>
            <input type="password" className="input input-bordered w-full bg-white"
              placeholder="Nouveau mot de passe"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)} />
          </div>

          {/* Confirmer */}
          <div>
            <label className="label">
              <span className="label-text">Confirmer le mot de passe</span>
            </label>
            <input type="password" className="input input-bordered w-full bg-white"
              placeholder="Confirmer le mot de passe"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} />
          </div>

          <button
            className={`btn btn-warning mt-2 w-full text-white ${loading ? "loading" : ""}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            Confirmer
          </button>

        </div>
      </div>
    </div>
  );
}