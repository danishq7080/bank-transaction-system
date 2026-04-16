import React, { useState } from "react";
import API from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import "../App.css";

function Transfer() {

  const navigate = useNavigate();
  const { accountNumber } = useParams();

  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");

  // ✅ MESSAGE STATE
  const [message, setMessage] = useState("");
  const [type, setType] = useState("");

  const transfer = async () => {

    try {

      const token = localStorage.getItem("token");

      if (!receiver || !amount || amount <= 0) {
        setMessage("Please enter valid receiver account and amount");
        setType("error");
        return;
      }

      await API.post(
        "/transfer",
        {
          sender_account: accountNumber,
          receiver_account: receiver,
          amount: Number(amount)
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // ✅ SUCCESS MESSAGE
      setMessage("Transfer Successful");
      setType("success");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (error) {

      console.error(error);

      // ✅ ERROR MESSAGE
      if (error.response) {
        setMessage(error.response.data.detail);
      } else {
        setMessage("Transfer failed");
      }

      setType("error");
    }
  };

  return (
    <div className="container">

      <div className="card">

        <h2 style={{ textAlign: "center" }}>Transfer Money</h2>

        {/* ✅ MESSAGE UI */}
        {message && (
          <div className={`alert ${type}`}>
            {message}
          </div>
        )}

        <p style={{ textAlign: "center", color: "#555" }}>
          From Account: <b>{accountNumber}</b>
        </p>

        <input
          placeholder="Receiver Account Number"
          value={receiver}
          onChange={(e) => setReceiver(e.target.value)}
        />

        <input
          type="number"
          placeholder="Enter Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <button className="btn-success" onClick={transfer}>
          Transfer
        </button>

        <button
          className="btn-dark"
          onClick={() => navigate("/dashboard")}
        >
          Back
        </button>

      </div>

    </div>
  );
}

export default Transfer;