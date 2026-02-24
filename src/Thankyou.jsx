import React from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPageHub = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate("/mybooks");
  };

  return (
    <>
      <style jsx>{`
        .thankyou-hub-page {
          min-height: 100vh;
          background-color: white;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family:
            -apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui,
            sans-serif;
          position: relative;
          overflow: hidden;
          margin: 0;
          padding: 0;
        }

        .thankyou-hub-logo {
          position: absolute;
          top: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 10;
        }

        .hub-logo-img {
          height: 32px;
          width: auto;
        }

        .thankyou-hub-container {
          background: white;
          border-radius: 24px;
          padding: 48px 32px;
          text-align: center;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08);
          max-width: 360px;
          width: 100%;
          position: relative;
        }

        .thankyou-hub-checkmark {
          margin-bottom: 24px;
        }

        .checkmark-bg {
          width: 72px;
          height: 72px;
          margin: 0 auto 16px;
          animation: bounceIn 0.6s ease-out;
        }

        @keyframes bounceIn {
          0% {
            transform: scale(0);
            opacity: 0;
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .checkmark-svg {
          width: 56px;
          height: 56px;
        }

        .checkmark-circle {
          cx: 28;
          cy: 28;
          r: 25;
          fill: #10b981;
        }

        .checkmark-path {
          stroke: white;
          stroke-width: 4;
          stroke-linecap: round;
          stroke-linejoin: round;
          d: "M17 28L24 35L39 20";
        }

        .thankyou-hub-title {
          font-size: 28px;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 32px 0;
          line-height: 1.2;
        }

        .thankyou-hub-status {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 32px;
          width: 100%;
        }

        .status-card {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px;
          background: #f1f5f9;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          transition: all 0.3s ease;
        }

        .status-card:hover {
          background: #e2e8f0;
          transform: translateY(-1px);
        }

        .status-icon-1 {
          font-size: 24px;
          background-color: #9b59b6;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .status-icon-2 {
          font-size: 24px;
          background-color: #3498db;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
        }

        .status-content {
          flex: 1;
          text-align: left;
        }

        .status-title {
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 4px;
        }

        .status-desc {
          font-size: 14px;
          color: #64748b;
          font-weight: 500;
        }

        .thankyou-hub-btn {
          width: 100%;
          background-color: rgb(197, 138, 29);
          color: white;
          border: none;
          padding: 18px;
          border-radius: 16px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .thankyou-hub-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 30px rgba(16, 185, 129, 0.3);
        }

        .thankyou-hub-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 480px) {
          .thankyou-hub-container {
            padding: 40px 24px;
            margin: 10px;
          }

          .thankyou-hub-title {
            font-size: 24px;
          }

          .hub-logo-img {
            height: 28px;
          }
        }
      `}</style>

      <div className="thankyou-hub-page">
        <div className="thankyou-hub-container">
          {/* Success Checkmark */}
          <div className="thankyou-hub-checkmark">
            <div className="checkmark-bg">
              <svg className="checkmark-svg" viewBox="0 0 56 56" fill="none">
                <circle cx="28" cy="28" r="25" fill="#10B981" />
                <path className="checkmark-path" d="M17 28L24 35L39 20" />
              </svg>
            </div>
          </div>

          {/* Title */}
          <h1 className="thankyou-hub-title">Book Received!</h1>

          {/* Status Cards */}
          <div className="thankyou-hub-status">
            <div className="status-card">
              <div className="status-icon-1">📞</div>
              <div className="status-content">
                <div className="status-title">Call Key</div>
                <div className="status-desc">We will call you</div>
              </div>
            </div>

            <div className="status-card">
              <div className="status-icon-2">⏰</div>
              <div className="status-content">
                <div className="status-title">Soon</div>
                <div className="status-desc">Within 24 hours</div>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <button className="thankyou-hub-btn" onClick={handleGoHome}>
            Done
          </button>
        </div>
      </div>
    </>
  );
};

export default ThankYouPageHub;
