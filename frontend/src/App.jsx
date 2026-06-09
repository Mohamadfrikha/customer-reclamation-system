import { useState } from 'react'
import { useContext } from 'react'
import { AuthContext, AuthProvider } from './context/AuthContext'
import Navbar from './components/ui/Navbar'
import HomePage from './pages/HomePage'
import ContactezNous from './pages/ContactezNous.jsx'
import Login from './pages/Login.jsx'
import ProtectedRoute from './routes/ProtectionRoute.jsx'
import Sidebar from './components/bars/Sidebar.jsx'
import SidebarAdmin from './components/bars/SidebarAdmin.jsx'
import NavbarUtilisateur from './components/bars/NavbarUtilisateur.jsx'
import acceuile from './pages/admin/acceuile.jsx'
import CreerCompte from './pages/Clients/CreerCompte.jsx'
import './App.css'
import { RouterProvider, createBrowserRouter, Outlet } from 'react-router'
import Clients from './pages/admin/Clients.jsx'
import Articles from './pages/admin/Articles.jsx'
import Categories from './pages/admin/Categories.jsx'
import DetailArticle from './pages/admin/DetailArticle.jsx'
import ArticleClient from './pages/Clients/ArticleClient.jsx'
import MyArticles from './pages/Clients/MyArticles.jsx'
import ReclamationsArticleClient from './pages/Clients/ReclamationsArticleClient.jsx'
import Reclamations from './pages/Clients/Reclamations.jsx'
import ReclamationsClients from './pages/admin/ReclamationsClients.jsx'
import ReclamationDetail from './pages/admin/ReclamationDetail.jsx'
import ArticlesCatalogue from './pages/ArticlesCatalogue.jsx'
import ArticleDetail from './pages/ArticleDetail.jsx'
import ChangeFirstPassword from './pages/ChangeFirstPassword.jsx'
import AddClientByAdmin from './pages/admin/AddClientByAdmin.jsx'
function Layout() {
      const { user } = useContext(AuthContext);
      return (
      <>
      <Navbar user={user}/>
      
      <main style={{ minHeight: "100vh", marginTop: "1rem" }}>
      <Outlet />
      </main>
      {/* <Map/> */}
      {/* <Footer/> */}
      </>
      )}
function LayoutPatient(){
  const { user ,logout} = useContext(AuthContext);

  if (!user) return null;
   return (
      <>
      <div className="drawer lg:drawer-open">
          <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <NavbarUtilisateur user={user} logout={logout}/>
            <div className="p-4">
                <Outlet />
            </div>
          </div>
          {user.roles?.includes("Client") ? (
            <Sidebar user={user} />
          ) : (
            <SidebarAdmin user={user} />
          )}
          
       </div>
         
    </>)
}
function App() {
  
const router = createBrowserRouter([
    {
    path: '/',
    element: <Layout />, // parent avec NavBar
    children: [
    { index: true, element: <HomePage /> },
    {path: 'contactez_nous', element: <ContactezNous />},
    {path: 'Articles_categorie',element:<ArticlesCatalogue />},
    {path:'articles/:id', element:<ArticleDetail />}
    
    ]},
    {path: '/login', element: <Login/> },
    {path:'/register',element:<CreerCompte/>},
    {path:"/change-first-password", element:<ChangeFirstPassword />},
    {
      path:'/Client',
      element:<ProtectedRoute role="Client">
      <LayoutPatient />
    </ProtectedRoute>,
      children: [  
        { path: 'accueil', element: <acceuile /> },
        { path: 'Articles', element: <MyArticles /> },
        {path:'Articles/:id/reclamations', element: <ReclamationsArticleClient />},
        {path:'Reclamations', element: <Reclamations />},
        {path:'reclamation/:id', element: <ReclamationDetail />},
      ]
    },
    {
      path:'/Admin',
      element:<ProtectedRoute role="Admin">
      <LayoutPatient />
    </ProtectedRoute>,
      children: [  
        { path: 'Clients', element: <Clients /> },
        { path: 'Articles', element: <Articles /> },
        {path:'Categories', element: <Categories />},
        {path:'Articles/DetailArticle/:id', element: <DetailArticle />},
        {path:'Reclamations', element: <ReclamationsClients />},
        {path:'reclamation/:id', element: <ReclamationDetail />},
        {path:'AddClient', element: <AddClientByAdmin />},
        
      ]
    },
  ]
    )
  return (
    <>
      <AuthProvider> {/* <-- ici */}
        <RouterProvider router={router} />
    </AuthProvider>
    </>
  )
}

export default App
