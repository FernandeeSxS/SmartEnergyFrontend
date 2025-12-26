import React, { useState } from "react";
import Card from "components/card";
import { MdDelete } from "react-icons/md";
import { apiRequest } from "services/api";

const NftCard = ({ id, title, author, price, extra, onViewDevices, onRefresh, dispositivoCount }) => {
  const [showModal, setShowModal] = useState(false);
  const token = localStorage.getItem("userToken");

  const handleDelete = async () => {
    try {
      await apiRequest(`/espaco/${id}`, "DELETE", null, token);
      setShowModal(false);
      if (onRefresh) onRefresh();
      alert("Espaço eliminado com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao eliminar o espaço.");
    }
  };

  const temDispositivos = dispositivoCount > 0;

  return (
    <>
      <Card extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white relative ${extra}`}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowModal(true);
          }}
          className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors duration-200"
        >
          <MdDelete className="h-6 w-6" />
        </button>

        <div className="h-full w-full">
          <div className="mb-3 flex flex-col mt-4">
            <p className="text-lg font-bold text-navy-700 dark:text-white">{title}</p>
            <p className="text-sm font-medium text-gray-600">Área: {author} m²</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm font-bold text-brand-500">Consumo: {price} kWh</p>
            <button
              onClick={onViewDevices}
              className="rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white hover:bg-brand-800"
            >
              Ver Dispositivos
            </button>
          </div>
        </div>
      </Card>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-navy-800 p-6 rounded-2xl shadow-xl max-w-sm w-full mx-4">
            <h3 className="text-xl font-bold text-navy-700 dark:text-white mb-2">Eliminar Espaço</h3>
            
            {/* MENSAGEM DINÂMICA AQUI */}
            <div className="text-gray-600 dark:text-gray-400 mb-6">
              {temDispositivos ? (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-100 dark:border-red-800">
                  <p className="text-sm text-red-700 dark:text-red-400 font-semibold">Atenção!</p>
                  <p className="text-sm">
                    Este espaço contém <b>{dispositivoCount} dispositivo(s)</b>. Se confirmar, todos os dispositivos e os seus históricos de consumo serão <b>eliminados permanentemente</b>.
                  </p>
                </div>
              ) : (
                <p>Tens a certeza que queres eliminar o espaço <b>{title}</b>?</p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-navy-700 text-navy-700 dark:text-white font-bold"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 px-4 py-2 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NftCard;