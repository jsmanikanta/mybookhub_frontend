import React, { useState } from "react";
import "./styles/auth.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { api_path } from "../data";
import logoImg from "/images/logo.png";
import Loader from "./Loading";

function Signup() {
  const navigate = useNavigate();
  const Login = () => {
    navigate("/login");
  };
  const Homepage = () => {
    navigate("/");
  };
  const [loading, setLoading] = useState(false);

  const [inputs, setInputs] = useState({
    fullname: "",
    mobileNumber: "",
    email: "",

    password: "",
    confirm: "",

    usertype: "user", // ✅ mandatory (default user)

    birthday: "", // ✅ optional
    college: "", // ✅ optional
    otherCollege: "", // ✅ only when college === "Others"
    year: "", // ✅ optional
    branch: "", // ✅ optional
    rollno: "", // ✅ optional
  });

  const handleChange = (e) =>
    setInputs({ ...inputs, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const mobileNumberPattern = /^\d{10}$/;
    if (!mobileNumberPattern.test(inputs.mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (inputs.password !== inputs.confirm) {
      alert("Passwords do not match!");
      return;
    }

    // ✅ keep your logic same, just add remaining fields in payload
    setLoading(true);
    try {
      const response = await axios.post(`${api_path}/user/register`, {
        fullname: inputs.fullname,
        mobileNumber: inputs.mobileNumber,
        email: inputs.email, // optional in your ask (even though schema required in backend)

        password: inputs.password,

        usertype: inputs.usertype,

        birthday: inputs.birthday ? inputs.birthday : undefined,
        college:
          inputs.college === "Others"
            ? inputs.otherCollege
            : inputs.college
              ? inputs.college
              : undefined,
        year: inputs.year ? inputs.year : undefined,
        branch: inputs.branch ? inputs.branch : undefined,
        rollno: inputs.rollno ? inputs.rollno : undefined,
      });

      if (response.data.message) {
        alert("User registered successfully!");
        navigate("/login");
      } else {
        alert("Registration failed. Please try again.");
      }
    } catch (error) {
      const errorMsg =
        error.response?.data?.error || "Registration failed. Please try again.";
      alert(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const colleges = [
    "Anil Neerukonda Institute of Technology & Sciences (ANITS), Visakhapatnam",
    "Andhra University, Waltair Junction, Visakhapatnam",
    "Gayatri Vidya Parishad College of Engineering (GVPE),Kommadi, Visakhapatnam",
    "SIMS College Madhurawada, Visakhapatnam",
    "Dr. Lankapalli Bullayya College of Engineering,Visakhapatnam",
    "Avanti Institute of Engineering & Technology, Vizianagaram",
    "Nadimpalli Satyanarayana Raju Institute of Technology (NSRIT), Visakhapatnam",
    "Others",
  ];

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <div className="modal-header" onClick={Homepage}>
              <img src={logoImg} alt="Logo" className="modal-logo" />
            </div>

            <h2 className="modal-title">
              Buy &amp; Sell Old Books.
              <br /> Order Printout Instantly!
            </h2>

            <form className="auth-form" onSubmit={handleSubmit}>
              {/* ✅ Mandatory */}
              <input
                type="text"
                name="fullname"
                placeholder="Enter Full Name"
                value={inputs.fullname}
                onChange={handleChange}
                required
              />

              {/* ✅ Optional (as per your request) */}
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address (optional)"
                value={inputs.email}
                onChange={handleChange}
                autoComplete="email"
              />

              {/* ✅ Mandatory */}
              <input
                type="text"
                name="mobileNumber"
                placeholder="Enter Mobile Number"
                value={inputs.mobileNumber}
                onChange={handleChange}
                required
                maxLength={10}
              />

              {/* ✅ Mandatory */}
              <select
                name="usertype"
                value={inputs.usertype}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
              </select>

              {/* ✅ Optional */}
              <input
                type="date"
                name="birthday"
                value={inputs.birthday}
                onChange={handleChange}
              />

              {/* ✅ Optional college list + others */}
              <select
                name="college"
                value={inputs.college}
                onChange={(e) => {
                  handleChange(e);
                  if (e.target.value !== "Others") {
                    setInputs((prev) => ({ ...prev, otherCollege: "" }));
                  }
                }}
              >
                <option value="">Select College (optional)</option>
                {colleges.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>

              {inputs.college === "Others" && (
                <input
                  type="text"
                  name="otherCollege"
                  placeholder="Enter College Name"
                  value={inputs.otherCollege}
                  onChange={handleChange}
                />
              )}

              {/* ✅ Optional */}
              <input
                type="text"
                name="year"
                placeholder="Year (optional)"
                value={inputs.year}
                onChange={handleChange}
              />

              {/* ✅ Optional */}
              <input
                type="text"
                name="branch"
                placeholder="Branch (optional)"
                value={inputs.branch}
                onChange={handleChange}
              />

              {/* ✅ Optional */}
              <input
                type="text"
                name="rollno"
                placeholder="Roll No (optional)"
                value={inputs.rollno}
                onChange={handleChange}
              />

              {/* ✅ Mandatory */}
              <input
                type="password"
                name="password"
                placeholder="Create Password"
                value={inputs.password}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />

              {/* ✅ Mandatory */}
              <input
                type="password"
                name="confirm"
                placeholder="Confirm Password"
                value={inputs.confirm}
                onChange={handleChange}
                required
                minLength={6}
                autoComplete="new-password"
              />

              <button type="submit" className="auth-btn">
                Sign Up
              </button>
            </form>

            <div className="switch-auth">
              Already have an account?
              <button type="button" className="switch-btn" onClick={Login}>
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Signup;
