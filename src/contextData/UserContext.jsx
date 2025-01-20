// UserContext.js
import React, { createContext, useState } from 'react';

// Crear el contexto
export const UserContext = createContext();

// Crear el Provider
export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({
    name: '',
    email: '',
    role: ''
  });

  // Función para hacer login
  const login = (userData) => {
    setCurrentUser(userData);
  };

  // Función para hacer logout
  const logout = () => {
    setCurrentUser({
      name: '',
      email: '',
      role: ''
    });
  };

  return (
    <UserContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
