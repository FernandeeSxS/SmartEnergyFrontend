import { apiRequest } from "./api";

export async function getEspacosPorUtilizador(token) {
  return await apiRequest("/espaco/utilizador", "GET", null, token);
}
