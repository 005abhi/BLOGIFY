import React, { useState } from "react";
import { createuser } from "../api";
import Spline from "@splinetool/react-spline";
import "./Createuser.css";

export function Createuser({ setView }) {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  async function handelSubmit(e) {
    e.preventDefault();
    let res = await createuser(user);
    if (res.status !== 200) {
      alert("User could not be created");
    } else {
      // Reset form fields
      setUser({
        name: "",
        email: "",
        password: "",
      });

      // Switch to login view
      setView(1); // 👈 Add this line to switch to login
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
        <h2 className="form-title">Create Your Account</h2>
        <p className="form-subtitle">
          Join the adventure with your new assistant!
        </p>
        <form onSubmit={handelSubmit}>
          <input
            type="text"
            name="name"
            placeholder="👤 Name"
            required
            maxLength={20}
            onChange={handelChange}
            value={user.name}
          />
          <input
            type="text"
            name="email"
            placeholder="📧 Email"
            required
            maxLength={30}
            onChange={handelChange}
            value={user.email}
          />
          <input
            type="password"
            name="password"
            placeholder="🔒 Password"
            required
            maxLength={20}
            onChange={handelChange}
            value={user.password}
          />

          <button type="submit">Submit</button>
        </form>
        <p className="form-footer">
          Already have an account?{" "}
          <span
            onClick={() => setView(0)}
            style={{ cursor: "pointer", color: "#588b76", fontWeight: "bold" }}
          >
            Log in
          </span>
        </p>
      </div>
    </div>
  );
}
