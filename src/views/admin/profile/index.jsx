import Banner from "./components/Banner";
import General from "./components/General";
import Card from "components/card";
import { MdLogout } from "react-icons/md";

const ProfileOverview = () => {
  return (
    <div className="flex w-full flex-col gap-5">
      {/* Secção Superior: Banner com Foto e Nome */}
      <div className="w-full mt-3 flex h-fit flex-col gap-5 lg:grid lg:grid-cols-12">
        <div className="col-span-12 lg:col-span-4">
          <Banner />
        </div>

        {/* Secção de Edição de Dados: Email e Password */}
        <div className="col-span-12 lg:col-span-8">
          <General />
        </div>
      </div>
    </div>
  );
};

export default ProfileOverview;