import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/footer.css";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* About */}
        <div className="footer-section footer-about">
          <h2>MyBookHub</h2>

          <p>
            MyBookHub is a student-focused platform for buying, selling,
            donating books, and ordering printouts. We make learning affordable,
            accessible, and sustainable for everyone.
          </p>
        </div>

        {/* Categories */}
        <div className="footer-section">
          <h3>Categories</h3>

          <p
            className="footer-link"
            onClick={() => navigate("/categories/school-books")}
          >
            School Books →
          </p>

          <p
            className="footer-link"
            onClick={() => navigate("/categories/competitive-exams")}
          >
            Competitive Exam Books →
          </p>

          <p
            className="footer-link"
            onClick={() => navigate("/categories/diploma-polytechnic")}
          >
            Diploma / Polytechnic →
          </p>

          <p
            className="footer-link"
            onClick={() => navigate("/categories/college-books")}
          >
            College Books →
          </p>

          <p
            className="footer-link"
            onClick={() => navigate("/categories/fiction")}
          >
            Fiction Books →
          </p>

          <p
            className="footer-link"
            onClick={() => navigate("/categories/non-fiction")}
          >
            Non-Fiction Books →
          </p>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h3>Contact</h3>

          <p>
            📧{" "}
            <a href="mailto:support@mybookhub.store">support@mybookhub.store</a>
          </p>

          <p>
            💬{" "}
            <a
              href="https://wa.me/918074177294"
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp Support
            </a>
          </p>

          <p>
            📞 <a href="tel:+918074177294">8074177294</a>
          </p>

          <p>
            ☎️ <a href="tel:+919182415750">9182415750</a>
          </p>

          <p
            className="footer-link legal-link"
            onClick={() => navigate("/privacy-policy")}
          >
            Privacy Policy
          </p>
        </div>
      </div>

      <div className="footer-divider"></div>

      <div className="footer-bottom">
        <p>© 2026 MyBookHub. All Rights Reserved.</p>

        <p>Made with ❤️ for Students Across India.</p>
      </div>
    </footer>
  );
};

export default Footer;
