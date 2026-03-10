import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./styles/student.css";
import { api_path } from "../data";

export default function StudentInformation() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // What we show + edit
  const [form, setForm] = useState({
    college: "",
    year: "",
    branch: "",
    rollno: "",
  });

  const [original, setOriginal] = useState(null);
  const GET_PROFILE_URL = `${api_path}/user/profile`;

  // Update route you gave
  const UPDATE_URL = `${api_path}/user/profile/update`;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setLoading(false);
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        setErrorMsg("");

        const res = await axios.get(GET_PROFILE_URL, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // support different response shapes
        const user = res?.data?.user || res?.data?.data || res?.data || {};

        const initial = {
          college: user?.college || "",
          year: user?.year || "",
          branch: user?.branch || "",
          rollno: user?.rollno || "",
        };

        setForm(initial);
        setOriginal(initial);
      } catch (err) {
        setErrorMsg(
          err?.response?.data?.error ||
            "Unable to load student information (check GET profile API).",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token, GET_PROFILE_URL]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
  };

  const handleEdit = () => {
    setIsEdit(true);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleCancel = () => {
    if (original) setForm(original);
    setIsEdit(false);
    setSuccessMsg("");
    setErrorMsg("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setErrorMsg("Please login again.");
      return;
    }

    setSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = {
        college: form.college?.trim(),
        year: form.year?.trim(),
        branch: form.branch?.trim(),
        rollno: form.rollno?.trim(),
      };

      const res = await axios.patch(UPDATE_URL, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const updatedUser = res?.data?.user || {};

      const updated = {
        college: updatedUser?.college ?? payload.college ?? "",
        year: updatedUser?.year ?? payload.year ?? "",
        branch: updatedUser?.branch ?? payload.branch ?? "",
        rollno: updatedUser?.rollno ?? payload.rollno ?? "",
      };

      setForm(updated);
      setOriginal(updated);
      setIsEdit(false);
      setSuccessMsg("Updated successfully!");
    } catch (err) {
      setErrorMsg(err?.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="stu-page">
      {/* Top bar */}
      <div className="stu-topbar">
        <button className="stu-back" onClick={() => navigate(-1)} type="button">
          ←
        </button>
        <h2 className="stu-title">Student Information</h2>

        {!loading && (
          <button
            className="stu-editBtn"
            type="button"
            onClick={isEdit ? handleCancel : handleEdit}
          >
            {isEdit ? "Cancel" : "Edit"}
          </button>
        )}
      </div>

      <div className="stu-wrap">
        {loading ? (
          <div className="stu-msg">Loading...</div>
        ) : (
          <form className="stu-form" onSubmit={handleSubmit}>
            {/* College */}
            <input
              className="stu-input"
              placeholder="Select College Name"
              name="college"
              value={form.college}
              onChange={handleChange}
              disabled={!isEdit}
            />

            {/* Year + Branch row */}
            <div className="stu-row">
              <input
                className="stu-input half"
                placeholder="Studying Year"
                name="year"
                value={form.year}
                onChange={handleChange}
                disabled={!isEdit}
              />

              <input
                className="stu-input half"
                placeholder="Branch(eg:cse)"
                name="branch"
                value={form.branch}
                onChange={handleChange}
                disabled={!isEdit}
              />
            </div>

            {/* Registration number */}
            <input
              className="stu-input"
              placeholder="Registration Number"
              name="rollno"
              value={form.rollno}
              onChange={handleChange}
              disabled={!isEdit}
            />

            {/* messages */}
            {errorMsg ? <div className="stu-error">{errorMsg}</div> : null}
            {successMsg ? (
              <div className="stu-success">{successMsg}</div>
            ) : null}

            {/* Submit */}
            <button
              className="stu-submit"
              type="submit"
              disabled={!isEdit || saving}
              title={!isEdit ? "Click Edit to enable changes" : ""}
            >
              {saving ? "Saving..." : "Submit"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
