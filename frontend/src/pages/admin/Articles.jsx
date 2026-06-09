import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import api from '../../api/api'
import { ScrollText, Search, ChevronLeft, ChevronRight } from 'lucide-react'
import AjouterArticle from './AjouterArticle'
import EditArticle from './EditArticle'

export default function Articles() {

const [openPopup, setOpenPopup] = useState(false)
  const [open, setOpen] = useState(false)

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("")
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [opnPopupEdit,setOpenPopupEdit]=useState(false)
  const [openEdit, setOpenEdit] = useState(false)

  console.log(articles)

  const ITEMS_PER_PAGE = 6;
    const navigator=useNavigate()
  

  const getCategoryName = async(id) => {
    try {
      const res = await api.get("Categories");
      if (res.status === 200) setCategories(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des catégories:", error);
    }
  }
  

  
  const getArticles = async () => {
    try {
      const res = await api.get("Articles");
      if (res.status === 200) setArticles(res.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des articles:", error);
    }
    setLoading(false);
  
  }
  const filtered = articles.filter((a) => {
    const matchSearch =
      a.nom?.toLowerCase().includes(search.toLowerCase()) ||
      a.description?.toLowerCase().includes(search.toLowerCase())
    const matchCategory =
      selectedCategory === "" || a.categorieId === parseInt(selectedCategory)
    return matchSearch && matchCategory
  })

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Reset page when search changes
  useEffect(() => { setCurrentPage(1); }, [search, selectedCategory]);
  useEffect(() => { getArticles(); 
    getCategoryName();  }, []);


  if (loading) return <span className="loading loading-dots loading-xl"></span>;

  return (
    <div className="w-[85%] mx-auto mt-6 bg-white" data-theme="silk">
        <div className="flex items-center justify-between mb-6">

        {/* TITLE */}
        <h1 className="text-3xl font-bold text-gray-700 flex items-center gap-2">
            <ScrollText size={40} className="text-gray-700" />
            Articles
        </h1>

        {/* ACTION BUTTON */}
        <button className="btn btn-primary gap-2 px-6 py-3 text-base hover:scale-105 transition" onClick={()=>setOpenPopup(true)}>  
            Ajouter 
            <ScrollText  />
        </button>
        <AjouterArticle
          open={openPopup}
          setOpenPopup={setOpenPopup}
        />

        </div>
      <div className="bg-base-100 rounded-xl shadow p-6">
        {/* SEARCH BAR + COUNT */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <span className="text-sm text-base-content/60">
            {filtered.length} article(s)
          </span>

          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            {/* CATEGORIE */}
            <select
              className="select select-bordered w-full md:w-48"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} >
                  {cat.categorieName}
                </option>
              ))}
            </select>
            {/* SEARCH */}
            <div className="relative">
              <input
                type="text"
                placeholder="Rechercher par nom..."
                className="input input-bordered w-full md:w-64 pr-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute right-2 top-2.5 text-gray-400 w-4 h-4" />
            </div>

            
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
          {paginated.length === 0 ? (
            <div className="col-span-full flex flex-col items-center justify-center gap-4 mt-10">
  <ScrollText
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
    Aucun article trouvé.
  </p>
</div>
            
          ) : (
            paginated.map((item, index) => (
              <div
                key={index}
                className="card bg-base-200 min-w-60 max-w-80 w-full shadow-sm hover:shadow-lg transition"
              >
                <figure className="px-4 pt-4">
                  <img
                    src={`https://localhost:7205${item.imageUrl}`}
                    alt={item.nom}
                    className="rounded-xl object-cover w-full h-48"
                  />
                </figure>
                <div className="card-body items-center text-center p-4">
                  <h2 className="card-title text-base">{item.nom}</h2>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <div className="card-actions mt-3 flex gap-2 justify-center" >
                    <button className="btn btn-info btn-sm" onClick={()=>{
                        navigator("DetailArticle/"+item.articleId)
                    }}>
                        Voir plus
                    </button>
                    <button className="btn btn-warning btn-sm" onClick={()=>setOpenPopupEdit(true)}>
                        Edit
                    </button>
                     <EditArticle
                    openEdit={opnPopupEdit}
                    setOpenPopupEdit={setOpenPopupEdit}
                    articleId={item.articleId}
                  />

                    <button className="btn btn-error btn-sm">
                        Delete
                    </button>
                    </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* PAGINATION */}
        {totalPages >= 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              className="btn btn-sm btn-ghost"
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}