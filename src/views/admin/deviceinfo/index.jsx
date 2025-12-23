import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Card from "components/card";
import { apiRequest } from "services/api";

const DetalheDispositivo = () => {
  const { id } = useParams();
  const token = localStorage.getItem("userToken");

  const [dispositivo, setDispositivo] = useState(null);
  const [nomeModelo, setNomeModelo] = useState("");
  const [nomeEspaco, setNomeEspaco] = useState("");
  const [consumoAtual, setConsumoAtual] = useState("0 kWh");
  const [ultimoConsumo, setUltimoConsumo] = useState(null);
  const [precos, setPrecos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDispositivo = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/dispositivo/${id}`, "GET", null, token);
        setDispositivo(data);

        if (data.modeloDId) {
          const modeloData = await apiRequest(`/modelo/${data.modeloDId}`, "GET", null, token);
          setNomeModelo(modeloData.nomeModelo || "Desconhecido");
        }

        if (data.espacoId) {
          const espacoData = await apiRequest(`/espaco/${data.espacoId}`, "GET", null, token);
          setNomeEspaco(espacoData.nomeEspaco || "Desconhecido");
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
        } else {
          setConsumoAtual("0 kWh");
        }
      } catch (err) {
        console.error("Erro ao buscar dispositivo:", err);
        setError("Não foi possível carregar os detalhes do dispositivo.");
      } finally {
        setLoading(false);
      }
    };

    fetchDispositivo();
  }, [id, token]);

  // FUNÇÃO TOGGLE INTEGRADA
  const handleToggleStatus = async () => {
    try {
      const result = await apiRequest(`/dispositivo/${id}/toggle`, "POST", null, token);
      
      // Atualiza apenas o status no estado para refletir no botão e no texto
      setDispositivo((prev) => ({
        ...prev,
        status: result.status || result.Status
      }));

    } catch (err) {
      console.error("Erro ao alterar status:", err);
      alert("Falha ao alterar o estado do dispositivo.");
    }
  };

  const handleObterGastos = async () => {
    if (!ultimoConsumo) return;
    try {
      const registoId = ultimoConsumo.RegistoConsumoId || ultimoConsumo.registoConsumoId;
      if (!registoId) {
        alert("ID de registo do consumo não encontrado.");
        return;
      }
      await apiRequest(`/precoenergia/registar?consumoRegistoId=${registoId}`, "POST", null, token);
      alert("Gastos associados ao consumo registados com sucesso!");
      const precosData = await apiRequest(`/precoenergia/consumo/${registoId}`, "GET", null, token);
      setPrecos(precosData || []);
    } catch (err) {
      console.error("Erro ao registar gastos:", err);
      alert("Falha ao registar gastos associados ao consumo.");
    }
  };

  if (loading) return <p>Carregando dispositivo...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!dispositivo) return <p>Dispositivo não encontrado.</p>;

  // Lógica para controle do botão
  const isLigado = dispositivo.status === "Ligado";

  return (
    <div className="flex w-full flex-col gap-5 mt-5">
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-12 lg:col-span-4 lg:!mb-0">
          <Card extra={"items-center w-full h-full p-[16px] bg-cover"}>
            <div className="mt-16 flex flex-col items-center">
              <h4 className="text-xl font-bold text-navy-700 dark:text-white">{dispositivo.nomeDispositivo}</h4>
              <p className="text-base font-normal text-gray-600">{nomeEspaco}</p>
            </div>

            <div className="mt-6 mb-3 flex gap-4 md:!gap-14">
              <div className="flex flex-col items-center justify-center">
                <p className="text-2xl font-bold text-navy-700 dark:text-white">{consumoAtual}</p>
                <p className="text-sm font-normal text-gray-600">Última Leitura</p>
              </div>
              <div className="flex flex-col items-center justify-center">
                <p className={`text-2xl font-bold ${isLigado ? "text-green-500" : "text-red-500"}`}>
                  {dispositivo.status || "Desconhecido"}
                </p>
                <p className="text-sm font-normal text-gray-600">Estado</p>
              </div>
            </div>

            {/* BOTÃO ATUALIZADO: DINÂMICO EM COR E TEXTO */}
            <button 
              onClick={handleToggleStatus}
              className={`mt-4 w-full rounded-xl py-3 text-white font-bold transition duration-200 ${
                isLigado ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
              }`}
            >
              {isLigado ? "Desligar Dispositivo" : "Ligar Dispositivo"}
            </button>
          </Card>
        </div>

        <div className="col-span-12 lg:col-span-8">
          <Card extra={"w-full h-full p-4 flex flex-col"}>
            <h4 className="mb-[30px] px-2 text-xl font-bold text-navy-700 dark:text-white">Configurações do Dispositivo</h4>
            <div className="grid grid-cols-1 gap-4 px-2 md:grid-cols-2">
              <div className="flex flex-col mb-4">
                <label className="text-sm text-gray-600 dark:text-white ml-1 font-bold">Nome</label>
                <input type="text" defaultValue={dispositivo.nomeDispositivo} className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white" />
              </div>
              <div className="flex flex-col mb-4">
                <label className="text-sm text-gray-600 dark:text-white ml-1 font-bold">Modelo</label>
                <input type="text" value={nomeModelo || "Desconhecido"} readOnly className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white" />
              </div>
              <div className="flex flex-col mb-4 md:col-span-2">
                <label className="text-sm text-gray-600 dark:text-white ml-1 font-bold">Espaço / Divisão</label>
                <input type="text" value={nomeEspaco || "Desconhecido"} readOnly className="mt-2 flex h-12 w-full items-center justify-center rounded-xl border bg-white/0 p-3 text-sm outline-none border-gray-200 dark:!border-white/10 dark:text-white" />
              </div>
            </div>
            <button className="mt-auto w-full rounded-xl bg-brand-500 py-3 text-white font-bold transition duration-200 hover:bg-brand-600">
              Guardar Alterações
            </button>
          </Card>
        </div>
      </div>

      <div className="w-full">
        <Card extra="flex-col bg-white w-full px-6 py-10 items-center justify-center">
          <div className="text-center">
            <h4 className="text-2xl font-bold text-navy-700 dark:text-white">Monitorização em Tempo Real</h4>
            <p className="mt-2 text-sm text-gray-600 mb-6">
              Clique no botão abaixo para obter os gastos associados ao consumo atual do {dispositivo.nomeDispositivo}.
            </p>
            <button onClick={handleObterGastos} className="px-10 py-4 bg-navy-700 text-white rounded-2xl font-bold text-lg transition duration-200 hover:bg-navy-800 dark:bg-white dark:text-navy-700 dark:hover:bg-white/90 shadow-lg">
              Obter Gastos Associados ao Consumo Atual
            </button>
          </div>
        </Card>
      </div>

      {precos.length > 0 && (
        <Card extra="w-full p-4 mt-5 overflow-x-auto">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white mb-4">Histórico de Preços</h4>
          <table className="w-full text-left border-collapse border border-gray-300 dark:border-gray-600">
            <thead>
              <tr>
                <th className="border px-4 py-2">Timestamp</th>
                <th className="border px-4 py-2">Consumo (kWh)</th>
                <th className="border px-4 py-2">Preço por kWh (€)</th>
              </tr>
            </thead>
            <tbody>
              {precos.map((p) => (
                <tr key={p.precoId}>
                  <td className="border px-4 py-2">{new Date(p.timestamp).toLocaleString()}</td>
                  <td className="border px-4 py-2">{ultimoConsumo?.valorConsumido.toFixed(2)}</td>
                  <td className="border px-4 py-2">{p.precoPorKWh.toFixed(4)}</td>
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