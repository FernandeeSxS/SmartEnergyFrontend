import React, { useEffect, useState } from "react";
import {
  MdOutlineMapsHomeWork,
  MdDevices,
  MdElectricBolt,
  MdAttachMoney
} from "react-icons/md";

// Componentes da UI
import Widget from "components/widget/Widget";
import TotalSpent from "views/admin/default/components/TotalSpent";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import PieChartCard from "views/admin/default/components/PieChartCard";
import DispositivosPorEspaco from "views/admin/default/components/DailyTraffic";
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
  const [dispositivosPorEspacoData, setDispositivosPorEspacoData] = useState([]);

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

      const [espacosRaw, dispositivosRaw, totalKwh, precoKwh, todosConsumos] = await Promise.all([
        apiRequest("/espaco/utilizador", "GET", null, token),
        apiRequest("/Dispositivo/utilizador", "GET", null, token),
        apiRequest("/consumo/total", "GET", null, token),
        apiRequest("/precoenergia/valor-atual", "GET", null, token),
        apiRequest("/consumo/meusConsumos", "GET", null, token),
      ]);

      const dadosContagem = espacosRaw.map(espaco => {
        const dispositivosNesteEspaco = dispositivosRaw.filter(
          disp => String(disp.espacoId) === String(espaco.espacoId || espaco.id)
        );
        return {
          nome: espaco.nomeEspaco || espaco.nome,
          quantidade: dispositivosNesteEspaco.length
        };
      });

      setDispositivosPorEspacoData(dadosContagem);

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
          } catch { return { ...disp, ultimoConsumo: 0 }; }
        })
      );

      const consumosPorEspaco = await Promise.all(
        espacosRaw.map(async (espaco) => {
          try {
            const id = espaco.espacoId || espaco.id;
            const consumoTotal = await apiRequest(`/consumo/espaco/${id}/total`, "GET", null, token);
            return {
              nome: espaco.nomeEspaco || espaco.nome,
              valor: parseFloat(consumoTotal || 0)
            };
          } catch { return null; }
        })
      );

      const dadosEspacosValidos = consumosPorEspaco.filter(item => item !== null);

      setBarChartData({
        series: [{ name: "Consumo Total (kWh)", data: dadosEspacosValidos.map(d => d.valor) }],
        categories: dadosEspacosValidos.map(d => d.nome)
      });

      setLineChartData(processarHistoricoSeteDias(todosConsumos));

      const consumoFinalNum = parseFloat(totalKwh || 0);
      const precoAtualNum = parseFloat(precoKwh || 0.15);

      setData({
        espacosCount: espacosRaw.length,
        dispositivosCount: dispositivosRaw.length,
        consumoKwh: consumoFinalNum.toFixed(2),
        consumoEuro: (consumoFinalNum * precoAtualNum).toFixed(2),
        listaDispositivos: dispositivosComConsumo,
      });

    } catch (err) {
      console.error("Erro ao carregar dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, [token]);

  return (
    <div className="pt-3">
      {/* 1. Widgets de Sumário (4 Colunas) */}
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Widget 
          icon={<MdOutlineMapsHomeWork className="h-7 w-7" />} 
          title="Espaços Ativos" 
          subtitle={loading ? "..." : data.espacosCount} 
        />
        <Widget 
          icon={<MdDevices className="h-6 w-6" />} 
          title="Dispositivos" 
          subtitle={loading ? "..." : data.dispositivosCount} 
        />
        <Widget 
          icon={<MdElectricBolt className="h-7 w-7" />} 
          title="Consumo Total" 
          subtitle={`${data.consumoKwh} kWh`} 
        />
        <Widget 
          icon={<MdAttachMoney className="h-6 w-6" />} 
          title="Custo Estimado" 
          subtitle={`${data.consumoEuro}€`} 
        />
      </div>

      {/* 2. Primeira Linha de Gráficos (2 Colunas) */}
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

      {/* 3. Segunda Linha de Gráficos (2 Colunas - Iguais às de cima) */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          <DispositivosPorEspaco data={dispositivosPorEspacoData} />
          <PieChartCard dispositivos={data.listaDispositivos} />
      </div>
    </div>
  );
};

export default Dashboard;