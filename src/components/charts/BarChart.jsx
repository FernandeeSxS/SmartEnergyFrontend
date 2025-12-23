import React from "react";
import Chart from "react-apexcharts";

const BarChart = (props) => {
  const { chartData, chartOptions } = props;

  // Se não houver dados, não renderiza o Chart para não dar erro
  if (!chartData || chartData.length === 0 || !chartData[0].data) {
    return <div className="h-full w-full flex items-center justify-center text-gray-400">Carregando...</div>;
  }

  return (
    <Chart
      options={chartOptions}
      series={chartData}
      type="bar"
      width="100%"
      height="100%"
    />
  );
};

export default BarChart;