import React from "react";
import DeviceCard from "components/card/DeviceCard";
import NFt3 from "assets/img/nfts/Nft3.png"; 
import NFt2 from "assets/img/nfts/Nft2.png"; // Importei outra imagem para variar

const DetalheEspaco = () => {
  const nomeEspaco = "Cozinha"; 

  const dispositivosNaCozinha = [
    { nome: "Frigorífico", consumo: "1.2", imagem: NFt3 },
    { nome: "Micro-ondas", consumo: "0.8", imagem: NFt2 }
  ];

  return (
    <div className="mt-5 h-full w-full">
      <div className="mb-6 px-4">
        <h4 className="text-3xl font-bold text-navy-700 dark:text-white">
          Dispositivos: {nomeEspaco}
        </h4>
        <p className="text-sm text-gray-600">A visualizar equipamentos desta divisão.</p>
      </div>

      {/* Grid de Dispositivos */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {dispositivosNaCozinha.map((device, index) => (
          <DeviceCard
            key={index}
            title={device.nome}
            consumption={device.consumo}
            image={device.imagem} // CORREÇÃO: Usar 'imagem' para corresponder ao objeto acima
          />
        ))}
      </div>
    </div>
  );
};

export default DetalheEspaco;