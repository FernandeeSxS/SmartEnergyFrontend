// src/services/api.js
const API_BASE_URL = "https://localhost:7169/api"; // Sem barra no fim

export async function apiRequest(endpoint, method = "GET", body = null, token = null) {
  // Se o método for POST e estivermos a enviar credenciais, 
  // o fetch precisa de uma configuração específica dependendo da API.
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PUT")) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || "Erro na requisição");
  }

  // Se a resposta for apenas uma string (como no seu Register), 
  // o .json() pode falhar. Vamos tratar isso:
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
}