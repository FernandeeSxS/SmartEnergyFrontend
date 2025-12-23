import React from "react";
import Card from "components/card";
import BarChart from "components/charts/BarChart";
import { MdBarChart } from "react-icons/md";

const WeeklyRevenue = ({ dataBarra, categoriasBarra }) => {
  
  // Criamos as opções aqui dentro para garantir que elas recebem as categorias novas
  const chartOptions = {
    chart: { 
      toolbar: { show: false },
      stacked: false
    },
    tooltip: {
      theme: "dark",
      y: { formatter: (val) => `${val?.toFixed(2)} kWh` }
    },
    xaxis: {
      categories: categoriasBarra || [], // O NOME DOS ESPAÇOS ENTRA AQUI
      labels: { style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      labels: { 
        style: { colors: "#A3AED0", fontSize: "12px" },
        formatter: (val) => val?.toFixed(1)
      }
    },
    grid: { show: false },
    colors: ["#4318FF"], // Cor das barras
    plotOptions: {
      bar: { 
        borderRadius: 8, 
        columnWidth: "50%",
      },
    },
    dataLabels: { enabled: false },
  };

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Consumo por Espaço
        </h2>
        <button className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 dark:bg-navy-700 dark:text-white">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="md:mt-10">
        <div className="h-[250px] w-full xl:h-[350px]">
          {/* IMPORTANTE: Passamos dataBarra para a prop chartData do componente BarChart */}
          <BarChart chartData={dataBarra} chartOptions={chartOptions} />
        </div>
      </div>
    </Card>
  );
};

export default WeeklyRevenue;