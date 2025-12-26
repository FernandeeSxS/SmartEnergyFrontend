import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { apiRequest } from "services/api";

const Space = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();
  const NomeEspaco = state?.nomeEspaco;

  const [dispositivos, setDispositivos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const token = localStorage.getItem("userToken");

  useEffect(() => {
    const fetchDispositivos = async () => {
      setLoading(true);
      setError("");

      try {
        const data = await apiRequest(`/dispositivo/espaco/${id}`, "GET", null, token);
        setDispositivos(data || []);
      } catch (err) {
        console.error("Erro ao buscar dispositivos:", err);
        setError("Não foi possível carregar os dispositivos.");
      } finally {
        setLoading(false);
      }
    };

    fetchDispositivos();
  }, [id, token]);

  if (loading) return <p>Carregando dispositivos...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">
        Dispositivos do Espaço {NomeEspaco}
      </h2>

      {dispositivos.length === 0 ? (
        <p>Nenhum dispositivo encontrado.</p>
      ) : (
        <ul className="space-y-2">
          {dispositivos.map((d) => (
            <li
              key={d.dispositivoId}
              className="p-3 border rounded-md flex justify-between items-center bg-white dark:bg-navy-800"
            >
              <div>
                <p className="font-medium">{d.nomeDispositivo}</p>
                <p
                  className={`text-sm ${
                    d.status === "Ligado" ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Status: {d.status || "Desconhecido"}
                </p>
              </div>
              <button
                onClick={() =>
                  navigate(`/admin/dispositivo/${d.dispositivoId}`)
                }
                className="ml-4 rounded bg-brand-500 px-4 py-2 text-white hover:bg-brand-600"
              >
                Ver Dispositivo
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Space;
