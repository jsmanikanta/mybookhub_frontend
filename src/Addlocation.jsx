import React, { useMemo, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./styles/addlocation.css";
import { api_path } from "../data";

export default function Addlocation() {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("token"), []);

  const [form, setForm] = useState({
    name: "",
    mobilenumber: "",
    pincode: "",
    state: "",
    district: "",
    address: "",
    landmark: "",
  });

  const [pinLoading, setPinLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  useEffect(() => {
    const pin = form.pincode?.trim();
    if (!/^\d{6}$/.test(pin)) {
      setForm((prev) => ({ ...prev, state: "", district: "" }));
      return;
    }
    let alive = true;
    const t = setTimeout(async () => {
      setPinLoading(true);
      setErrorMsg("");
      setSuccessMsg("");
      try {
        const res = await axios.get(
          `https://api.postalpincode.in/pincode/${pin}`,
        );

        if (!alive) return;

        const item = Array.isArray(res.data) ? res.data[0] : null;
        const po = item?.PostOffice?.[0];

        if (item?.Status === "Success" && po?.State && po?.District) {
          setForm((prev) => ({
            ...prev,
            state: po.State,
            district: po.District,
          }));
        } else {
          setForm((prev) => ({ ...prev, state: "", district: "" }));
          setErrorMsg("Invalid pincode.");
        }
      } catch (e) {
        if (!alive) return;
        setForm((prev) => ({ ...prev, state: "", district: "" }));
        setErrorMsg("Failed to detect state/district from pincode.");
      } finally {
        if (alive) setPinLoading(false);
      }
    }, 450);

    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [form.pincode]);

  const onChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errorMsg) setErrorMsg("");
    if (successMsg) setSuccessMsg("");
  };

  const validate = () => {
    if (!form.name.trim()) return "Please enter full name.";
    if (!/^\d{10}$/.test(form.mobilenumber))
      return "Enter valid 10-digit mobile number.";
    if (!/^\d{6}$/.test(form.pincode)) return "Enter valid 6-digit pincode.";
    if (!form.state) return "State not detected. Enter a valid pincode.";
    if (!form.district) return "District not detected. Enter a valid pincode.";
    if (!form.address.trim()) return "Please enter area/street/sector/village.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const msg = validate();
    if (msg) {
      setErrorMsg(msg);
      return;
    }

    setSubmitLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await axios.post(
        `${api_path}/locations/add-location`,
        {
          name: form.name.trim(),
          mobilenumber: form.mobilenumber.trim(),
          state: form.state,
          district: form.district,
          pincode: form.pincode.trim(),
          address: form.address.trim(),
          landmark: form.landmark.trim(),
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        },
      );

      navigate("/mylocations", { replace: true }, 600);
    } catch (err) {
      setErrorMsg(err?.response?.data?.error || "Failed to add location.");
    } finally {
      setSubmitLoading(false);
    }
  };
  if (!user) {
    navigate("/login");
  }

  return (
    <div className="pa-wrap">
      <div className="pa-header">
        <button
          className="pa-back"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          ←
        </button>
        <h2 className="pa-title">
          <span className="pa-pin">📍</span> Pickup Address
        </h2>
      </div>

      <form className="pa-form" onSubmit={handleSubmit}>
        <input
          className="pa-input"
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={onChange}
        />

        <input
          className="pa-input"
          placeholder="Mobile Number"
          name="mobilenumber"
          value={form.mobilenumber}
          onChange={onChange}
          inputMode="numeric"
          maxLength={10}
        />

        <div className="pa-row">
          <div className="pa-col">
            <label className="pa-label">Pincode</label>
            <input
              className="pa-input"
              name="pincode"
              value={form.pincode}
              onChange={(e) => {
                // allow only digits
                const v = e.target.value.replace(/\D/g, "").slice(0, 6);
                setForm((prev) => ({ ...prev, pincode: v }));
                if (errorMsg) setErrorMsg("");
                if (successMsg) setSuccessMsg("");
              }}
              inputMode="numeric"
              maxLength={6}
            />
            {pinLoading ? (
              <div className="pa-hint">Detecting state & district…</div>
            ) : null}
          </div>

          <div className="pa-col">
            <label className="pa-label">State</label>
            <input
              className="pa-input"
              value={form.state}
              readOnly
              placeholder="Auto-detected"
            />
          </div>
        </div>

        <label className="pa-label">District</label>
        <input
          className="pa-input"
          value={form.district}
          readOnly
          placeholder="Auto-detected"
        />

        <label className="pa-label">Area, Street, Sector, Village</label>
        <input
          className="pa-input"
          name="address"
          value={form.address}
          onChange={onChange}
        />

        <label className="pa-label">Landmark</label>
        <input
          className="pa-input"
          name="landmark"
          value={form.landmark}
          onChange={onChange}
        />

        {errorMsg ? <div className="pa-msg pa-err">{errorMsg}</div> : null}
        {successMsg ? <div className="pa-msg pa-ok">{successMsg}</div> : null}

        <button
          className="pa-submit"
          type="submit"
          disabled={submitLoading || pinLoading}
        >
          {submitLoading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
