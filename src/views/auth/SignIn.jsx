import React, { useState } from "react";
import { apiRequest } from "services/api";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    console.log("EMAIL:", email);
    console.log("PASSWORD:", password);

    if (!email || !password) {
      setError("Preencha email e password");
      return;
    }

    try {
      const data = await apiRequest(
        "/Auth/login",
        "POST",
        {
          email,
          password,
        }
      );

      if (data.token) {
        localStorage.setItem("userToken", data.token);
        window.location.href = "/admin/default";
      } else {
        setError("Resposta inválida do servidor");
      }
    } catch (err) {
      setError(err.message || "Falha no login");
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Entrar no Smart Energy
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Insira o seu email e password para monitorizar o seu consumo!
        </p>

        {/* Mensagem de Erro */}
        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mb-3 w-full border p-2"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mb-3 w-full border p-2"
          />

          <button
            type="submit"
            className="linear mt-4 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300"
          >
            Iniciar Sessão
          </button>
        </form>



        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Ainda não tem conta?
          </span>
          <a
            href="/auth/sign-up"
            className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white"
          >
            Crie aqui a sua conta
          </a>
        </div>
      </div>
    </div>
  );
}
