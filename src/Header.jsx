import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import "./styles/header.css";

function Header() {
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [locationText, setLocationText] = useState("Add Location");

  const goToLogin = () => navigate("/login");
  const goToCart = () => navigate("/wishlist");
  const goToHome = () => navigate("/");
  const goToHelp = () => navigate("/help");
  const goToMyLocations = () => navigate("/mylocations");

  useEffect(() => {
    const fetchHeaderData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setUserName("");
        setLocationText("Add Location");
        return;
      }

      try {
        const response = await axios.get(`${api_path}/locations/mylocations`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const user = response?.data?.user || {};
        const locations = response?.data?.locations || [];

        setUserName(user?.fullname || "");

        if (Array.isArray(locations) && locations.length > 0) {
          const latestLocation = locations[locations.length - 1];

          const district = latestLocation?.district || "";
          const pincode = latestLocation?.pincode || "";

          if (district || pincode) {
            setLocationText(
              `${district}${district && pincode ? ", " : ""}${pincode}`,
            );
          } else {
            setLocationText("Add Location");
          }
        } else {
          setLocationText("Add Location");
        }
      } catch (error) {
        console.error("Failed to fetch header data:", error);
        setUserName("");
        setLocationText("Add Location");
      }
    };

    fetchHeaderData();
  }, []);

  return (
    <header className="mbh-header">
      <div className="mbh-header-inner">
        <div className="mbh-left" onClick={goToHome}>
          <h1 className="mbh-logo">
            <span className="logo-my">My</span>
            <span className="logo-book">Book</span>
            <span className="logo-hub">Hub</span>
          </h1>

          <div
            className="mbh-location"
            onClick={(e) => {
              e.stopPropagation();
              goToMyLocations();
            }}
          >
            <img
              src="/images/location-icon.png"
              alt="Location"
              className="mbh-location-icon"
            />
            <span>{locationText}</span>
          </div>
        </div>

        <div className="mbh-right">
          <button className="mbh-action" onClick={goToLogin} type="button">
            <div className="mbh-icon-circle">
              <img src="/images/user-avatar.png" alt="Login" />
            </div>
            <span className="mbh-action-text">
              {userName ? userName.split(" ")[0] : "Login"}
            </span>
          </button>

          <button className="mbh-action" onClick={goToCart} type="button">
            <div className="mbh-icon-plain">
              <img src="/images/wishlist.png" alt="Cart" />
            </div>
            <span className="mbh-action-text">Wishlist</span>
          </button>

          <button className="mbh-action" onClick={goToHelp} type="button">
            <div className="mbh-icon-plain">
              <img src="/images/help-icon.png" alt="Help" />
            </div>
            <span className="mbh-action-text">Help</span>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;
