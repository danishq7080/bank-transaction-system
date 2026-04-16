import React from "react";
import "./AlertBox.css";

function AlertBox({ message, type, onClose }) {
  if (!message) return null;

  return (
    <div className={`alert-box ${type}`}>
      <span>{message}</span>
      <button onClick={onClose}>✖</button>
    </div>
  );
}

export default AlertBox;