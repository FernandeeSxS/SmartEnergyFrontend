import Card from "components/card";

// Adicionamos 'onViewDetails' às props
const DeviceCard = ({ title, consumption, extra, onViewDetails }) => {
  return (
    <Card
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <div className="h-full w-full flex flex-col justify-between">
        <div>
          {/* Imagem do Dispositivo */}
          <div className="relative w-full">
          </div>

          {/* Informação Principal: Título e Consumo */}
          <div className="mb-6 flex flex-col items-start px-1">
            <p className="text-lg font-bold text-navy-700 dark:text-white">
              {title}
            </p>
            <p className="mt-1 text-sm font-bold text-brand-500 dark:text-white">
              Consumo Atual: <span className="text-navy-700 dark:text-white">{consumption} kWh</span>
            </p>
          </div>
        </div>

        {/* Botão Centrado na Base */}
        <div className="flex items-center justify-center">
          <button
            onClick={onViewDetails} // AQUI: Liga o clique à função de navegação
            className="w-full linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90"
          >
            Ver Detalhes
          </button>
        </div>
      </div>
    </Card>
  );
};

export default DeviceCard;