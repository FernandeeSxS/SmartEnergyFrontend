import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import NftCard from "components/card/NftCard";
import AddEspacoModal from "./components/AddEspacoModal";
import { apiRequest } from "services/api";

const Marketplace = () => {
  const [showModal, setShowModal] = useState(false);
  const [espacos, setEspacos] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken"); // Token JWT

  // Buscar espaços do utilizador logado
  const fetchEspacos = async () => {
    try {
      const data = await apiRequest("/espaco/utilizador", "GET", null, token);
      setEspacos(data);
    } catch (err) {
      console.error("Erro ao buscar espaços:", err);
    }
  };

  useEffect(() => {
    fetchEspacos();
  }, []);

  const handleVerDispositivos = (nomeEspaco) => {
    const idUrl = nomeEspaco.toLowerCase().replace(/\s+/g, "-");
    navigate(`/admin/espaco/${idUrl}`);
  };

  return (
    <div className="relative mt-3 flex flex-col h-full w-full gap-5">
      {/* Botão flutuante */}
      <button
        className="fixed bottom-10 right-10 z-50 flex items-center justify-center gap-2 rounded-full bg-brand-500 p-4 text-white shadow-xl transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 md:px-6 md:py-3"
        onClick={() => setShowModal(true)}
      >
        <IoMdAdd className="h-6 w-6" />
        <span className="hidden md:block font-bold">Adicionar Espaço</span>
      </button>

      <AddEspacoModal isOpen={showModal} onClose={() => { setShowModal(false); fetchEspacos(); }} />

      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        <div className="mb-4 mt-5 px-4">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            Meus Espaços
          </h4>
        </div>

        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
          {espacos.length === 0 && (
            <p className="text-gray-500 col-span-full text-center">
              Nenhum espaço encontrado.
            </p>
          )}
          {espacos.map((espaco) => (
            <NftCard
              key={espaco.espacoId}
              title={espaco.nomeEspaco}
              author={`${espaco.tamanhoEspaco} m²`}
              price="" // Ainda não temos consumo
              onViewDevices={() => handleVerDispositivos(espaco.nomeEspaco)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
