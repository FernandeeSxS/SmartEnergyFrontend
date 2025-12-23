import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "components/card";
import { apiRequest } from "services/api";

const DetalheDispositivo = () => {
  const { id } = useParams();
  const token = localStorage.getItem("userToken");

  const [dispositivo, setDispositivo] = useState(null);

  // Estados Editáveis para o Formulário de Configuração
  const [editNome, setEditNome] = useState("");
  const [editMarca, setEditMarca] = useState("");
  const [editModelo, setEditModelo] = useState("");
  const [editEspacoId, setEditEspacoId] = useState("");

  // Estado para Novo Registo de Consumo (DTO)
  const [editConsumo, setEditConsumo] = useState("");

  // Estados para dados de suporte
  const [listaEspacos, setListaEspacos] = useState([]);
  const [consumoAtual, setConsumoAtual] = useState("0.00 kWh");
  const [ultimoConsumo, setUltimoConsumo] = useState(null);
  const [precos, setPrecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDados = async () => {
    setLoading(true);
    try {
      const espacosData = await apiRequest("/espaco/utilizador", "GET", null, token);
      setListaEspacos(espacosData || []);

      const data = await apiRequest(`/dispositivo/${id}`, "GET", null, token);
      setDispositivo(data);
      setEditNome(data.nomeDispositivo);
      setEditEspacoId(data.espacoId);

      if (data.modeloDId) {
        const modeloData = await apiRequest(`/modelo/${data.modeloDId}`, "GET", null, token);
        setEditModelo(modeloData.nomeModelo || "");
        if (modeloData.marcaDId) {
          const marcaData = await apiRequest(`/marca/${modeloData.marcaDId}`, "GET", null, token);
          setEditMarca(marcaData.nomeMarca || "");
        }
      }

      const consumos = await apiRequest(`/consumo/dispositivo/${id}`, "GET", null, token);
      if (consumos && consumos.length > 0) {
        const ultimo = consumos[consumos.length - 1];
        setUltimoConsumo(ultimo);
        setConsumoAtual(`${ultimo.valorConsumido.toFixed(2)} kWh`);

        const registoId = ultimo.RegistoConsumoId || ultimo.registoConsumoId;
        if (registoId) {
          const precosData = await apiRequest(`/precoenergia/consumo/${registoId}`, "GET", null, token);
          setPrecos(precosData || []);
        }
      }
    } catch (err) {
      setError("Erro ao carregar os detalhes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDados();
  }, [id, token]);

  const handleGuardarAlteracoes = async () => {
    try {
      const input = {
        nomeDispositivo: editNome,
        nomeMarca: editMarca,
        nomeModelo: editModelo,
        espacoId: parseInt(editEspacoId)
      };
      await apiRequest(`/dispositivo/${id}`, "PUT", input, token);
      alert("Configurações atualizadas!");
      fetchDados();
    } catch (err) {
      alert("Falha ao guardar alterações.");
    }
  };

  const handleToggleStatus = async () => {
    try {
      const result = await apiRequest(`/dispositivo/${id}/toggle`, "POST", null, token);
      setDispositivo((prev) => ({ ...prev, status: result.status || result.Status }));
    } catch (err) {
      alert("Falha ao alterar o estado.");
    }
  };

  const handleObterGastos = async () => {
    if (!ultimoConsumo) return alert("Sem consumos registados.");
    try {
      const registoId = ultimoConsumo.RegistoConsumoId || ultimoConsumo.registoConsumoId;
      await apiRequest(`/precoenergia/registar?consumoRegistoId=${registoId}`, "POST", null, token);
      alert("Gastos registados com sucesso!");
      fetchDados();
    } catch (err) {
      alert("Erro ao registar gastos.");
    }
  };

  // FUNÇÃO ATUALIZADA PARA O NOVO ENDPOINT COM DTO
  const handleNovoRegistoConsumo = async () => {
    if (!editConsumo || parseFloat(editConsumo) < 0) {
      return alert("Insira um valor de consumo válido.");
    }

    try {
      const dto = {
        DispositivoId: parseInt(id),
        ValorConsumido: parseFloat(editConsumo),
        Observacoes: "Registo manual via dashboard"
      };

      // Chamada para o teu novo endpoint POST api/consumo
      await apiRequest("/consumo", "POST", dto, token);
      
      alert("Novo consumo registado com sucesso!");
      setEditConsumo(""); // Limpa o input
      fetchDados(); // Atualiza a UI com os novos valores
    } catch (err) {
      console.error(err);
      alert("Erro ao comunicar com o servidor para registar consumo.");
    }
  };

  if (loading) return <p className="p-5 text-center font-bold text-navy-700">Carregando detalhes...</p>;
  const isLigado = dispositivo?.status === "Ligado";

  return (
    <div className="flex w-full flex-col gap-5 mt-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        
        {/* CARD STATUS (ESQUERDA) */}
        <div className="col-span-12 lg:col-span-4">
          <Card extra={"flex flex-col items-center w-full h-full p-[16px] bg-white dark:bg-navy-800"}>
            <div className="mt-16 flex flex-col items-center">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">{dispositivo.nomeDispositivo}</h4>
              <p className="text-base font-medium text-brand-500">
                {listaEspacos.find(e => e.espacoId === parseInt(editEspacoId))?.nomeEspaco || "Sem Espaço"}
              </p>
            </div>
            <div className="mt-12 mb-3 flex gap-4 md:!gap-14">
              <div className="flex flex-col items-center justify-center text-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{consumoAtual}</p>
                <p className="text-sm font-normal text-gray-600">Última Leitura</p>
              </div>
              <div className="flex flex-col items-center justify-center text-center">
                <p className={`text-2xl font-bold ${isLigado ? "text-green-500" : "text-red-500"}`}>{dispositivo.status}</p>
                <p className="text-sm font-normal text-gray-600">Estado</p>
              </div>
            </div>
            <button onClick={handleToggleStatus} className={`mt-auto w-full rounded-xl py-3 text-white font-bold transition duration-200 ${isLigado ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
              {isLigado ? "Desligar Dispositivo" : "Ligar Dispositivo"}
            </button>
          </Card>
        </div>

        {/* CARD CONFIGURAÇÕES (DIREITA) */}
        <div className="col-span-12 lg:col-span-8">
          <Card extra={"w-full h-full min-h-[350px] p-4 flex flex-col bg-white dark:bg-navy-800"}>
            <h4 className="mb-6 px-2 text-xl font-bold text-navy-700 dark:text-white">Configurações do Dispositivo</h4>
            <div className="grid grid-cols-1 gap-4 px-2 md:grid-cols-2">
              <div className="flex flex-col mb-2">
                <label className="text-sm text-gray-600 dark:text-white font-bold ml-1">Nome</label>
                <input type="text" value={editNome} onChange={(e) => setEditNome(e.target.value)} className="mt-2 flex h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white" />
              </div>
              <div className="flex flex-col mb-2">
                <label className="text-sm text-gray-600 dark:text-white font-bold ml-1">Espaço / Divisão</label>
                <select value={editEspacoId} onChange={(e) => setEditEspacoId(e.target.value)} className="mt-2 flex h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white">
                  {listaEspacos.map((esp) => <option key={esp.espacoId} value={esp.espacoId}>{esp.nomeEspaco}</option>)}
                </select>
              </div>
              <div className="flex flex-col mb-2">
                <label className="text-sm text-gray-600 dark:text-white font-bold ml-1">Marca</label>
                <input type="text" value={editMarca} onChange={(e) => setEditMarca(e.target.value)} className="mt-2 flex h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white" />
              </div>
              <div className="flex flex-col mb-2">
                <label className="text-sm text-gray-600 dark:text-white font-bold ml-1">Modelo</label>
                <input type="text" value={editModelo} onChange={(e) => setEditModelo(e.target.value)} className="mt-2 flex h-12 w-full rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white" />
              </div>
            </div>
            <button onClick={handleGuardarAlteracoes} className="mt-auto w-full rounded-xl bg-brand-500 py-3 text-white font-bold transition duration-200 hover:bg-brand-600">
              Guardar Alterações
            </button>
          </Card>
        </div>
      </div>

      {/* MONITORIZAÇÃO E NOVO REGISTO */}
      <div className="w-full">
        <Card extra="bg-white dark:bg-navy-800 w-full px-6 py-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
            {/* LADO ESQUERDO: MONITORIZAÇÃO */}
            <div className="lg:col-span-5 flex flex-col items-center text-center lg:border-r border-gray-200 dark:border-white/10 lg:pr-10">
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white">Monitorização</h4>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 mb-6">Analise os gastos financeiros para a última leitura.</p>
              <button onClick={handleObterGastos} className="w-full px-6 py-4 bg-navy-700 text-white rounded-2xl font-bold text-lg hover:bg-navy-800 shadow-lg transition duration-200">Obter Gastos Associados</button>
            </div>
            {/* LADO DIREITO: NOVO REGISTO */}
            <div className="lg:col-span-7 flex flex-col">
              <h4 className="text-2xl font-bold text-navy-700 dark:text-white mb-2">Novo Registo de Consumo</h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">Insira o consumo atual do dispositivo (kWh/h).</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <input type="number" step="0.01" placeholder="Ex: 1.50" value={editConsumo} onChange={(e) => setEditConsumo(e.target.value)} className="h-12 flex-1 rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:border-white/10 dark:text-white" />
                <button onClick={handleNovoRegistoConsumo} className="h-12 px-8 bg-brand-500 text-white rounded-xl font-bold hover:bg-brand-600 shadow-md transition duration-200">Registar Valor</button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* TABELA DE HISTÓRICO */}
      {precos.length > 0 && (
        <Card extra="w-full p-4 mt-5 overflow-x-auto bg-white dark:bg-navy-800">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-4 px-2">Histórico de Custos por Hora</h4>
          <table className="w-full text-left border-collapse border border-gray-200 dark:border-white/10">
            <thead>
              <tr className="bg-gray-50 dark:bg-navy-700">
                <th className="border p-4 dark:text-white">Data/Hora</th>
                <th className="border p-4 dark:text-white">Consumo (kWh/h)</th>
                <th className="border p-4 dark:text-white">Preço Energia (€/kWh)</th>
                <th className="border p-4 text-brand-500 font-bold">Custo Estimado (€/h)</th>
              </tr>
            </thead>
            <tbody>
              {precos.map((p) => (
                <tr key={p.precoId} className="hover:bg-gray-50 dark:hover:bg-navy-700 transition-colors">
                  <td className="border p-4 dark:text-white">{new Date(p.timestamp).toLocaleString()}</td>
                  <td className="border p-4 dark:text-white">{ultimoConsumo?.valorConsumido.toFixed(2)}</td>
                  <td className="border p-4 dark:text-white">{p.precoPorKWh.toFixed(4)}</td>
                  <td className="border p-4 text-brand-500 font-bold">{(ultimoConsumo?.valorConsumido * p.precoPorKWh).toFixed(2)}€</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
};

export default DetalheDispositivo;