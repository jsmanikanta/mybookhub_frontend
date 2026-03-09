import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/footer.css";

function Footer() {
  const navigate = useNavigate();

  const soon = () => navigate("/soon");

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About */}
        <div className="footer-section">
          <h4>MyBookHub</h4>
          <p>
            My Book Hub is an online platform designed for students to buy and
            sell old books and order customized printouts with ease. We believe
            that learning materials should be affordable, accessible, and
            sustainable. Students can connect, share, and support each other
            while saving time and money. Whether selling previous semester
            books, ordering printouts from mobile, or donating materials to
            those in need, we make it simple.
          </p>
        </div>

        {/* Book Categories */}
        <div className="footer-section">
          <h4>Categories</h4>
          <ul className="footer-links">
            <li onClick={soon}>School Books</li>
            <li onClick={soon}>Competitive Exam Books</li>
            <li onClick={soon}>Diploma / Polytechnic</li>
            <li onClick={soon}>College Books</li>
            <li onClick={soon}>Fiction Books</li>
            <li onClick={soon}>Non-Fiction Books</li>
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-section">
          <h4>Contact</h4>

          <p>
            Email:
            <a href="mailto:support@mybookhub.store">support@mybookhub.store</a>
          </p>

          <p>
            Phone:
            <a href="tel:+919182415750">9182415750</a>
          </p>

          <p>
            Support:
            <a href="tel:+918074177294">8074177294</a>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MyBookHub</p>
      </div>
    </footer>
  );
}

export default Footer;
