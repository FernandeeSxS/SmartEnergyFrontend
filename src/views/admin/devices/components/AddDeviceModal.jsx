import React, { useState, useEffect } from "react";
import Card from "components/card";
import { MdClose } from "react-icons/md";
import { apiRequest } from "services/api";

const AddDeviceModal = ({ isOpen, onClose }) => {
  const token = localStorage.getItem("userToken");
  
  const [nomeDispositivo, setNomeDispositivo] = useState("");
  const [nomeMarca, setNomeMarca] = useState("");
  const [nomeModelo, setNomeModelo] = useState("");
  const [espacoId, setEspacoId] = useState("");
  
  const [listaEspacos, setListaEspacos] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const fetchEspacos = async () => {
        try {
          const data = await apiRequest("/espaco/utilizador", "GET", null, token);
          setListaEspacos(data || []);
        } catch (err) {
          console.error("Erro ao carregar espaços:", err);
        }
      };
      fetchEspacos();
    }
  }, [isOpen, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);

    const input = {
      nomeDispositivo: nomeDispositivo,
      nomeMarca: nomeMarca,
      nomeModelo: nomeModelo,
      espacoId: parseInt(espacoId)
    };

    try {
      await apiRequest("/dispositivo", "POST", input, token);
      
      alert("Dispositivo registado com sucesso!");
      
      setNomeDispositivo("");
      setNomeMarca("");
      setNomeModelo("");
      setEspacoId("");
      
      onClose();
    } catch (err) {
      console.error("Erro ao criar dispositivo:", err);
      alert("Erro ao registar dispositivo. Verifique se todos os campos estão corretos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card extra={"w-full max-w-[600px] p-6 bg-white dark:bg-navy-800 shadow-2xl relative"}>
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-navy-700 dark:text-white"
        >
          <MdClose className="h-6 w-6" />
        </button>

        <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-6">
          Registar Novo Dispositivo
        </h4>
        
        <form className="grid grid-cols-1 gap-5" onSubmit={handleSubmit}>
          {/* Nome do Dispositivo */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2 ml-1 dark:text-white font-bold">Nome do Dispositivo</label>
            <input
              required
              type="text"
              value={nomeDispositivo}
              onChange={(e) => setNomeDispositivo(e.target.value)}
              placeholder="Ex: Frigorífico Smart"
              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
            />
          </div>

          {/* Marca e Modelo Lado a Lado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-2 ml-1 dark:text-white font-bold">Marca</label>
              <input
                required
                type="text"
                value={nomeMarca}
                onChange={(e) => setNomeMarca(e.target.value)}
                placeholder="Ex: LG"
                className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-gray-600 mb-2 ml-1 dark:text-white font-bold">Modelo</label>
              <input
                required
                type="text"
                value={nomeModelo}
                onChange={(e) => setNomeModelo(e.target.value)}
                placeholder="Ex: V-1200"
                className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
              />
            </div>
          </div>

          {/* Espaço Associado (Dropdown) */}
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-2 ml-1 dark:text-white font-bold">Espaço Associado</label>
            <select 
              required
              value={espacoId}
              onChange={(e) => setEspacoId(e.target.value)}
              className="flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
            >
              <option value="">Selecionar divisão...</option>
              {listaEspacos.map((espaco) => (
                <option key={espaco.espacoId} value={espaco.espacoId}>
                  {espaco.nomeEspaco}
                </option>
              ))}
            </select>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className={`linear mt-4 w-full rounded-xl py-3 text-base font-medium text-white transition duration-200 ${
              isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-brand-500 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400"
            }`}
          >
            {isSubmitting ? "A registar..." : "Confirmar e Registar"}
          </button>
        </form>
      </Card>
    </div>
  );
};

export default AddDeviceModal;