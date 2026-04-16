import React from "react";
import { Link } from "react-router-dom";
import "./Sidebar.css";

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>

      <h3>Menu</h3>

      <Link to="/dashboard" onClick={toggleSidebar}>
        Dashboard
      </Link>

      <p className="sidebar-note">
        Select account to perform actions
      </p>

    </div>
  );
}

export default Sidebar;