import { createContext, useState, useEffect } from "react";
//import apiAut from "../api/apiAut";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));

    // Auto logout when token expires
    const expiration = new Date(userData.expiresOn).getTime();
    const now = new Date().getTime();

    const timeLeft = expiration - now;

    if (timeLeft > 0) {
      setTimeout(() => {
        logout();
      }, timeLeft);
    } else {
      logout();
    }
  };

  
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);

      const expiration = new Date(parsedUser.expiresOn).getTime();
      const now = new Date().getTime();

      // Check if token expired
      if (expiration > now) {
        setUser(parsedUser);

        // Auto logout after remaining time
        const timeLeft = expiration - now;

        setTimeout(() => {
          logout();
        }, timeLeft);
      } else {
        logout();
      }
    }

    setLoading(false);
  }, []);
  
  if (loading) return <span className="loading loading-dots loading-xl"></span>;

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};