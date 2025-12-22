import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Mudança aqui: useNavigate em vez de useHistory
import { IoMdAdd } from "react-icons/io";
import imgCozinha from "assets/img/nfts/Nft3.png"; 
import imgSala from "assets/img/nfts/Nft2.png";
import imgEscritorio from "assets/img/nfts/Nft4.png";
import NftCard from "components/card/NftCard";
import AddEspacoModal from "./components/AddEspacoModal";

const Marketplace = () => {
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate(); // Hook atualizado para navegação

  const handleVerDispositivos = (nomeEspaco) => {
    // Transforma o nome para a URL (ex: "Sala de Estar" -> "sala-de-estar")
    const idUrl = nomeEspaco.toLowerCase().replace(/\s+/g, '-');
    navigate(`/admin/espaco/${idUrl}`); // Função de navegação atualizada
  };

  return (
    <div className="relative mt-3 flex flex-col h-full w-full gap-5">
      {/* Botão Flutuante */}
      <button
        className="fixed bottom-10 right-10 z-50 flex items-center justify-center gap-2 rounded-full bg-brand-500 p-4 text-white shadow-xl transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 md:px-6 md:py-3"
        onClick={() => setShowModal(true)}
      >
        <IoMdAdd className="h-6 w-6" />
        <span className="hidden md:block font-bold">Adicionar Espaço</span>
      </button>

      <AddEspacoModal isOpen={showModal} onClose={() => setShowModal(false)} />

      <div className="col-span-1 h-fit w-full xl:col-span-1 2xl:col-span-2">
        <div className="mb-4 mt-5 px-4">
          <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
            Meus Espaços
          </h4>
        </div>

        <div className="z-20 grid grid-cols-1 gap-5 md:grid-cols-4">
          <NftCard
            title="Cozinha"
            author="25 m²"
            price="12.5 kWh"
            image={imgCozinha}
            onViewDevices={() => handleVerDispositivos("Cozinha")}
          />
          <NftCard
            title="Sala de Estar"
            author="40 m²"
            price="8.2 kWh"
            image={imgSala}
            onViewDevices={() => handleVerDispositivos("Sala de Estar")}
          />
          <NftCard
            title="Escritório"
            author="15 m²"
            price="5.4 kWh"
            image={imgEscritorio}
            onViewDevices={() => handleVerDispositivos("Escritório")}
          />
        </div>
      </div>
    </div>
  );
};

export default Marketplace;