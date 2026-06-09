import React from 'react'
import { FileText, Tag, Shield, Package, Star, ArrowLeft, Folder ,Search, Users} from "lucide-react"
import { useParams, useNavigate } from 'react-router'
import { useState, useEffect ,useContext} from 'react'
import api from '../../api/api'
import EditArticle from './EditArticle'
import AjouterArticleClient from './AjouterArticleClient'
import { ToastContainer,toast } from 'react-toastify';
import { AuthContext } from '../../context/AuthContext'
export default function DetailArticle() {
  const { user } = useContext(AuthContext)
  const [openPopup, setOpenPopup] = useState(false)
    const [open, setOpen] = useState(false)
  const [articlesCl,setArticlesCl]=useState([])
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const [opnPopupEdit,setOpenPopupEdit]=useState(false)
  const [openEdit, setOpenEdit] = useState(false)
const [filterGarantie, setFilterGarantie] = useState("tous")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

 

    const [search,setSearch]=useState("")
  const navigate = useNavigate()

  const getArticle = async () => {
    try {
      const res = await api.get("Articles/" + id)
      if (res.status === 200) setArticle(res.data)
    } catch (error) {
      console.error("Erreur:", error)
    }
    setLoading(false)
  }

  const getArticleClientArt = async () => {
    try {
      const res = await api.get("ArticleClient/byArticle/" + id, {
        headers: { "Authorization": `Bearer ${user.token}` }
      })
      if (res.status === 200) setArticlesCl(res.data)
    } catch (error) {
      console.error("Erreur:", error)
    }
    setLoading(false)
  }

  const filtered = articlesCl.filter((a) =>
  a.utilisateurNom?.toLowerCase().includes(search.toLowerCase()) ||
  a.utilisateurCIN?.toLowerCase().includes(search.toLowerCase())
).filter((a) => {
    if (filterGarantie === "active") return a.garantieActive === true
    if (filterGarantie === "expiree") return a.garantieActive === false
    return true // "tous"
  })
 const totalPages = Math.ceil(filtered.length / itemsPerPage)
const paginated = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  
  useEffect(() => { getArticle() 
    getArticleClientArt()
  }, [])

  if (loading) return <span className="loading loading-dots loading-xl"></span>
  if (!article) return <p className="text-center text-gray-400 mt-10">Article introuvable.</p>
  console.log("Article data:", article) // Debug log
  return (
    <div className="w-[85%] mx-auto mt-6 bg-white" data-theme="silk">
      {/* TITLE */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="btn btn-ghost btn-sm">
          <ArrowLeft size={18} /> Retour
        </button>
        <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-2">
          <FileText size={34} className="text-gray-700" />
          Détails de l'article
        </h1>
      </div>

      <div className="bg-base-100 rounded-xl shadow p-8">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* IMAGE */}
          <div className="flex-shrink-0">
            <img
              src={`https://localhost:7205${article.imageUrl}`}
              alt={article.nom}
              className="w-full lg:w-80 h-72 object-cover rounded-xl shadow-lg"
            />
            
            
          </div>

          {/* DETAILS */}
          <div className="flex-1 space-y-5">
            {/* NOM + CATEGORIE */}
            <div>
              <h2 className="text-4xl font-bold text-gray-800">{article.nom}</h2>
              <span className="badge badge-outline badge-primary mt-2 text-sm">
                {article.categorie?.categorieName}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p className="text-gray-500 text-base leading-relaxed">{article.description}</p>

            {/* INFO GRID */}
            <div className="grid grid-cols-2 gap-4">
              {/* PRIX */}
              <div className="bg-base-200 rounded-lg p-4 flex items-center gap-3">
                <Tag size={22} className="text-primary" />
                <div>
                  <p className="text-xs text-gray-400">Prix</p>
                  <p className="font-bold text-lg">
                    {article.prix ? `${article.prix} €` : 'N/A'}
                  </p>
                </div>
              </div>

              {/* PRIX PROMO */}
              <div className="bg-base-200 rounded-lg p-4 flex items-center gap-3">
                <Star size={22} className="text-warning" />
                <div>
                  <p className="text-xs text-gray-400">Prix promo</p>
                  <p className="font-bold text-lg text-warning">
                    {article.prixPromo ? `${article.prixPromo} €` : 'Aucun'}
                  </p>
                </div>
              </div>

              
              {/* GARANTIE */}
              <div className="bg-base-200 rounded-lg p-4 flex items-center gap-3">
                <Shield size={22} className="text-success" />
                <div>
                  <p className="text-xs text-gray-400">Garantie</p>
                  <p className="font-bold text-lg">{article.dureeGarantie} an(s)</p>
                </div>
              </div>

              {/* REFERENCE */}
              <div className="bg-base-200 rounded-lg p-4 flex items-center gap-3">
                <Package size={22} className="text-info" />
                <div>
                  <p className="text-xs text-gray-400">Référence</p>
                  <p className="font-bold text-lg">
                    {article.reference || 'N/A'}
                  </p>
                </div>
              </div>
            </div>

            {/* DISCOUNT */}
            {article.discountPercent && (
              <div className="alert alert-warning">
                <Star size={18} />
                <span>Remise de <strong>{article.discountPercent}%</strong> en cours !</span>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-3 pt-2">
              <button className="btn btn-warning btn-md" onClick={()=>setOpenPopupEdit(true)}>Edit</button>
              <EditArticle
                                  openEdit={opnPopupEdit}
                                  setOpenPopupEdit={setOpenPopupEdit}
                                  articleId={id}
                                />
              <button className="btn btn-error btn-md">Delete</button>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mb-6 justify-between mt-6">
        
        <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-2">
          <Folder size={34} className="text-gray-700" />
          Article clients
        </h1>

        <button className="btn btn-primary gap-2 px-6 py-3 text-base hover:scale-105 transition" onClick={()=>setOpenPopup(true)}>  
            Ajouter 
            <Folder  />
        </button>
        <AjouterArticleClient
        open={openPopup}
          setOpenPopup={setOpenPopup}
          article={article}
        />
        
      </div>
      <div className="bg-base-100 rounded-xl shadow p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <span className="text-sm text-base-content/60">
            {filtered.length} client(s)
          </span>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto items-center">
  
        {/* FILTER BUTTONS */}
        <div className="flex gap-2">
          <button
            className={`btn btn-sm gap-1 ${filterGarantie === "tous" ? "btn-primary" : "btn-outline"}`}
            onClick={() => { setFilterGarantie("tous"); setCurrentPage(1) }}
          >
            <Package size={14} /> Tous
          </button>
          <button
            className={`btn btn-sm gap-1 ${filterGarantie === "active" ? "btn-success text-white" : "btn-outline border-success text-success"}`}
            onClick={() => { setFilterGarantie("active"); setCurrentPage(1) }}
          >
            <Shield size={14} /> Active
          </button>
          <button
            className={`btn btn-sm gap-1 ${filterGarantie === "expiree" ? "btn-error text-white" : "btn-outline border-error text-error"}`}
            onClick={() => { setFilterGarantie("expiree"); setCurrentPage(1) }}
          >
            <Star size={14} /> Expirée
          </button>
        </div>

        {/* DIVIDER */}
        <div className="hidden md:block h-6 w-px bg-gray-300" />

        {/* SEARCH */}
        <div className="relative">
          <input
            type="text"
            placeholder="Nom, CIN..."
            className="input input-bordered input-sm w-full md:w-56 pr-8"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1) }}
          />
          <Search className="absolute right-2 top-2 text-gray-400 w-4 h-4" />
        </div>

      </div>

          
        </div>
        {paginated.length === 0 ? (
  <div className="col-span-full flex flex-col items-center justify-center gap-4 mt-10">
  <Users
    size={60}
    className="
      text-gray-400
      animate-pulse
      transition-all
      duration-300
      hover:scale-110
      hover:text-primary
    "
  />

  <p className="text-center text-gray-500 font-medium">
    Aucun Client trouvé.
  </p>
</div>
) : (<div className="card bg-base-200 shadow-md w-full" data-theme="silk">
  <div className="overflow-x-auto">
    <table className="table table-zebra w-full">
      <thead>
        <tr>
          <th></th>
          <th>Client</th>
          <th>CIN</th>
          <th>Date Achat</th>
          <th>Garantie</th>
          <th>Statut</th>
          <th>Réclamations</th>
        </tr>
      </thead>
      <tbody>
        {paginated.map((a, index) => (
          <tr key={a.articleClientId} className="hover:bg-base-100 transition-colors">
            <td><div className="avatar">
                                <div className="w-10 rounded-full">
                                    <img
                                        src={a.imageUrl ? `https://localhost:7205${a.imageUrl}` : "/images/user.png"}
                                        alt={`${a.utilisateurPrenom} ${a.utilisateurNom}`}
                                        className="object-cover"
                                        />
                                </div>
                            </div></td>
            <td>{a.utilisateurPrenom} {a.utilisateurNom}</td>
            <td>{a.utilisateurCIN}</td>
            <td>{new Date(a.dateAchat).toLocaleDateString()}</td>
            <td>{a.dureeGarantie} an(s)</td>
            <td>
              {a.garantieActive ? (
                <span className="badge badge-success">{a.statutGarantie}</span>
              ) : (
                <span className="badge badge-error">{a.statutGarantie}</span>
              )}
            </td>
            <td>
              <span className="badge badge-info">{a.nombreReclamations}</span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div></div>
)}

{totalPages >= 1 && (
  <div className="flex justify-center mt-4 gap-2">
    <button
      className="btn btn-sm"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage(currentPage - 1)}
    >
      «
    </button>

    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
      <button
        key={page}
        className={`btn btn-sm ${currentPage === page ? "btn-primary" : "btn-outline"}`}
        onClick={() => setCurrentPage(page)}
      >
        {page}
      </button>
    ))}

    <button
      className="btn btn-sm"
      disabled={currentPage === totalPages}
      onClick={() => setCurrentPage(currentPage + 1)}
    >
      »
    </button>
  </div>
)}

      </div>
    </div>
  )
}