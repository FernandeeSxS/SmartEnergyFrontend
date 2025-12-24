import BarChart from "components/charts/BarChart";
import Card from "components/card";
import React from "react";

const DispositivosPorEspaco = ({ data }) => {
  const chartData = [
    {
      name: "Dispositivos",
      data: data?.map((item) => item.quantidade) || [],
    },
  ];

  const chartOptions = {
    chart: { 
      toolbar: { show: false },
    },
    tooltip: { style: { fontSize: "12px" }, theme: "dark" },
    xaxis: {
      categories: data?.map((item) => item.nome) || [],
      labels: {
        show: true,
        style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      tickAmount: 5,
      labels: {
        show: true,
        style: { colors: "#A3AED0", fontSize: "12px", fontWeight: "500" },
        formatter: (val) => val.toFixed(0),
      },
    },
    grid: {
      show: true,
      borderColor: "rgba(163, 174, 208, 0.1)",
      strokeDashArray: 5,
      yaxis: { lines: { show: true } },
      xaxis: { lines: { show: false } },
    },
    fill: {
      type: "solid",
      opacity: 1,
    },
    colors: ["#4318FF"],
    dataLabels: { 
      enabled: true,
      style: {
        fontSize: "12px",
        fontWeight: "700",
        colors: ["#4318FF"],
      },
      offsetY: -25,
      background: {
        enabled: true,
        foreColor: "#fff",
        padding: 4,
        borderRadius: 4,
        borderWidth: 0,
        opacity: 0.9,
      }
    },
    plotOptions: {
      bar: { 
        borderRadius: 8, 
        columnWidth: "35px",
        dataLabels: {
          position: 'top', 
        },
      },
    },
  };

  return (
    <Card extra="pb-7 p-[20px]">
      {/* Adicionado mb-6 para criar o gap entre título e gráfico */}
      <div className="flex flex-row justify-between mb-6">
        <div className="ml-1 pt-2">
          <p className="text-[18px] font-bold text-navy-700 dark:text-white">
            Distribuição dos Dispositivos por Espaço
          </p>
        </div>
      </div>
      
      {/* Container do gráfico */}
      <div className="h-[300px] w-full">
        <BarChart chartData={chartData} chartOptions={chartOptions} />
      </div>
    </Card>
  );
};

export default DispositivosPorEspaco;