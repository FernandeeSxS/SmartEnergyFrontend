import Card from "components/card";
import React, { useState, useEffect } from "react";
import { apiRequest } from "services/api";

// Recebemos o id, nome e email como props
const General = ({ id, nome, email }) => {
  // 1. Estados para controlar os inputs e permitir a edição
  const [formData, setFormData] = useState({ nome: "", email: "" });

  // 2. Sincronizar os dados quando eles chegam da API (via props)
  useEffect(() => {
    setFormData({ nome: nome || "", email: email || "" });
  }, [nome, email]);

  // 3. Função para chamar o endpoint PUT
  const handleUpdate = async () => {
    const token = localStorage.getItem("userToken");
    
    // O objeto enviado corresponde ao UpdateUserDto no C#
    const model = {
      nome: formData.nome,
      email: formData.email
    };

    try {
      await apiRequest(`/Utilizador/${id}`, "PUT", model, token);
      alert("Alterações guardadas com sucesso!");
    } catch (err) {
      console.error("Erro ao atualizar:", err);
      alert("Erro ao guardar alterações.");
    }
  };

  return (
    <Card extra={"w-full h-full p-5 flex flex-col"}>
      <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
        Informações da Conta
      </h4>
      <p className="mt-2 px-2 text-base text-gray-600">
        Mantenha os seus dados de acesso atualizados para garantir a segurança do sistema.
      </p>
      
      <div className="grid grid-cols-1 gap-8 px-2 py-8">
        
        {/* Campo Nome */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-4 py-6 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Nome de Utilizador</p>
          <input 
            type="text" 
            value={formData.nome}
            onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
            placeholder="Seu nome" 
            className="mt-2 w-full font-medium text-navy-700 dark:text-white bg-transparent outline-none border-b border-transparent focus:border-brand-500 transition-all"
          />
        </div>

        {/* Campo Email */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-4 py-6 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Email</p>
          <input 
            type="email" 
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="exemplo@email.com" 
            className="mt-2 w-full font-medium text-navy-700 dark:text-white bg-transparent outline-none border-b border-transparent focus:border-brand-500 transition-all"
          />
        </div>
      </div>

      <button 
        onClick={handleUpdate}
        className="linear mt-auto w-full rounded-xl bg-brand-500 py-4 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300"
      >
        Guardar Alterações
      </button>
    </Card>
  );
};

export default General;