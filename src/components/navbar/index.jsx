import React, { useEffect, useState } from "react";
import Dropdown from "components/dropdown";
import { FiAlignJustify } from "react-icons/fi";
import { Link } from "react-router-dom";
import { RiMoonFill, RiSunFill } from "react-icons/ri";
import { jwtDecode } from "jwt-decode";
import authImage from "assets/img/avatars/userdefault.jpg"

const Navbar = (props) => {
  const { onOpenSidenav, brandText } = props;
  const [darkmode, setDarkmode] = React.useState(false);
  const [userName, setUserName] = useState("Utilizador");

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Bom dia";
    if (hour >= 12 && hour < 18) return "Boa tarde";
    return "Boa noite";
  };

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const name = decoded.unique_name || decoded.name || decoded.nome || "Utilizador";
        setUserName(name);
      } catch (error) {
        console.error("Erro ao descodificar o token:", error);
      }
    }
  }, []);

  return (
    <nav className="sticky top-4 z-40 flex flex-row flex-wrap items-center justify-between rounded-xl bg-white/10 p-2 backdrop-blur-xl dark:bg-[#0b14374d]">
      <div className="ml-[6px]">
        <div className="h-6 w-[224px] pt-1">
          <a className="text-sm font-normal text-navy-700 hover:underline dark:text-white" href=" ">
            Pages <span className="mx-1 text-sm text-navy-700 dark:text-white"> / </span>
          </a>
          <Link className="text-sm font-normal capitalize text-navy-700 hover:underline dark:text-white" to="#">
            {brandText}
          </Link>
        </div>
        <p className="shrink text-[33px] capitalize text-navy-700 dark:text-white">
          <Link to="#" className="font-bold capitalize hover:text-navy-700 dark:hover:text-white">
            {brandText}
          </Link>
        </p>
      </div>

      <div className="relative mt-[3px] flex h-[61px] w-fit flex-grow items-center justify-around gap-4 rounded-full bg-white px-4 py-2 shadow-xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none md:flex-grow-0">
        
        <span className="flex cursor-pointer text-xl text-gray-600 dark:text-white xl:hidden" onClick={onOpenSidenav}>
          <FiAlignJustify className="h-5 w-5" />
        </span>

        {/* 1. NA NAVBAR: "Boa tarde, Jeronimo Stilton" */}
        <p className="hidden md:block text-lg font-medium text-navy-700 dark:text-white">
          {getGreeting()}, <span className="font-bold">{userName}</span>
        </p>

        <div
          className="cursor-pointer text-gray-600"
          onClick={() => {
            if (darkmode) {
              document.body.classList.remove("dark");
              setDarkmode(false);
            } else {
              document.body.classList.add("dark");
              setDarkmode(true);
            }
          }}
        >
          {darkmode ? (
            <RiSunFill className="h-4 w-4 text-gray-600 dark:text-white" />
          ) : (
            <RiMoonFill className="h-4 w-4 text-gray-600 dark:text-white" />
          )}
        </div>

        <Dropdown
          button={<img className="h-10 w-10 rounded-full cursor-pointer" src={authImage} alt="User Avatar" />}
          children={
            <div className="flex w-56 flex-col justify-start rounded-[20px] bg-white shadow-xl dark:!bg-navy-700 dark:text-white">
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-bold text-navy-700 dark:text-white">
                    👋 Hey, {userName}
                  </p>
                </div>
              </div>
              <div className="h-px w-full bg-gray-200 dark:bg-white/20 " />
              <div className="flex flex-col p-4">
                <Link to="/admin/profile" className="text-sm text-gray-800 dark:text-white">Perfil</Link>
                <button
                  onClick={() => {
                    localStorage.removeItem("userToken");
                    window.location.href = "/auth/sign-in";
                  }}
                  className="mt-3 text-left text-sm font-medium text-red-500"
                >
                  Log Out
                </button>
              </div>
            </div>
          }
          classNames={"py-2 top-8 -left-[180px] w-max"}
        />
      </div>
    </nav>
  );
};

export default Navbar;