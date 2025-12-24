import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";

// Rota privada
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("userToken");
  return token ? children : <Navigate to="/auth/sign-in" replace />;
};

const App = () => {
  return (
    <Routes>
      {/* Rota pública do login */}
      <Route path="auth/*" element={<AuthLayout />} />

      {/* Rota privada do dashboard */}
      <Route
        path="admin/*"
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      />

      {/* Redirecionamento da raiz */}
      <Route
        path="/"
        element={<Navigate to="/auth/sign-in" replace />}
      />
    </Routes>
  );
};

export default App;
