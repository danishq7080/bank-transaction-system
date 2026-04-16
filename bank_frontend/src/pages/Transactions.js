import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "../App.css";

function Transactions() {

  const { accountNumber } = useParams();
  const navigate = useNavigate();

  const [transactions, setTransactions] = useState([]);

  useEffect(() => {

    const loadTransactions = async () => {

      try {

        const token = localStorage.getItem("token");

        const res = await API.get(
          `/transactions/${accountNumber}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setTransactions(res.data);

      } catch (error) {

        console.error(error);

        if (error.response) {
          alert(error.response.data.detail);
        } else {
          alert("Error loading transactions");
        }

      }
    };

    loadTransactions();

  }, [accountNumber]);

  return (
    <div className="container">

      <div className="card" style={{ width: "600px" }}>

        <h2 style={{ textAlign: "center" }}>Transaction History</h2>

        <p style={{ textAlign: "center", color: "#555" }}>
          Account: <b>{accountNumber}</b>
        </p>

        <div className="table-container">

          <table className="styled-table">

            <thead>
              <tr>
                <th>ID</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>

              {transactions.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center" }}>
                    No transactions found
                  </td>
                </tr>
              ) : (

                transactions.map((t) => (
                  <tr key={t.id}>
                    <td>{t.id}</td>
                    <td>{t.transaction_type}</td>
                    <td>₹{t.amount}</td>
                    <td>{new Date(t.timestamp).toLocaleString()}</td>
                  </tr>
                ))

              )}

            </tbody>

          </table>

        </div>

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

export default Transactions;