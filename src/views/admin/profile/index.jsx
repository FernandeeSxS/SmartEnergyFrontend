import React, { useEffect, useState } from "react";
import Banner from "./components/Banner";
import General from "./components/General";
import { apiRequest } from "services/api";

const ProfileOverview = () => {
  const [userData, setUserData] = useState(null);
  const [counts, setCounts] = useState({ dispositivos: 0, espacos: 0 });
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("userToken");

  const getUserIdFromToken = (token) => {
    try {
      if (!token) return null;
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decoded = JSON.parse(window.atob(base64));
      return decoded.nameid; 
    } catch (e) {
      return null;
    }
  };

  const fetchProfileData = async () => {
    const userId = getUserIdFromToken(token);

    if (!userId) {
      console.error("Token inválido ou não encontrado.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const user = await apiRequest(`/Utilizador/${userId}`, "GET", null, token);
      setUserData(user);

      const espacos = await apiRequest("/espaco/utilizador", "GET", null, token);
      const dispositivos = await apiRequest("/Dispositivo/utilizador", "GET", null, token);

      setCounts({
        espacos: espacos ? espacos.length : 0,
        dispositivos: dispositivos ? dispositivos.length : 0 
      });

    } catch (err) {
      console.error("Erro ao carregar dados:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  if (loading) return <div className="p-5 text-white">A carregar...</div>;
  if (!userData) return <div className="p-5 text-red-500">Erro ao carregar perfil.</div>;

  const currentUserId = getUserIdFromToken(token);

  return (
    <div className="flex w-full flex-col gap-5 pb-10"> {/* pb-10 para dar espaço no fim da página */}
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12 lg:items-stretch">
        
        {/* Lado Esquerdo: Banner */}
        <div className="col-span-12 lg:col-span-4 h-full">
          <Banner 
            nome={userData.nome}
            dispositivos={counts.dispositivos}
            espacos={counts.espacos}
            membroDesde={new Date(userData.dataRegisto).getFullYear()}
          />
        </div>

        {/* Lado Direito: General (Informações da Conta) */}
        <div className="col-span-12 lg:col-span-8 h-full">
          <General 
            id={currentUserId} 
            nome={userData.nome} 
            email={userData.email} 
          />
        </div>

      </div>
    </div>
  );
};

export default ProfileOverview;