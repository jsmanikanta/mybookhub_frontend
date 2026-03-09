import React from "react";
import "./styles/settings.css"
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  // Back button
  const handleBack = () => {
    navigate(-1);
  };

  // Change Password navigation
  const handleChangePassword = () => {
    navigate("/forgotpassword");
  };

  // Student Information navigation
  const handleStudentInfo = () => {
    navigate("/student-details");
  };

  // Logout navigation
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
    window.location.reload();
  };

  return (
    <div className="settings-page">
      <div className="settings-topbar">
        <button
          className="settings-backBtn"
          type="button"
          aria-label="Go back"
          onClick={handleBack}
        >
          ←
        </button>

        <div className="settings-titleRow">
          <span className="settings-gear">⚙</span>
          <h2 className="settings-title">Settings</h2>
        </div>
      </div>

      <div className="settings-divider" />

      <div className="settings-list">
        <button
          className="settings-item"
          type="button"
          onClick={handleChangePassword}
        >
          <span className="settings-itemText">Change Password</span>
          <span className="settings-chevron">›</span>
        </button>

        <div className="settings-divider" />

        <button
          className="settings-item"
          type="button"
          onClick={handleStudentInfo}
        >
          <span className="settings-itemText">Student Information</span>
          <span className="settings-chevron">›</span>
        </button>

        <div className="settings-divider" />

        <button className="settings-item" type="button" onClick={handleLogout}>
          <span className="settings-itemText">Logout</span>
          <span className="settings-chevron">›</span>
        </button>

        <div className="settings-divider" />
      </div>
    </div>
  );
}
