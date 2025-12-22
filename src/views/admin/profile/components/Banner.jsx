import React from "react";
import avatar from "assets/img/avatars/avatar11.png";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { MdLogout } from "react-icons/md";

const Banner = () => {
  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-white"}>
      {/* Background e Foto de Perfil */}
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-pink-400 dark:!border-navy-700">
          <img className="h-full w-full rounded-full" src={avatar} alt="Avatar" />
        </div>
      </div>

      {/* Nome e Info - Adicionado gap-10 para separar as estatísticas do nome */}
      <div className="mt-16 flex flex-col items-center gap-10 w-full flex-grow">
        <div className="text-center">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            Adela Parkson
          </h4>
        </div>

        {/* Estatísticas do Smart Energy System */}
        <div className="flex gap-4 md:!gap-14">
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">17</p>
            <p className="text-sm font-normal text-gray-600">Dispositivos</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">5</p>
            <p className="text-sm font-normal text-gray-600">Espaços</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">2023</p>
            <p className="text-sm font-normal text-gray-600">Membro desde</p>
          </div>
        </div>
      </div>

      {/* Botão Sair da Conta - w-full e mt-auto para garantir que fica na base */}
      <button 
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700"
        onClick={() => {
            localStorage.removeItem("userToken"); // Limpa o JWT da API REST
            window.location.href = "/auth/sign-in";
        }}
      >
        <MdLogout className="h-5 w-5" />
        Sair da Conta
      </button>
    </Card>
  );
};

export default Banner;