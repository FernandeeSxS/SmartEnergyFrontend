import React from "react";
import PieChart from "components/charts/PieChart";
import Card from "components/card";

const PieChartCard = ({ dispositivos }) => {
  const temDados = dispositivos && dispositivos.length > 0;
  
  const chartSeries = temDados ? dispositivos.map((d) => parseFloat(d.ultimoConsumo || 0)) : [];
  const chartLabels = temDados ? dispositivos.map((d) => d.nomeDispositivo) : [];

  let dispositivosExtremos = [];
  if (temDados && dispositivos.length >= 2) {
    const ordenados = [...dispositivos].sort((a, b) => 
      parseFloat(b.ultimoConsumo || 0) - parseFloat(a.ultimoConsumo || 0)
    );
    dispositivosExtremos = [ordenados[0], ordenados[ordenados.length - 1]];
  }

  const options = {
    labels: chartLabels,
    colors: ["#4318FF", "#6AD2FF", "#2BB2FE", "#ffb54c", "#ef4444"],
    chart: { width: "100%", sparkline: { enabled: false } },
    states: { hover: { filter: { type: "none" } } },
    legend: { show: false },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: { size: "75%", labels: { show: false } },
      },
    },
    tooltip: { enabled: true, theme: "dark" },
  };

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2 mb-10">
        <h4 className="text-lg font-bold text-navy-700 dark:text-white">
          Consumo por Dispositivo
        </h4>
      </div>

      <div className="mb-2 flex h-[220px] w-full items-center justify-center">
        {temDados ? (
          <PieChart options={options} series={chartSeries} />
        ) : (
          <div className="text-sm text-gray-500">Sem dados de consumo</div>
        )}
      </div>

      <div className="mt-6 flex flex-row flex-wrap justify-around gap-x-2 rounded-2xl px-2 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        {dispositivosExtremos.length > 0 ? (
          dispositivosExtremos.map((d, index) => {
            const originalIndex = dispositivos.findIndex(orig => orig.dispositivoId === d.dispositivoId);
            const dotColors = ["bg-[#4318FF]", "bg-[#6AD2FF]", "bg-[#2BB2FE]", "bg-[#ffb54c]", "bg-[#ef4444]"];
            
            return (
              <React.Fragment key={d.dispositivoId}>
                <div className="flex flex-col items-center justify-center min-w-[80px]">
                  <div className="flex items-center justify-center">
                    {/* Bolinha menor: h-2 w-2 */}
                    <div className={`h-2 w-2 rounded-full ${dotColors[originalIndex % dotColors.length]}`} />
                    {/* Texto menor: text-xs */}
                    <p className="ml-1 text-s font-medium text-gray-600 dark:text-gray-400 whitespace-nowrap">
                      {d.nomeDispositivo} {index === 0 ? "↑" : "↓"}
                    </p>
                  </div>
                  {/* Percentagem menor: text-lg */}
                  <p className="mt-px text-lg font-bold text-navy-700 dark:text-white">
                    {chartSeries.reduce((a, b) => a + b, 0) > 0 
                      ? ((parseFloat(d.ultimoConsumo) / chartSeries.reduce((a, b) => a + b, 0)) * 100).toFixed(0) 
                      : 0}%
                  </p>
                </div>
                {index === 0 && <div className="h-8 w-px bg-gray-300 dark:bg-white/10" />}
              </React.Fragment>
            );
          })
        ) : (
          <p className="text-xs text-gray-400 text-center">Dados insuficientes</p>
        )}
      </div>
    </Card>
  );
};

export default PieChartCard;