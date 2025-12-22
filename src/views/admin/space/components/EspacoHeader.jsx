import Card from "components/card";

const EspacoHeader = ({ nome, totalConsumo }) => (
  <Card extra={"w-full p-4 h-fit"}>
    <div className="flex flex-col">
      <h4 className="text-3xl font-bold text-navy-700 dark:text-white">
        Dispositivos em: {nome}
      </h4>
      <p className="mt-2 text-sm text-gray-600">
        Consumo total desta divisão: <span className="font-bold text-brand-500">{totalConsumo}</span>
      </p>
    </div>
  </Card>
);

export default EspacoHeader;