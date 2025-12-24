import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DeviceCard from "components/card/DeviceCard";
import { IoMdAdd } from "react-icons/io";
import AddDeviceModal from "./components/AddDeviceModal";
import { apiRequest } from "services/api";

const Tables = () => {
  const [showModal, setShowModal] = useState(false);
  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("userToken");

  const fetchDispositivos = async () => {
    try {
      setLoading(true);
      const listaBase = await apiRequest("/Dispositivo/utilizador", "GET", null, token);
      
      if (listaBase && listaBase.length > 0) {
        const dispositivosComConsumo = await Promise.all(
          listaBase.map(async (d) => {
            try {
              const consumos = await apiRequest(`/consumo/dispositivo/${d.dispositivoId}`, "GET", null, token);
              const ultimoValor = consumos && consumos.length > 0 
                ? consumos[consumos.length - 1].valorConsumido.toFixed(2) 
                : "0.00";
              
              return { ...d, ultimoConsumo: ultimoValor };
            } catch (err) {
              return { ...d, ultimoConsumo: "0.00" };
            }
          })
        );
        setDispositivos(dispositivosComConsumo);
      } else {
        setDispositivos([]);
      }
    } catch (err) {
      console.error("Erro ao buscar dispositivos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDispositivos();
  }, []);

  const handleVerDetalhes = (id) => {
    navigate(`/admin/dispositivo/${id}`); 
  };

  const ativos = dispositivos.filter(d => d.status === true || d.status === "Ligado" || d.isAtivo === true);
  const desligados = dispositivos.filter(d => !(d.status === true || d.status === "Ligado" || d.isAtivo === true));

  if (loading) return <div className="p-5 text-white text-center">A carregar dispositivos...</div>;

  return (
    <div className="relative mt-5 flex flex-col gap-10 h-full w-full">
      
      <button
        className="fixed bottom-10 right-10 z-50 flex items-center justify-center gap-2 rounded-full bg-brand-500 p-4 text-white shadow-xl transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 md:px-6 md:py-3"
        onClick={() => setShowModal(true)}
      >
        <IoMdAdd className="h-6 w-6" />
        <span className="hidden md:block font-bold">Adicionar Dispositivo</span>
      </button>

      <AddDeviceModal 
        isOpen={showModal} 
        onClose={() => {
          setShowModal(false);
          fetchDispositivos(); 
        }} 
      />

      {/* SECÇÃO DISPOSITIVOS ATIVOS */}
      <section>
        <div className="mb-4 px-4">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">Dispositivos Ativos</h4>
          <p className="text-sm text-gray-600">Equipamentos a consumir energia em tempo real.</p>
        </div>
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ativos.map((d) => (
            <DeviceCard 
              key={d.dispositivoId} 
              id={d.dispositivoId} // CORREÇÃO: Passa o ID para o DELETE funcionar
              title={d.nomeDispositivo || d.nome} 
              consumption={d.ultimoConsumo} 
              onViewDetails={() => handleVerDetalhes(d.dispositivoId)} 
              onRefresh={fetchDispositivos} // CORREÇÃO: Atualiza a lista após eliminar
            />
          ))}
        </div>
      </section>

      {/* SECÇÃO DISPOSITIVOS DESLIGADOS */}
      <section className="pb-10">
        <div className="mb-4 px-4">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">Dispositivos Desligados</h4>
          <p className="text-sm text-gray-600">Equipamentos em standby ou desligados.</p>
        </div>
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {desligados.map((d) => (
            <DeviceCard 
              key={d.dispositivoId} 
              id={d.dispositivoId} // CORREÇÃO: Passa o ID para o DELETE funcionar
              title={d.nomeDispositivo || d.nome} 
              consumption={d.ultimoConsumo} 
              extra="opacity-60" 
              onViewDetails={() => handleVerDetalhes(d.dispositivoId)}
              onRefresh={fetchDispositivos} // CORREÇÃO: Atualiza a lista após eliminar
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tables;