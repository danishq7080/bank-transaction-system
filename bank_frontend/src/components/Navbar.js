import React from "react";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";

function Navbar({ toggleSidebar }) {

  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{
      background: "#1e3a5f",
      color: "white",
      padding: "15px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    }}>

      {/* ☰ MENU BUTTON */}
      <button
        onClick={toggleSidebar}
        style={{
          background: "transparent",
          color: "white",
          fontSize: "20px",
          border: "none",
          cursor: "pointer"
        }}
      >
        ☰
      </button>

      <h2>Bank Dashboard</h2>

      <button
        onClick={logout}
        style={{
          background: "white",
          color: "#1e3a5f",
          border: "none",
          padding: "8px 15px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>

    </div>
  );
}

Navbar.propTypes = {
  toggleSidebar: PropTypes.func.isRequired,
};

export default Navbar;