import Card from "components/card";
import React from "react";

const General = () => {
  return (
    <Card extra={"w-full h-full p-3"}>
      <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
        Informações da Conta
      </h4>
      <p className="mt-2 px-2 text-base text-gray-600">
        Mantenha os seus dados de acesso atualizados para garantir a segurança do sistema.
      </p>
      
      <div className="grid grid-cols-1 gap-4 px-2 py-4">
        {/* Campo Nome */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Nome de Utilizador</p>
          <input 
            type="text" 
            placeholder="Seu nome" 
            className="mt-1 font-medium text-navy-700 dark:text-white bg-transparent outline-none"
          />
        </div>

        {/* Campo Email */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Email</p>
          <input 
            type="email" 
            placeholder="exemplo@email.com" 
            className="mt-1 font-medium text-navy-700 dark:text-white bg-transparent outline-none"
          />
        </div>

        {/* Campo Password */}
        <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
          <p className="text-sm text-gray-600">Nova Password</p>
          <input 
            type="password" 
            placeholder="••••••••" 
            className="mt-1 font-medium text-navy-700 dark:text-white bg-transparent outline-none"
          />
        </div>
      </div>

      <button className="linear mt-4 w-full rounded-xl bg-brand-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:hover:bg-brand-300">
        Guardar Alterações
      </button>
    </Card>
  );
};

export default General;