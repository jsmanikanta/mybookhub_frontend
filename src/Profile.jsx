import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import Loader from "./Loading";
import "./styles/profile.css";

export default function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setRedirecting(true);
        navigate("/login", { replace: true });
        return;
      }

      try {
        const response = await axios.get(`${api_path}/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const u = response?.data;

        if (u && u._id) {
          setUser(u);
          setLoading(false);
        } else {
          localStorage.removeItem("token");
          setRedirecting(true);
          navigate("/login", { replace: true });
        }
      } catch (err) {
        console.log("Profile fetch error:", err);

        localStorage.removeItem("token");
        setRedirecting(true);
        navigate("/login", { replace: true });
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const goToPickupAddress = () => navigate("/mylocations");
  const goTocart = () => navigate("/prints-cart");
  const goToFaq = () => navigate("/faq");
  const goToSettings = () => navigate("/settings");
  const goToStudentDetails = () => navigate("/student-details");

  if (redirecting) {
    return null;
  }

  if (loading) {
    return (
      <div className="profile-loading">
        <Loader />
      </div>
    );
  }

  if (!user) {
    navigate("/login");
  }

  const name = user?.fullname || "User";
  const email = user?.email || "";
  const phone = user?.mobileNumber || "";
  const college = user?.college || "";
  const year = user?.year || "";
  const branch = user?.branch || "";
  const rollno = user?.rollno || "";
  const usertype = user?.usertype || "";

  return (
    <div className="profile-page">
      <div className="profile-top-card">
        <div className="profile-top-row">
          <div className="profile-avatar-wrap">
            <div className="profile-avatar">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.015-8 4.5V20h16v-1.5c0-2.485-3.582-4.5-8-4.5Z"
                  fill="#2f5ea8"
                />
              </svg>
            </div>
            <span className="profile-badge">✓</span>
          </div>

          <div className="profile-main-info">
            <h2 className="profile-name">{name}</h2>
            <p className="profile-subtitle">
              {branch || "Student"} {year ? `· ${year} Year` : ""}
            </p>

            {email ? (
              <div className="profile-contact-row">
                <span className="profile-contact-icon">✉</span>
                <span>{email}</span>
              </div>
            ) : null}

            {phone ? (
              <div className="profile-contact-row">
                <span className="profile-contact-icon">📞</span>
                <span>{phone}</span>
              </div>
            ) : null}
          </div>

          <button
            className="profile-edit-btn"
            type="button"
            onClick={goToStudentDetails}
          >
            ✎ Edit
          </button>
        </div>

        {college ? (
          <div className="profile-college-card">
            <div className="profile-college-left">
              <span className="profile-college-icon">🏛</span>
              <span className="profile-college-text">{college}</span>
            </div>
            <span className="profile-college-arrow">›</span>
          </div>
        ) : null}

        <div className="profile-student-grid">
          <div className="student-box">
            <div className="student-box-icon">🪪</div>
            <div className="student-box-content">
              <span className="student-box-label">Roll No:</span>
              <span className="student-box-value">{rollno || "-"}</span>
            </div>
          </div>

          <div className="student-box">
            <div className="student-box-icon">👥</div>
            <div className="student-box-content">
              <span className="student-box-label">Branch:</span>
              <span className="student-box-value">{branch || "-"}</span>
            </div>
          </div>

          <div className="student-box">
            <div className="student-box-icon">📅</div>
            <div className="student-box-content">
              <span className="student-box-label">Year:</span>
              <span className="student-box-value">{year || "-"}</span>
            </div>
          </div>

          <div className="student-box">
            <div className="student-box-icon">🎓</div>
            <div className="student-box-content">
              <span className="student-box-label">User Type:</span>
              <span className="student-box-value">{usertype || "-"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-menu">
        <MenuItem
          title="Pickup Address"
          icon="📍"
          onClick={goToPickupAddress}
        />
        <MenuItem title="Prints Cart" icon="♡" onClick={goTocart} />
        <MenuItem title="Settings" icon="⚙️" onClick={goToSettings} />
        <MenuItem title="Help & FAQ" icon="❓" onClick={goToFaq} />
      </div>
    </div>
  );
}

function MenuItem({ title, icon, onClick }) {
  return (
    <div className="menu-item" onClick={onClick}>
      <div className="menu-left">
        <span className="menu-icon">{icon}</span>
        <span className="menu-title">{title}</span>
      </div>
      <span className="menu-arrow">›</span>
    </div>
  );
}
