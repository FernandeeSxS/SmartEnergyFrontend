import React, { useState } from "react";
import Card from "components/card";
import { MdClose } from "react-icons/md";
import { apiRequest } from "services/api";

const AddEspacoModal = ({ isOpen, onClose }) => {
  const [nomeEspaco, setNomeEspaco] = useState("");
  const [tamanhoEspaco, setTamanhoEspaco] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("userToken");

  if (!isOpen) return null;

  const handleCreateEspaco = async (e) => {
    e.preventDefault();
    setError("");

    if (!nomeEspaco || !tamanhoEspaco) {
      setError("Preencha todos os campos");
      return;
    }

    try {
      const response = await apiRequest(
        "/espaco",
        "POST",
        {
          nomeEspaco,
          tamanhoEspaco: parseInt(tamanhoEspaco),
          utilizadorId: 0, 
        },
        token
      );

      onClose();        
    } catch (err) {
      console.error(err);
      setError("Erro ao criar espaço");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card extra={"w-full max-w-[500px] p-6 bg-white dark:bg-navy-800 shadow-2xl relative"}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-navy-700 dark:text-white"
        >
          <MdClose className="h-6 w-6" />
        </button>

        <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-6">
          Adicionar Novo Espaço
        </h4>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form className="grid grid-cols-1 gap-5" onSubmit={handleCreateEspaco}>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2 ml-1 dark:text-white">Nome do Espaço</label>
            <input
              type="text"
              placeholder="Ex: Cozinha, Sala de Estar..."
              value={nomeEspaco}
              onChange={(e) => setNomeEspaco(e.target.value)}
              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2 ml-1 dark:text-white">Área (m²)</label>
            <input
              type="number"
              placeholder="Ex: 25"
              value={tamanhoEspaco}
              onChange={(e) => setTamanhoEspaco(e.target.value)}
              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
            />
          </div>

          <button 
            type="submit"
            className="linear mt-4 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400"
          >
            Criar Espaço
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AddEspacoModal;
