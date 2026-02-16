import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { api_path } from "../data";
import "./styles/auth.css";
import logoImg from "/images/logo.png";
import Loader from "./Loading";

function Login() {
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({ credential: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/profile", { replace: true });
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const credential = inputs.credential.trim();
    const password = inputs.password;

    if (!credential || !password) {
      setErrorMsg("Please enter your email/mobile and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const url = `${api_path}/user/login`;

      const res = await axios.post(
        url,
        { identifier: credential, password },
        { headers: { "Content-Type": "application/json" } },
      );

      const data = res?.data;

      if (data?.success && data?.token) {
        localStorage.setItem("token", data.token);
        navigate("/", { replace: true });
        window.location.reload();
      } else {
        setErrorMsg(data?.error || "Login failed. Please try again.");
      }
    } catch (err) {
      const msg =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err?.message ||
        "Login failed. Please try again.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}

      {!loading && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="modal-header" onClick={() => navigate("/")}>
              <img src={logoImg} alt="Logo" className="modal-logo" />
            </div>

            <h2 className="modal-title">
              Buy &amp; Sell Old Books.
              <br /> Order Printout Instantly!
            </h2>

            <form className="auth-form" onSubmit={handleSubmit}>
              <input
                type="text"
                name="credential"
                placeholder="Mobile Number or Email"
                value={inputs.credential}
                onChange={handleChange}
                required
                autoComplete="username"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={inputs.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />

              {errorMsg && <div className="error-message">{errorMsg}</div>}

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? "Signing in..." : "Continue"}
              </button>
            </form>

            <div className="auth-links">
              <button
                type="button"
                className="transparent-link"
                onClick={() => navigate("/forgotpassword")}
              >
                Forgot Password?
              </button>
            </div>

            <div className="switch-auth">
              New here?
              <button
                type="button"
                className="switch-btn"
                onClick={() => navigate("/signup")}
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Login;
