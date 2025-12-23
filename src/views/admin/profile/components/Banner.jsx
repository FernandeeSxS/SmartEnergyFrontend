import React from "react";
import banner from "assets/img/profile/banner.png";
import Card from "components/card";
import { MdLogout } from "react-icons/md";
import UserDefault from "assets/img/avatars/userdefault.jpg"

// Adicionamos as props entre as chaves { }
const Banner = ({ nome, dispositivos, espacos, membroDesde }) => {
  // URL de um avatar padrão (podes mudar este link ou usar um ícone local)
  const defaultAvatar = UserDefault;

  return (
    <Card extra={"items-center w-full h-full p-[16px] bg-white flex flex-col"}>
      <div
        className="relative mt-1 flex h-32 w-full justify-center rounded-xl bg-cover"
        style={{ backgroundImage: `url(${banner})` }}
      >
        <div className="absolute -bottom-12 flex h-[87px] w-[87px] items-center justify-center rounded-full border-[4px] border-white bg-gray-200 dark:!border-navy-700">
          <img 
            className="h-full w-full rounded-full object-cover" 
            src={defaultAvatar} 
            alt="Default User Avatar" 
          />
        </div>
      </div>

      {/* O flex-grow garante que esta div ocupe o espaço e empurre o botão para baixo */}
      <div className="mt-16 flex flex-col items-center gap-10 w-full flex-grow">
        <div className="text-center">
          <h4 className="text-xl font-bold text-navy-700 dark:text-white">
            {nome || "Carregando..."}
          </h4>
        </div>

        <div className="flex gap-4 md:!gap-14">
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {dispositivos}
            </p>
            <p className="text-sm font-normal text-gray-600">Dispositivos</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {espacos}
            </p>
            <p className="text-sm font-normal text-gray-600">Espaços</p>
          </div>
          <div className="flex flex-col items-center justify-center">
            <p className="text-2xl font-bold text-navy-700 dark:text-white">
              {membroDesde}
            </p>
            <p className="text-sm font-normal text-gray-600">Membro desde</p>
          </div>
        </div>
      </div>

      <button 
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-red-500 py-3 text-base font-medium text-white transition duration-200 hover:bg-red-600 active:bg-red-700"
        onClick={() => {
            localStorage.removeItem("userToken");
            localStorage.removeItem("userId");
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