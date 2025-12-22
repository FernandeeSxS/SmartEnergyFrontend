import React, { useState } from "react";
import DeviceCard from "components/card/DeviceCard";
import NFt3 from "assets/img/nfts/Nft3.png"; 
import NFt2 from "assets/img/nfts/Nft2.png";
import NFt4 from "assets/img/nfts/Nft4.png";
import { IoMdAdd } from "react-icons/io";

// Importa o teu componente separado
import AddDeviceModal from "./components/AddDeviceModal";

const dispositivosData = [
  { nome: "Frigorífico", consumo: "1.2", imagem: NFt3, ligado: true },
  { nome: "Ar Condicionado", consumo: "2.5", imagem: NFt2, ligado: true },
  { nome: "Máquina de Lavar", consumo: "0.0", imagem: NFt4, ligado: false },
  { nome: "Computador Desktop", consumo: "0.5", imagem: NFt3, ligado: true },
  { nome: "Micro-ondas", consumo: "0.0", imagem: NFt2, ligado: false }
];

const Tables = () => {
  const [showModal, setShowModal] = useState(false);

  const ativos = dispositivosData.filter(d => d.ligado);
  const desligados = dispositivosData.filter(d => d.ligado === false);

  return (
    <div className="relative mt-5 flex flex-col gap-10 h-full w-full">
      
      {/* Botão Flutuante */}
      <button
        className="fixed bottom-10 right-10 z-50 flex items-center justify-center gap-2 rounded-full bg-brand-500 p-4 text-white shadow-xl transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 md:px-6 md:py-3"
        onClick={() => setShowModal(true)}
      >
        <IoMdAdd className="h-6 w-6" />
        <span className="hidden md:block font-bold">Adicionar Dispositivo</span>
      </button>

      {/* CHAMADA DO COMPONENTE MODAL */}
      <AddDeviceModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
      />

      {/* Secções de listagem (Ativos) */}
      <section>
        <div className="mb-4 px-4">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">Dispositivos Ativos</h4>
          <p className="text-sm text-gray-600">Equipamentos a consumir energia em tempo real.</p>
        </div>
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {ativos.map((dispositivo, index) => (
            <DeviceCard key={index} title={dispositivo.nome} consumption={dispositivo.consumo} image={dispositivo.imagem} />
          ))}
        </div>
      </section>

      {/* Secções de listagem (Desligados) */}
      <section>
        <div className="mb-4 px-4">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">Dispositivos Desligados</h4>
          <p className="text-sm text-gray-600">Equipamentos em standby ou desligados.</p>
        </div>
        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {desligados.map((dispositivo, index) => (
            <DeviceCard key={index} title={dispositivo.nome} consumption={dispositivo.consumo} image={dispositivo.imagem} extra="opacity-60" />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Tables;