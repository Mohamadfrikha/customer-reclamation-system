import React, { useContext } from 'react'
import { useNavigate } from 'react-router'
import { AuthContext } from '../context/AuthContext'
import { Package } from 'lucide-react'
 
export default function HomePage() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
 
  const handleReclamation = () => {
    if (user?.roles?.includes('Client')) {
      navigate('/Client/Articles')
    } else {
      navigate('/login')
    }
  }
 
  return (
    <div
      className="hero min-h-screen"
      style={{ backgroundImage: `url('/images/PageAcceuile.png')` }}
    >
      <div className="hero-overlay bg-black/60"></div>
 
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-2xl">
 
          <h1 className="mb-6 text-5xl md:text-6xl font-extrabold leading-tight">
            Plateforme de Réclamation Client
          </h1>
 
          <p className="mb-8 text-lg md:text-xl text-gray-200">
            Déposez vos réclamations facilement et suivez leur traitement
            en toute transparence et sécurité.
          </p>
 
          <div className="flex flex-col md:flex-row gap-4 justify-center">
 
            <button
              className="btn btn-primary btn-lg rounded-full px-8"
              onClick={handleReclamation}
            >
              Déposer une Réclamation
            </button>
 
            {/* ── Catalogue — visible pour tout le monde ── */}
            <button
              className="btn btn-outline btn-lg text-white border-white hover:bg-white hover:text-black rounded-full px-8 flex items-center gap-2"
              onClick={() => navigate('/Articles_categorie')}
            >
              <Package size={20} />
              Voir le Catalogue
            </button>
 
          </div>
 
        </div>
      </div>
    </div>
  )
}
 