import React, { useState } from "react";
import { Createuser } from "../components/Createuser";
import { Login } from "../components/Login";

export const Landing = () => {
  const [view, setView] = useState(0); // 0 = login, 1 = create user

  return (
    <div>
      {!view ? (
        <div className="auth-container">
          <Login setView={setView} />
          <button className="switch-button" onClick={() => setView(1)}>
            Create new account
          </button>
        </div>
      ) : (
        <div className="auth-container">
          <Createuser setView={setView} />
          <button className="switch-button" onClick={() => setView(0)}>
            Login existing account
          </button>
        </div>
      )}
    </div>
  );
};

export default Landing;
