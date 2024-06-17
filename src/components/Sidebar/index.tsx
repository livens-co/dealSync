import React from "react";
import "./style.scss";

import { RiDashboardFill } from "react-icons/ri";
import { FiLogOut } from "react-icons/fi";


const Sidebar: React.FC = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <h1>DealSync</h1>
      </div>
      <ul className="menu">
        <li>
          <a href="/">
            <RiDashboardFill />
            Početna
          </a>
        </li>
      </ul>
      <div className="footer">
        <button className="logoutBtn"><FiLogOut/>Logout</button>
      </div>
    </div>
  );
};

export default Sidebar;
