import React from "react";
import { NavLink } from "react-router";
import { Users, Contact ,Menu,Home, Mail, LogIn,Package} from "lucide-react";
export default function Navbar({ user }) {

  console.log("User in Navbar:", user);

  const roleRoutes = {
  Admin: "/admin/Clients",
  Client: "/Client/Articles"
};



const role = user?.roles?.[0];

  return (
    <div>
    <div className="navbar  px-6  bg-base-100/70 shadow-sm relative z-20" data-theme="silk">

      {/* LEFT */}
      <div className="flex-1">
        <NavLink to="/" className="flex items-center gap-3 text-xl font-bold">
          <img
            src="/images/logo_Site.png"
            alt="Hospital"
            className="w-16 h-16 rounded-full"
          />
          
        </NavLink>
      </div>

      {/* DESKTOP MENU */}
      <div className="hidden md:flex items-center gap-6">

      <NavLink
          to="/Articles_categorie"
          className="flex items-center gap-2 font-medium hover:text-primary"
        >
          <Package size={22} />
          Articles
        </NavLink>
        <NavLink
          to="/contactez_nous"
          className="flex items-center gap-2 font-medium hover:text-primary"
        >
          <Contact size={22} />
          Contactez-nous
        </NavLink>

        <NavLink
          to={roleRoutes[role] || "/login"}
          className="badge badge-lg badge-primary flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform h-10"
        >
          <Users size={30} />
          Espace Externe
        </NavLink>


        <div className="dropdown dropdown-end"> <div tabIndex="0" role="button" className="btn btn-ghost btn-circle">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /> </svg> </div> <ul tabIndex="-1" className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"> 
                <li><NavLink to="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/20 transition"><Home size={20} /> Home</NavLink></li>
                 <li><NavLink to="/login" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/20 transition"><LogIn size={20} /> Login</NavLink></li>
                 
                 </ul> 
                 </div> 

      </div>

      {/* MOBILE MENU */}
      <div className="md:hidden dropdown dropdown-end">
        <div tabIndex={0} className="btn btn-ghost btn-circle">
          <Menu size={22} />
        </div>

  <ul
    tabIndex={0}
    className="dropdown-content menu menu-vertical p-2 mt-[90%] w-52 bg-base-100 rounded-box shadow gap-2"
  >
    <li>
          <NavLink
          to={roleRoutes[role] || "/login"}
          className="badge badge-lg badge-primary flex items-center gap-2 cursor-pointer hover:scale-105 transition-transform h-10 w-full"
        >
          <Users size={30} />
          Espace Externe
        </NavLink>

    </li>
    <li>
      <NavLink
        to="/"
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/20 transition"
      >
        <Home size={20} /> Home
      </NavLink>
    </li>
    

    <li>
      <NavLink
        to="/contactez_nous"
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/20 transition"
      >
        <Mail size={20} /> Contactez-nous
      </NavLink>
    </li>

    <li>
      <NavLink
        to="/login"
        className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-primary/20 transition"
      >
        <LogIn size={20} /> Login
      </NavLink>
    </li>
  </ul>
</div>


    </div>


    </div>
  );
}
