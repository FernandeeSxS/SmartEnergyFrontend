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
  const token = localStorage.getItem("userToken");

  const fetchEspacosComConsumo = async () => {
    try {
      // 1. Primeiro, buscar a lista de espaços
      const data = await apiRequest("/espaco/utilizador", "GET", null, token);
      
      if (data && data.length > 0) {
        // 2. Para cada espaço, buscar o seu consumo total usando o novo endpoint
        const espacosComDados = await Promise.all(
          data.map(async (espaco) => {
            try {
              // Ajusta a rota para coincidir com o teu Controller (ex: /consumo/espaco/{id}/total)
              const consumoTotal = await apiRequest(`/consumo/espaco/${espaco.espacoId}/total`, "GET", null, token);
              return { ...espaco, consumoTotal };
            } catch (err) {
              console.error(`Erro ao buscar consumo do espaço ${espaco.espacoId}:`, err);
              return { ...espaco, consumoTotal: 0 };
            }
          })
        );
        setEspacos(espacosComDados);
      }
    } catch (err) {
      console.error("Erro ao buscar espaços:", err);
    }
  };

  useEffect(() => {
    fetchEspacosComConsumo();
  }, []);

  const handleVerDispositivos = (espacoId, nomeEspaco) => {
    navigate(`/admin/space/${espacoId}`, { state: { nomeEspaco } });
  };

  return (
    <div className="relative mt-3 flex flex-col h-full w-full gap-5">
      <button
        className="fixed bottom-10 right-10 z-50 flex items-center justify-center gap-2 rounded-full bg-brand-500 p-4 text-white shadow-xl transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 md:px-6 md:py-3"
        onClick={() => setShowModal(true)}
      >
        <IoMdAdd className="h-6 w-6" />
        <span className="hidden md:block font-bold">Adicionar Espaço</span>
      </button>

      <AddEspacoModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          fetchEspacosComConsumo();
        }}
      />

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
              // Exibe o valor vindo do novo endpoint
              price={`${espaco.consumoTotal || 0} kWh`}
              onViewDevices={() =>
                handleVerDispositivos(espaco.espacoId, espaco.nomeEspaco)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Marketplace;