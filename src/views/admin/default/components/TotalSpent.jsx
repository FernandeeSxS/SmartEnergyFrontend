import React from "react";
import { MdArrowDropUp, MdOutlineCalendarToday, MdBarChart } from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import { lineChartOptionsTotalSpent } from "variables/charts";

const TotalSpent = ({ totalGasto, series, categories }) => {
  
  const options = {
    ...lineChartOptionsTotalSpent,
    xaxis: {
      ...lineChartOptionsTotalSpent.xaxis,
      categories: categories,
    },
    stroke: { curve: "smooth", width: 3 },
    markers: {
      size: 4,
      colors: ["#4318FF"],
      strokeColors: "#fff",
      strokeWidth: 2,
    },
    tooltip: { theme: "dark", y: { formatter: (val) => `${val} kWh` } }
  };

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <button className="flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 dark:bg-navy-700">
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium">Últimos 7 dias</span>
        </button>
        <button className="flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 dark:bg-navy-700 dark:text-white">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap">
        <div className="flex flex-col text-left">
          <p className="mt-[20px] text-3xl font-bold text-navy-700 dark:text-white">
            {totalGasto}€
          </p>
          <div className="flex flex-col items-start">
            <p className="mt-2 text-sm text-gray-600">Total Acumulado (kWh)</p>
            <div className="flex flex-row items-center">
            </div>
          </div>
        </div>

        <div className="h-full w-full">
          {series.length > 0 ? (
            <LineChart options={options} series={series} />
          ) : (
            <div className="flex h-full items-center justify-center text-gray-400">
              A gerar gráfico...
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;