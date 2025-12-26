import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

/**
 * Componente de rota privada.
 * 
 * Este componente verifica se existe um token de autenticação no localStorage.
 * - Se existir, permite aceder à rota protegida (children).
 * - Caso contrário, redireciona para a página de login.
 * 
 * @param {React.ReactNode} children - Componentes que devem ser renderizados se o utilizador estiver autenticado.
 * @returns {React.ReactNode} - O children ou um <Navigate> para o login.
 */
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  return token ? children : <Navigate to="/auth/sign-in" replace />;
};

/**
 * Componente principal da aplicação.
 * Define todas as rotas da aplicação, incluindo rotas públicas e privadas.
 * 
 * Rotas:
 * - /auth/* : Rotas públicas de autenticação (login, registo, recuperar password, etc.)
 * - /admin/* : Rotas privadas para utilizadores autenticados (dashboard, gestão, etc.)
 * - /       : Redireciona para a página de login por defeito
 */
const App = () => {
  return (
    <Routes>
      <Route path="auth/*" element={<AuthLayout />} />

      <Route
        path="admin/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      />

      <Route
        path="/"
        element={<Navigate to="/auth/sign-in" replace />}
      />
    </Routes>
  );
};

export default App;
