import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "../App.css";

function Dashboard() {

  const [accounts, setAccounts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // ✅ NEW

  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {

    const fetchAccounts = async () => {

      try {

        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/");
          return;
        }

        const res = await API.get("/my-accounts", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setAccounts(res.data);

      } catch (error) {
        console.error(error);
      }

    };

    fetchAccounts();

  }, [navigate]);

  return (
    <div>

      {/* ✅ Navbar with toggle */}
      <Navbar toggleSidebar={toggleSidebar} />

      {/* ✅ Sidebar (toggle controlled) */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* ✅ Main content */}
      <div className="dashboard">

        <h2>Your Accounts</h2>

        {accounts.length === 0 ? (

          <div style={{ marginTop: "20px" }}>
            <p>No accounts found</p>

            <button
              className="btn-dark"
              onClick={() => navigate("/create-account")}
            >
              Create Account
            </button>
          </div>

        ) : (

          <div className="account-grid">

            {accounts.map((acc) => (

              <div key={acc.account_number} className="account-card">

                <h3>{acc.account_type} Account</h3>

                <p><b>Acc No:</b> {acc.account_number}</p>

                <p className="balance">₹{acc.balance}</p>

                <div className="btn-group">

                  <button
                    className="btn-primary"
                    onClick={() => navigate(`/deposit/${acc.account_number}`)}
                  >
                    Deposit
                  </button>

                  <button
                    className="btn-warning"
                    onClick={() => navigate(`/withdraw/${acc.account_number}`)}
                  >
                    Withdraw
                  </button>

                  <button
                    className="btn-success"
                    onClick={() => navigate(`/transfer/${acc.account_number}`)}
                  >
                    Transfer
                  </button>

                  <button
                    className="btn-purple"
                    onClick={() => navigate(`/transactions/${acc.account_number}`)}
                  >
                    History
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

        {accounts.length < 3 && (
          <button
            className="btn-dark"
            style={{ marginTop: "20px" }}
            onClick={() => navigate("/create-account")}
          >
            + Create New Account
          </button>
        )}

      </div>

    </div>
  );
}

export default Dashboard;