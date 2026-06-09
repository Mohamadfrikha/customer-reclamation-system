import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import { User, Settings, LogOut, ShoppingCart, Bell, Search ,Crown} from 'lucide-react'
import api from '../../api/api'
export default function NavbarUtilisateur({user,logout}) {
    const navigate=useNavigate()
    const [notification,setNotification]=useState([])
    const handleClick = () => {
    logout();
    navigate('/');
  }
   
  console.log("User in Navbar:", user);
  console.log(user.imageUrl);
  
  return (
    
      
    <nav className="navbar w-full bg-base-100" data-theme="silk">
            <label htmlFor="my-drawer-4" aria-label="open sidebar" className="btn btn-square btn-ghost">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" strokeLinejoin="round" strokeLinecap="round" strokeWidth="2" fill="none" stroke="currentColor" className="inline-block w-6 h-6">
                <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z"></path>
                <path d="M9 4v16"></path>
                <path d="M14 10l2 2l-2 2"></path>
                </svg>
            </label>
                    {/* Role / titre */}
            <div className="flex-1 pl-4">
                <h1 className="text-lg font-semibold">{user.roles.join(', ')} </h1>
            </div>


                <div className="flex gap-2 items-center mr-10">
        {/* Search */}
        
                {/*<div className="dropdown dropdown-end">
                    <button tabIndex={0} className="btn btn-ghost btn-circle">
                        <div className="indicator">
                        <Bell className="w-5 h-5" />
                        <span className="badge badge-xs badge-primary indicator-item">{notification.length}</span>
                        </div>
                    </button>
                    <div tabIndex={0} className="card card-compact dropdown-content bg-base-100 z-10 mt-3 w-90 shadow-lg">
                        
                        {notification.length === 0 && (
                            <div className="bg-base-200 rounded-lg p-4 text-center text-sm text-base-content/60">Aucune notification</div>
                        )}
                        
                        {notification.map((item, index) => (
                            <div
                            key={index}
                            className={`card bg-base-200 shadow-sm p-4 transition mb-1.5 ${
                                item.is_read ? "opacity-60" : "border-l-4 border-primary"
                            }`}
                            >
                            <div className="flex justify-between items-start">
                                <div>
                                <span className="font-semibold text-gray-700">{item.sujet}</span>
                                <p className="text-gray-600 text-sm mt-1">{item.message}</p>
                                </div>
                                <span className="text-xs text-gray-400">
                                {new Date(item.date_creation).toLocaleString()}
                                </span>
                            </div>
                            </div>
                        ))}
                    </div>
                    </div>*/}


                    <div className="dropdown dropdown-end">
                        <button tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                
                            <img
                                        src={user.imageUrl ? `https://localhost:7205${user.imageUrl}` : "/images/user.png"}
                                        alt="avatar"
                                        />
                            </div>

                        </button>
                        <ul tabIndex={-1} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow-lg">
                            <li className="text-2xl text-center">{user.username}</li><hr></hr>
                            <li>
                            <a className="flex items-center gap-2" onClick={() => navigate(`/${user.role}/profile`)}>
                                <User className="w-4 h-4" /> Profile
                            </a>
                            
                            
                            <a className="flex items-center gap-2">
                                <Settings className="w-4 h-4" /> Settings
                            </a>
                            </li>
                            <li>
                            <a className="flex items-center gap-2 text-red-500" onClick={handleClick}>
                                <LogOut className="w-4 h-4" /> Logout
                            </a>
                            </li>
                        </ul>
                        </div>
                    </div>
    </nav>
           

        
    
  )
}
