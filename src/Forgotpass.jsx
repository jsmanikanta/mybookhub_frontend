import React, { useState } from "react";
import "./styles/forgotpass.css";
import logoImg from "/images/logo.jpeg";
import { useNavigate } from "react-router-dom";
import { api_path } from "../data";
import Loader from "./Loading";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const goToLogin = () => navigate("/login");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!identifier || !newPassword || !confirm) {
      setError("All fields are required.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${api_path}/user/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: identifier.trim(), newPassword }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok)
        throw new Error(data.error || data.message || "Unknown error");

      setSuccess("Password reset successful! You can now login.");
      setIdentifier("");
      setNewPassword("");
      setConfirm("");
    } catch (err) {
      setError(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="resetpw-bg">
          <form className="resetpw-container" onSubmit={handleSubmit}>
            <img src={logoImg} className="resetpw-logo" alt="Logo" />
            <h2 className="resetpw-title">Reset Password</h2>

            <input
              className="resetpw-input"
              type="text"
              placeholder="Email or Mobile Number"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
            />

            <input
              className="resetpw-input"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <input
              className="resetpw-input"
              type="password"
              placeholder="Confirm New Password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />

            {error && <div className="resetpw-error">{error}</div>}
            {success && <div className="resetpw-success">{success}</div>}

            <button className="resetpw-btn" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Reset Password"}
            </button>

            <div
              className="resetpw-back"
              onClick={goToLogin}
              style={{ cursor: "pointer" }}
            >
              Back to Login
            </div>
          </form>
        </div>
      )}
    </>
  );
}
