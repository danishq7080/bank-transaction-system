import React from "react";
import PropTypes from "prop-types";
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

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
};

export default Sidebar;