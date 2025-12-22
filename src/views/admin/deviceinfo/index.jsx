import React, { useState } from "react";
import Card from "components/card";

const DetalheDispositivo = () => {
  const [consumoAtual, setConsumoAtual] = useState("1.2 kWh");

  const dispositivo = {
    nome: "Frigorífico Samsung",
    modelo: "RT38K5530S8",
    estado: "Ligado",
    localizacao: "Cozinha"
  };

  const handleObterConsumo = () => {
    alert("A ligar ao dispositivo para ler sensores...");
    setConsumoAtual("1.45 kWh"); 
  };

  return (
    <div className="flex w-full flex-col gap-5 mt-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        
        {/* Coluna Esquerda: Imagem e Status */}
        <div className="col-span-12 lg:col-span-4 lg:!mb-0">
          <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
            <div className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-gradient-to-r from-brandLinear to-brand-500" />
            
            <div className="mt-16 flex flex-col items-center">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">
                {dispositivo.nome}
              </h4>
              <p className="text-base font-normal text-gray-600">{dispositivo.localizacao}</p>
            </div>

            <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{consumoAtual}</p>
                <p className="text-sm font-normal text-gray-600">Última Leitura</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-green-500">{dispositivo.estado}</p>
                <p className="text-sm font-normal text-gray-600">Estado</p>
              </div>
            </div>

            <button className="mt-4 w-full rounded-xl bg-red-500 py-3 text-white font-bold transition duration-200 hover:bg-red-600">
              Desligar Dispositivo
            </button>
          </Card>
        </div>

        {/* Coluna Direita: Configurações (Ajustada para encostar o botão abaixo) */}
        <div className="col-span-12 lg:col-span-8">
          {/* Adicionada a classe 'flex flex-col' no Card */}
          <Card extra={"w-full h-full p-4 flex flex-col"}>
            <h4 className="mb-[30px] px-2 text-xl font-bold text-navy-700 dark:text-white">
              Configurações do Dispositivo
            </h4>
            
            <div className="grid grid-cols-1 gap-4 px-2 md:grid-cols-2">
              <div className="flex flex-col mb-4">
                <label className="text-sm text-gray-600 dark:text-white ml-1 font-bold">Nome</label>
                <input 
                  type="text" 
                  defaultValue={dispositivo.nome}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                />
              </div>

              <div className="flex flex-col mb-4">
                <label className="text-sm text-gray-600 dark:text-white ml-1 font-bold">Modelo</label>
                <input 
                  type="text" 
                  defaultValue={dispositivo.modelo}
                  className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white"
                />
              </div>

              <div className="flex flex-col mb-4 md:col-span-2">
                <label className="text-sm text-gray-600 dark:text-white ml-1 font-bold">Espaço / Divisão</label>
                <select className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white dark:bg-navy-800">
                  <option value="cozinha">Cozinha</option>
                  <option value="sala">Sala de Estar</option>
                  <option value="quarto">Quarto</option>
                </select>
              </div>
            </div>

            {/* O 'mt-auto' faz com que o botão seja empurrado para o fim do card */}
            <button className="mt-auto w-full rounded-xl bg-brand-500 py-3 text-white font-bold transition duration-200 hover:bg-brand-600">
              Guardar Alterações
            </button>
          </Card>
        </div>
      </div>

      {/* Terceiro Card: Monitorização */}
      <div className="w-full">
        <Card extra="flex-col bg-white w-full px-6 py-10 items-center justify-center">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">
              Monitorização em Tempo Real
            </h4>
            <p className="mt-2 text-sm text-gray-600 mb-6">
              Clique no botão abaixo para ler os sensores do {dispositivo.nome} agora.
            </p>
            <button 
              onClick={handleObterConsumo}
              className="px-10 py-4 bg-navy-700 text-white rounded-2xl font-bold text-lg transition duration-200 hover:bg-navy-800 dark:bg-white dark:text-navy-700 dark:hover:bg-white/90 shadow-lg"
            >
              Obter Consumo Atual
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DetalheDispositivo;