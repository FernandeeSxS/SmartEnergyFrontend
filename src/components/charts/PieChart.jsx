import Chart from "react-apexcharts";

const PieChart = (props) => {
  const { series, options } = props;

  return (
    <Chart
      options={options}
      type="donut" // 'donut' costuma ficar melhor que 'pie' no Horizon UI
      width="100%"
      height="100%"
      series={series}
    />
  );
};

export default PieChart;