import React, { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router'
import { ArrowLeft, Search, Users, ShieldCheck, Pencil, ChevronLeft, ChevronRight, UserPlus } from 'lucide-react'
import api from '../../api/api'
import { AuthContext } from '../../context/AuthContext'

const PAGE_SIZE = 8

export default function UsersPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("Clients")
  const [search, setSearch] = useState("")
  const [clients, setClients] = useState([])
  const [admins, setAdmins] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const { user } = useContext(AuthContext)

  const getUsers = async () => {
    try {
      const res = await api.get("Auth/Users", {
        headers: { Authorization: `Bearer ${user.token}` }
      })
      if (res.status === 200) {
        setClients(res.data.filter(u => !u.roles?.includes("Admin")))
        setAdmins(res.data.filter(u => u.roles?.includes("Admin")))
      }
    } catch (error) {
      console.error("Erreur:", error)
    }
    setLoading(false)
  }

  useEffect(() => { getUsers() }, [])
  useEffect(() => { setPage(1) }, [activeTab, search])

  const filteredClients = clients.filter(c =>
    c.userName?.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.firstName?.toLowerCase().includes(search.toLowerCase()) ||
    c.lastName?.toLowerCase().includes(search.toLowerCase()) ||
    c.phoneNumber?.toLowerCase().includes(search.toLowerCase()) ||
    c.adresse?.toLowerCase().includes(search.toLowerCase())
  )

  const filteredAdmins = admins.filter(a =>
    a.userName?.toLowerCase().includes(search.toLowerCase()) ||
    a.email?.toLowerCase().includes(search.toLowerCase())
  )

  const renderTable = (data) => {
    const totalPages = Math.ceil(data.length / PAGE_SIZE)
    const paginated = data.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

    return (
      <div className="card bg-base-200 shadow-md w-full" data-theme="silk">
        <div className="overflow-x-auto">
          {data.length === 0 ? (
            <p className="text-center text-gray-400 py-6">Aucun utilisateur trouvé.</p>
          ) : (
            <table className="table table-zebra w-full">
              <thead>
                <tr className="text-base-content font-medium">
                  <th></th>
                  <th>CIN</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Téléphone</th>
                  <th>Adresse</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-base-300">
                {paginated.map((u) => (
                  <tr key={u.id} className="hover:bg-base-100 transition-colors">
                    <td className="p-3">
                      <div className="avatar">
                        <div className="w-10 rounded-full">
                          <img
                            src={u.imageUrl ? `https://localhost:7205${u.imageUrl}` : "/images/user.png"}
                            alt={u.firstName}
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="badge badge-ghost font-bold text-xs">{u.cin ?? '—'}</span>
                    </td>
                    <td className="font-medium text-base-content">{u.firstName ?? '—'}</td>
                    <td className="text-base-content/80">{u.lastName ?? '—'}</td>
                    <td className="p-3">{u.email ?? '—'}</td>
                    <td className="p-3">{u.phoneNumber ?? '—'}</td>
                    <td className="p-3">{u.adresse ?? '—'}</td>
                    <td>
                      <button className="btn btn-ghost btn-xs btn-square text-warning" title="Modifier">
                        <Pencil size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr>
                  {/* Bouton ajouter — gauche */}
                  <td colSpan={4} className="py-3 px-3">
                    {activeTab === "Clients" ? (
                      <button
                        className="btn btn-sm btn-primary gap-1"
                        onClick={() => navigate("/admin/AddClient")}
                      >
                        <UserPlus size={15} /> Ajouter Client
                      </button>
                    ) : (
                      <button
                        className="btn btn-sm btn-secondary gap-1"
                        onClick={() => navigate("/admin/add-admin")}
                      >
                        <UserPlus size={15} /> Ajouter Admin
                      </button>
                    )}
                  </td>

                  {/* Pagination — droite */}
                  <td colSpan={4} className="py-3 px-3">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-sm text-base-content/60">
                        {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, data.length)} / {data.length}
                      </span>

                      <button
                        className="btn btn-xs btn-ghost btn-square"
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft size={14} />
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                        <button
                          key={p}
                          className={`btn btn-xs btn-square ${page === p ? 'btn-primary' : 'btn-ghost'}`}
                          onClick={() => setPage(p)}
                        >
                          {p}
                        </button>
                      ))}

                      <button
                        className="btn btn-xs btn-ghost btn-square"
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                      >
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              </tfoot>

            </table>
          )}
        </div>
      </div>
    )
  }

  if (loading) return <span className="loading loading-dots loading-xl"></span>

  return (
    <div className="w-[85%] mx-auto mt-8 space-y-6 bg-white" data-theme="silk">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="btn btn-circle btn-ghost">
          <ArrowLeft />
        </button>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Users size={28} className="text-gray-700" />
          Users
        </h1>
      </div>

      <div className="flex items-center justify-between bg-base-100 shadow-md rounded-xl p-3">
        <div className="tabs tabs-boxed">
          <button
            className={`tab gap-2 ${activeTab === "Clients" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Clients")}
          >
            <Users size={16} /> Clients
            <span className="badge badge-sm">{filteredClients.length}</span>
          </button>
          <button
            className={`tab gap-2 ${activeTab === "Admins" ? "tab-active" : ""}`}
            onClick={() => setActiveTab("Admins")}
          >
            <ShieldCheck size={16} /> Admins
            <span className="badge badge-sm">{filteredAdmins.length}</span>
          </button>
        </div>

        <div className="relative w-64">
          <input
            type="text"
            placeholder="Rechercher par nom..."
            className="input input-bordered w-full pr-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Search className="absolute right-2 top-2.5 text-gray-400 w-4 h-4" />
        </div>
      </div>

      <div className="bg-base-100 rounded-xl shadow p-6">
        {activeTab === "Clients" && renderTable(filteredClients)}
        {activeTab === "Admins" && renderTable(filteredAdmins)}
      </div>
    </div>
  )
}