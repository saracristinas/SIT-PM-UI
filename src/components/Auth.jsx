import React, { useState, useEffect } from 'react';
import Login from './Login';
import Cadastro from './Cadastro';

export default function Auth({ darkMode = false, onAuthSuccess }) {
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  // Verifica se já existe um usuário logado
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        onAuthSuccess?.(parsedUser);
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    onAuthSuccess?.(userData);
  };

  const handleCadastroSuccess = (userData) => {
    setUser(userData);
    onAuthSuccess?.(userData);
  };

  const handleSwitchToLogin = () => {
    setShowLogin(true);
  };

  const handleSwitchToCadastro = () => {
    setShowLogin(false);
  };

  // Se já houver um usuário logado, não mostra nada (o componente pai lida com isso)
  if (user) {
    return null;
  }

  return (
    <>
      {showLogin ? (
        <Login
          darkMode={darkMode}
          onSwitchToCadastro={handleSwitchToCadastro}
          onLoginSuccess={handleLoginSuccess}
        />
      ) : (
        <Cadastro
          darkMode={darkMode}
          onSwitchToLogin={handleSwitchToLogin}
          onCadastroSuccess={handleCadastroSuccess}
        />
      )}
    </>
  );
}
