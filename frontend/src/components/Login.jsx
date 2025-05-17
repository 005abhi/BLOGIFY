import React, { useState } from "react";
import { verifyuser } from "../api";
import { useNavigate } from "react-router-dom";
import Spline from "@splinetool/react-spline";
import "./Login.css";
import axios from "axios";

export function Login({ setView }) {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  async function handelSubmit(e) {
    e.preventDefault();
    user.email = user.email.trim().toLowerCase();

    let res = await verifyuser(user);
    if (res) {
      sessionStorage.setItem("user", res);
      axios.defaults.headers.common["Authorization"] = `Bearer ${res}`;
      navigate("/Home");
    } else {
      alert("user not found");
    }
  }

  function handelChange(e) {
    setUser({ ...user, [e.target.name]: e.target.value });
  }

  return (
    <div className="create-user-container">
      <div className="spline-bg">
        <div className="spline-wrapper">
          <Spline scene="https://prod.spline.design/gPJwKZ1V2jyrSooX/scene.splinecode" />
        </div>
        <div className="spline-mask" />
      </div>

      <div className="form-overlay">
        <h2 className="form-title">Welcome Back</h2>
        <p className="form-subtitle">Log in to continue your journey!</p>
        <form onSubmit={handelSubmit}>
          <input
            type="text"
            name="email"
            placeholder="📧 Email"
            required
            maxLength={30}
            onChange={handelChange}
          />
          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            required
            maxLength={20}
            onChange={handelChange}
          />
          <button type="submit">Login</button>
        </form>
        <p className="form-footer">
          Don't have an account?{" "}
          <span
            onClick={() => setView(1)}
            style={{ cursor: "pointer", color: "#588b76", fontWeight: "bold" }}
          >
            Create one
          </span>
        </p>
      </div>
    </div>
  );
}
