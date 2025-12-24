import React from "react";

// Admin Imports
import MainDashboard from "views/admin/default";
import NFTMarketplace from "views/admin/marketplace";
import Profile from "views/admin/profile";
import DataTables from "views/admin/tables";
import DetalheEspaco from "views/admin/space";
import DetalheDispositivo from "./views/admin/deviceinfo";
import SignUp from "views/auth/SignUp"; // Certifique-se de que o nome do arquivo e o caminho estão corretos

// Auth Imports
import SignIn from "views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineMapsHomeWork, // Ícone melhor para Espaços
  MdDevices,
  MdPerson,
  MdLock,
} from "react-icons/md";

const routes = [

  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
    sidebar: true,
  },
  {
    name: "Espaços",
    layout: "/admin",
    path: "nft-marketplace",
    icon: <MdOutlineMapsHomeWork className="h-6 w-6" />,
    component: <NFTMarketplace />,
    secondary: true,
    sidebar: true,
  },
  {
    name: "Dispositivos",
    layout: "/admin",
    icon: <MdDevices className="h-6 w-6" />,
    path: "data-tables",
    component: <DataTables />,
    sidebar: true,
  },
  {
    name: "Perfil",
    layout: "/admin",
    path: "profile",
    icon: <MdPerson className="h-6 w-6" />,
    component: <Profile />,
    sidebar: true,
  },
  {
    name: "Iniciar Sessão",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
    sidebar: false,
  },
  {
    name: "Criar Conta",
    layout: "/auth",
    path: "sign-up",
    icon: <MdLock className="h-6 w-6" />, // Pode usar o mesmo ícone de cadeado
    component: <SignUp />,
    sidebar: false,
  },
  {
  name: "Detalhe Dispositivo",
  layout: "/admin",
  path: "dispositivo/:id",
  component: <DetalheDispositivo />,
  secondary: true,
  sidebar: false,
  },
  {
  name: "Detalhe Espaço",
  layout: "/admin",
  path: "space/:id",
  component: <DetalheEspaco />,
  secondary: true,
  sidebar: false,
  },
];
export default routes;
