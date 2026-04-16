import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Transfer from "./pages/Transfer";
import Transactions from "./pages/Transactions";
import CreateAccount from "./pages/CreateAccount";

import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/create-account"
          element={
            <PrivateRoute>
              <CreateAccount />
            </PrivateRoute>
          }
        />

        <Route
          path="/deposit/:accountNumber"
          element={
            <PrivateRoute>
              <Deposit />
            </PrivateRoute>
          }
        />

        <Route
          path="/withdraw/:accountNumber"
          element={
            <PrivateRoute>
              <Withdraw />
            </PrivateRoute>
          }
        />

        <Route
          path="/transfer/:accountNumber"
          element={
            <PrivateRoute>
              <Transfer />
            </PrivateRoute>
          }
        />

        <Route
          path="/transactions/:accountNumber"
          element={
            <PrivateRoute>
              <Transactions />
            </PrivateRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;