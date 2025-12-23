import React, { useEffect, useState } from "react";
import { MdBarChart, MdDashboard } from "react-icons/md";
import { IoDocuments } from "react-icons/io5";

// Componentes da UI
import Widget from "components/widget/Widget";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import PieChartCard from "views/admin/default/components/PieChartCard";
import CheckTable from "views/admin/default/components/CheckTable";

import { columnsDataCheck } from "./variables/columnsData";
import tableDataCheck from "./variables/tableDataCheck.json";
import { apiRequest } from "services/api";

const Dashboard = () => {
  const [data, setData] = useState({
    espacosCount: 0,
    dispositivosCount: 0,
    consumoKwh: 0,
    consumoEuro: 0,
    pegadaCarbono: 0,
    listaDispositivos: [],
  });

  const [chartData, setChartData] = useState({ series: [], categories: [] });
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");

  // FUNÇÃO: Gerar os últimos 7 dias e calcular o acumulado
  const processarHistoricoSeteDiasAcumulado = (historico) => {
    if (!historico) return { series: [], categories: [] };

    const labels = [];
    const datasParaComparar = [];

    // 1. Gerar as datas dos últimos 7 dias (de 6 dias atrás até hoje)
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
      datasParaComparar.push(d.toISOString().split("T")[0]);
    }

    // 2. Calcular o acumulado total ANTES do início da janela de 7 dias
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 6);
    dataLimite.setHours(0, 0, 0, 0);

    let somaAcumulada = historico
      .filter((reg) => new Date(reg.timestamp) < dataLimite)
      .reduce((acc, curr) => acc + parseFloat(curr.valorConsumido || 0), 0);

    // 3. Mapear o acumulado dia a dia dentro da janela
    const serieDados = datasParaComparar.map((dataIso) => {
      const consumoDoDia = historico
        .filter((reg) => reg.timestamp.startsWith(dataIso))
        .reduce((acc, curr) => acc + parseFloat(curr.valorConsumido || 0), 0);
      
      somaAcumulada += consumoDoDia;
      return parseFloat(somaAcumulada.toFixed(2));
    });

    return {
      series: [{ name: "Consumo Total (kWh)", data: serieDados }],
      categories: labels,
    };
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [espacos, dispositivos, totalKwh, precoKwh, todosConsumos] = await Promise.all([
        apiRequest("/espaco/utilizador", "GET", null, token),
        apiRequest("/Dispositivo/utilizador", "GET", null, token),
        apiRequest("/consumo/total", "GET", null, token),
        apiRequest("/precoenergia/valor-atual", "GET", null, token),
        apiRequest("/consumo/meusConsumos", "GET", null, token),
      ]);

      // PieChart Logic (dispositivos com consumo mais recente)
      const dispositivosComDados = await Promise.all(
        dispositivos.map(async (disp) => {
          try {
            const hist = await apiRequest(`/consumo/dispositivo/${disp.dispositivoId}`, "GET", null, token);
            let ultimo = 0;
            if (hist && hist.length > 0) {
              const rec = hist.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
              ultimo = parseFloat(rec.valorConsumido || 0);
            }
            return { ...disp, ultimoConsumo: ultimo };
          } catch { return { ...disp, ultimoConsumo: 0 }; }
        })
      );

      setChartData(processarHistoricoSeteDiasAcumulado(todosConsumos));

      const consumoFinal = parseFloat(totalKwh || 0);
      const precoAtual = parseFloat(precoKwh) > 0 ? parseFloat(precoKwh) : 0.15;

      setData({
        espacosCount: espacos?.length || 0,
        dispositivosCount: dispositivos?.length || 0,
        consumoKwh: consumoFinal.toFixed(2),
        consumoEuro: (consumoFinal * precoAtual).toFixed(2),
        pegadaCarbono: (consumoFinal * 0.475).toFixed(2),
        listaDispositivos: dispositivosComDados,
      });
    } catch (err) {
      console.error("Erro Dashboard:", err);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchDashboardStats(); }, [token]);

  return (
    <div className="pt-3">
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-6">
        <Widget icon={<MdBarChart className="h-7 w-7" />} title="Espaços" subtitle={loading ? "..." : data.espacosCount} />
        <Widget icon={<IoDocuments className="h-6 w-6" />} title="Dispositivos" subtitle={loading ? "..." : data.dispositivosCount} />
        <Widget icon={<MdBarChart className="h-7 w-7" />} title="Consumo Global" subtitle={`${data.consumoKwh} kWh`} />
        <Widget icon={<MdDashboard className="h-6 w-6" />} title="Custo Estimado" subtitle={`${data.consumoEuro}€`} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent 
          totalGasto={data.consumoEuro} 
          series={chartData.series} 
          categories={chartData.categories} 
        />
        <WeeklyRevenue />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard dispositivos={data.listaDispositivos} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;