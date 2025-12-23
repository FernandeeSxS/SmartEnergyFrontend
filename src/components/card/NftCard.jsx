import Card from "components/card";

// Adicionada a prop 'onViewDevices' aqui
const NftCard = ({ title, author, price, image, extra, onViewDevices }) => {
  return (
    <Card
      extra={`flex flex-col w-full h-full !p-4 3xl:p-![18px] bg-white ${extra}`}
    >
      <div className="h-full w-full">
        <div className="relative w-full">
        </div>

        <div className="mb-3 flex items-center justify-between px-1 md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col xl:items-start 3xl:flex-row 3xl:justify-between">
          <div className="mb-2">
            <p className="text-lg font-bold text-navy-700 dark:text-white">
              {title}
            </p>
            <p className="mt-1 text-sm font-medium text-gray-600 md:mt-2">
              Área: {author}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between md:flex-col md:items-start lg:flex-row lg:justify-between xl:flex-col 2xl:items-start 3xl:flex-row 3xl:items-center 3xl:justify-between">
          <div className="flex">
            <p className="mb-2 text-sm font-bold text-brand-500 dark:text-white">
              Consumo Total: {price}
            </p>
          </div>
          {/* Adicionado o onClick para executar a navegação */}
          <button
            onClick={onViewDevices}
            className="linear rounded-[20px] bg-brand-900 px-4 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-800 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300 dark:active:opacity-90"
          >
            Ver Dispositivos
          </button>
        </div>
      </div>
    </Card>
  );
};

export default NftCard;