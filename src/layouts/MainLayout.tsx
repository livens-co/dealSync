import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import "./style.scss";

const MainLayout = () => {
  return (
    <>
      <div className="mainLayout">
        <Sidebar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default MainLayout;
