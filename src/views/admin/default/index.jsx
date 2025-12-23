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
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("userToken");

  const [data, setData] = useState({
    espacosCount: 0,
    dispositivosCount: 0,
    consumoKwh: 0,
    consumoEuro: 0,
    listaDispositivos: [],
  });

  const [lineChartData, setLineChartData] = useState({ series: [], categories: [] });
  const [barChartData, setBarChartData] = useState({ series: [], categories: [] });

  const processarHistoricoSeteDias = (historico) => {
    if (!historico || historico.length === 0) return { series: [], categories: [] };
    const labels = [];
    const datasParaComparar = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(`${d.getDate()}/${d.getMonth() + 1}`);
      datasParaComparar.push(d.toISOString().split("T")[0]);
    }
    const dataLimite = new Date();
    dataLimite.setDate(dataLimite.getDate() - 6);
    dataLimite.setHours(0, 0, 0, 0);

    let somaAcumulada = historico
      .filter((reg) => new Date(reg.timestamp) < dataLimite)
      .reduce((acc, curr) => acc + parseFloat(curr.valorConsumido || 0), 0);

    const serieDados = datasParaComparar.map((dataIso) => {
      const consumoDoDia = historico
        .filter((reg) => reg.timestamp.startsWith(dataIso))
        .reduce((acc, curr) => acc + parseFloat(curr.valorConsumido || 0), 0);
      somaAcumulada += consumoDoDia;
      return parseFloat(somaAcumulada.toFixed(2));
    });

    return {
      series: [{ name: "Consumo Acumulado", data: serieDados }],
      categories: labels,
    };
  };

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);

      const [dispositivosRaw, totalKwh, precoKwh, todosConsumos] = await Promise.all([
        apiRequest("/Dispositivo/utilizador", "GET", null, token),
        apiRequest("/consumo/total", "GET", null, token),
        apiRequest("/precoenergia/valor-atual", "GET", null, token),
        apiRequest("/consumo/meusConsumos", "GET", null, token),
      ]);

      // --- RECUPERAR CONSUMO POR DISPOSITIVO (Para o PieChart não ficar em branco) ---
      const dispositivosComConsumo = await Promise.all(
        dispositivosRaw.map(async (disp) => {
          try {
            const hist = await apiRequest(`/consumo/dispositivo/${disp.dispositivoId}`, "GET", null, token);
            let ultimo = 0;
            if (hist && hist.length > 0) {
              const rec = hist.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
              ultimo = parseFloat(rec.valorConsumido || 0);
            }
            return { ...disp, ultimoConsumo: ultimo };
          } catch {
            return { ...disp, ultimoConsumo: 0 };
          }
        })
      );

      // --- LÓGICA DE ESPAÇOS (Para o WeeklyRevenue) ---
      const espacoIdsUnicos = [...new Set(dispositivosRaw.map(d => d.espacoId))];

      const consumosPorEspaco = await Promise.all(
        espacoIdsUnicos.map(async (id) => {
          try {
            const infoEspaco = await apiRequest(`/espaco/${id}`, "GET", null, token);
            const consumoTotal = await apiRequest(`/consumo/espaco/${id}/total`, "GET", null, token);
            return {
              nome: infoEspaco.nomeEspaco || infoEspaco.nome || `Espaço ${id}`,
              valor: parseFloat(consumoTotal || 0)
            };
          } catch (err) {
            return null;
          }
        })
      );

      const dadosEspacosValidos = consumosPorEspaco.filter(item => item !== null);

      // --- ATUALIZAR ESTADOS ---
      setBarChartData({
        series: [{ name: "Consumo Total (kWh)", data: dadosEspacosValidos.map(d => d.valor) }],
        categories: dadosEspacosValidos.map(d => d.nome)
      });

      setLineChartData(processarHistoricoSeteDias(todosConsumos));

      const consumoFinalNum = parseFloat(totalKwh || 0);
      const precoAtualNum = parseFloat(precoKwh || 0.15);

      setData({
        espacosCount: espacoIdsUnicos.length,
        dispositivosCount: dispositivosRaw.length,
        consumoKwh: consumoFinalNum.toFixed(2),
        consumoEuro: (consumoFinalNum * precoAtualNum).toFixed(2),
        listaDispositivos: dispositivosComConsumo, // Agora com ultimoConsumo!
      });

    } catch (err) {
      console.error("Erro geral no Dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [token]);

  return (
    <div className="pt-3">
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget icon={<MdBarChart className="h-7 w-7" />} title="Espaços Ativos" subtitle={loading ? "..." : data.espacosCount} />
        <Widget icon={<IoDocuments className="h-6 w-6" />} title="Dispositivos" subtitle={loading ? "..." : data.dispositivosCount} />
        <Widget icon={<MdBarChart className="h-7 w-7" />} title="Consumo Total" subtitle={`${data.consumoKwh} kWh`} />
        <Widget icon={<MdDashboard className="h-6 w-6" />} title="Custo Estimado" subtitle={`${data.consumoEuro}€`} />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent 
          totalGasto={data.consumoEuro} 
          series={lineChartData.series} 
          categories={lineChartData.categories} 
        />
        <WeeklyRevenue 
          dataBarra={barChartData.series} 
          categoriasBarra={barChartData.categories} 
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        <CheckTable columnsData={columnsDataCheck} tableData={tableDataCheck} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <DailyTraffic />
          {/* Aqui estava o bug: listaDispositivos agora tem os consumos individuais de volta */}
          <PieChartCard dispositivos={data.listaDispositivos} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;