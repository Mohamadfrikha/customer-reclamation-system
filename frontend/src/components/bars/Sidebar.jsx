import React from 'react'
import { useParams } from "react-router";
import { NavLink } from 'react-router'
import {useContext} from 'react'
import { AuthContext } from '../../context/AuthContext';
import { CalendarFold ,User,Stethoscope, Home,Activity ,ScrollText,MessageSquareWarning} from "lucide-react";

export default function Sidebar({user}) {
    const roleRoutes = {
  Admin: "/admin",
  Client: "/Client"
};
const role = user?.roles?.[0];

  return (
    
    <div className="drawer-side is-drawer-close:overflow-visible" data-theme="silk">
            <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay">
                
            </label>
            <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">       
                <div   className="ml-1.5 mt-1.5 flex items-center is-drawer-close:tooltip is-drawer-close:tooltip-right" >
                <img 
                src="/images/logo_Site.png" 
                alt="Hospital" 
                className="w-14 h-14 mr-3 rounded-full"
            />
            <span className="is-drawer-close:hidden font-bold text-lg">ClientAssist</span></div>
           
            <ul className="menu w-full grow ">
                
                <li>
                <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Accueil" to={`/`}>
                   
                    <Home className="w-6 h-6" />
                    <span className="is-drawer-close:hidden">Accueil</span>
                </NavLink>
                </li>
                <li>
                <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Articles" to={`${roleRoutes[role]}/Articles`}>
                    
                    <ScrollText className="w-6 h-6" />
                    <span className="is-drawer-close:hidden">Articles</span>
                </NavLink>
                </li>

                <li>
                <NavLink className="is-drawer-close:tooltip is-drawer-close:tooltip-right" data-tip="Reclamations" to={`${roleRoutes[role]}/Reclamations`}>
                    
                    <MessageSquareWarning className="w-6 h-6" />
                    <span className="is-drawer-close:hidden">Reclamations</span>
                </NavLink>
                </li>

                           
            </ul>
            </div>
        </div>
  )
}
