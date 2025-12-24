import React, { useState } from "react";
import { apiRequest } from "services/api";

export default function SignUp() {
  const [formData, setFormData] = useState({
    nome: "", // Alterado de 'name' para 'nome' para coincidir com o DTO C#
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    const { nome, email, password, confirmPassword } = formData;

    // 1. Validação simples no Frontend
    if (!nome || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As passwords não coincidem.");
      return;
    }

    try {
      // 2. Chamada à API enviando o objeto que o DTO espera
      // O objeto JSON será: { "nome": "...", "email": "...", "password": "..." }
      const data = await apiRequest("/Auth/register", "POST", {
        nome,
        email,
        password,
      });

      // 3. Sucesso (O backend agora retorna um objeto com 'message')
      setSuccess(true);
      setTimeout(() => {
        // Ajuste o caminho conforme as suas rotas do React Router
        window.location.href = "/auth/sign-in"; 
      }, 2000);
      
    } catch (err) {
      // 4. Tratamento de erro (Captura o BadRequest do backend)
      // Se o backend retornar 'Email já registado', ele cairá aqui
      setError(err.message || "Ocorreu um erro ao criar a conta.");
    }
  };

  return (
    <div className="mt-16 mb-16 flex h-full w-full items-center justify-center px-2 md:mx-0 md:px-0 lg:mb-10 lg:items-center lg:justify-start">
      <div className="mt-[10vh] w-full max-w-full flex-col items-center md:pl-4 lg:pl-0 xl:max-w-[420px]">
        <h4 className="mb-2.5 text-4xl font-bold text-navy-700 dark:text-white">
          Criar conta Smart Energy
        </h4>
        <p className="mb-9 ml-1 text-base text-gray-600">
          Registe-se para começar a gerir a sua energia!
        </p>

        {error && <p className="mb-4 text-red-500 text-sm font-medium">{error}</p>}
        {success && <p className="mb-4 text-green-500 text-sm font-medium">Conta criada com sucesso!</p>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            name="nome" // Deve ser igual à chave no formData
            placeholder="Nome Completo"
            value={formData.nome}
            onChange={handleChange}
            className="mb-3 w-full border rounded-lg p-3 outline-none focus:border-brand-500 dark:bg-navy-900 dark:border-white/10 dark:text-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="mb-3 w-full border rounded-lg p-3 outline-none focus:border-brand-500 dark:bg-navy-900 dark:border-white/10 dark:text-white"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="mb-3 w-full border rounded-lg p-3 outline-none focus:border-brand-500 dark:bg-navy-900 dark:border-white/10 dark:text-white"
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mb-3 w-full border rounded-lg p-3 outline-none focus:border-brand-500 dark:bg-navy-900 dark:border-white/10 dark:text-white"
          />

          <button
            type="submit"
            className="linear mt-4 w-full rounded-xl bg-brand-500 py-[12px] text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300"
          >
            Criar Conta
          </button>
        </form>

        <div className="mt-4">
          <span className="text-sm font-medium text-navy-700 dark:text-gray-600">
            Já tem uma conta?
          </span>
          <a href="/auth/sign-in" className="ml-1 text-sm font-medium text-brand-500 hover:text-brand-600 dark:text-white">
            Inicie sessão aqui
          </a>
        </div>
      </div>
    </div>
  );
}