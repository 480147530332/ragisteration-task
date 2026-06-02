import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

const CITIES = ["Mumbai", "Pune", "Satara", "Nashik", "Nagpur", "Aurangabad"];
const EDU_OPTIONS = ["SSC", "HSC", "BSC", "BCOM", "MCA", "PhD"];

const initial = {
  firstName: "", lastName: "", email: "", phone: "",
  password: "", confirmPassword: "", gender: "",
  city: "", education: [],
  image1: null, image2: null, image3: null, image4: null,
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [previews, setPreviews] = useState({ image1: null, image2: null, image3: null, image4: null });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleEducation = (e) => {
    const val = e.target.value;
    setForm((f) => ({
      ...f,
      education: e.target.checked
        ? [...f.education, val]
        : f.education.filter((x) => x !== val),
    }));
  };

  const handleImage = (key) => (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm((f) => ({ ...f, [key]: file }));
    const reader = new FileReader();
    reader.onload = () => setPreviews((p) => ({ ...p, [key]: reader.result }));
    reader.readAsDataURL(file);
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
    if (!form.phone.match(/^\+?[\d\s-]{7,15}$/)) e.phone = "Valid phone number required";
    if (form.password.length < 8) e.password = "Min 8 characters";
    if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords do not match";
    if (!form.gender) e.gender = "Select a gender";
    if (!form.city) e.city = "Select a city";
    return e;
  };

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    const fd = new FormData();
    ["firstName", "lastName", "email", "phone", "password", "gender", "city"].forEach(
      (k) => fd.append(k, form[k])
    );
    fd.append("education", JSON.stringify(form.education));
    ["image1", "image2", "image3", "image4"].forEach((k) => {
      if (form[k]) fd.append(k, form[k]);
    });

    try {
      await axios.post("http://localhost:5000/api/auth/register", fd);
      showToast("🎉 Registration successful! Redirecting…");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      const msg = err.response?.data?.message || "Registration failed. Please try again.";
      showToast(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const field = (name, placeholder, type = "text", extra = {}) => (
    <div className="field-wrap">
      <input
        className={`field ${errors[name] ? "field--error" : ""}`}
        type={type}
        placeholder={placeholder}
        value={form[name]}
        onChange={set(name)}
        {...extra}
      />
      {errors[name] && <span className="err-msg">{errors[name]}</span>}
    </div>
  );

  const imageSlots = ["image1", "image2", "image3", "image4"];

  return (
    <div className="page">
      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`toast toast--${toast.type}`}
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="page__left" aria-hidden="true">
        <div className="brand">
          <div className="brand__icon">✦</div>
          <h2 className="brand__name">Ekodex Tech</h2>
          <p className="brand__tagline">Your journey starts here.</p>
        </div>
        <div className="deco-circles">
          <span className="dc dc1" />
          <span className="dc dc2" />
          <span className="dc dc3" />
        </div>
      </div>

      <main className="page__right">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <header className="card__header">
            <h1 className="card__title">Create Account</h1>
            <p className="card__sub">Fill in the details below to get started</p>
          </header>

          <form onSubmit={submitHandler} noValidate>
            {/* Personal Info */}
            <section className="section">
              <h3 className="section__label">Personal Info</h3>
              <div className="row-2">
                {field("firstName", "First Name")}
                {field("lastName", "Last Name")}
              </div>
              {field("email", "Email Address", "email")}
              {field("phone", "Phone Number", "tel")}
            </section>

            {/* Security */}
            <section className="section">
              <h3 className="section__label">Security</h3>
              <div className="field-wrap">
                <div className="pass-wrap">
                  <input
                    className={`field ${errors.password ? "field--error" : ""}`}
                    type={showPass ? "text" : "password"}
                    placeholder="Password"
                    value={form.password}
                    onChange={set("password")}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowPass((v) => !v)}>
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.password && <span className="err-msg">{errors.password}</span>}
              </div>
              <div className="field-wrap">
                <div className="pass-wrap">
                  <input
                    className={`field ${errors.confirmPassword ? "field--error" : ""}`}
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                  />
                  <button type="button" className="eye-btn" onClick={() => setShowConfirm((v) => !v)}>
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
                {errors.confirmPassword && <span className="err-msg">{errors.confirmPassword}</span>}
              </div>
              {form.password && (
                <PasswordStrength password={form.password} />
              )}
            </section>

            {/* Gender */}
            <section className="section">
              <h3 className="section__label">Gender</h3>
              <div className="pill-group">
                {["Male", "Female", "Non-binary", "Prefer not to say"].map((g) => (
                  <label key={g} className={`pill ${form.gender === g ? "pill--active" : ""}`}>
                    <input type="radio" name="gender" value={g} onChange={set("gender")} hidden />
                    {g}
                  </label>
                ))}
              </div>
              {errors.gender && <span className="err-msg">{errors.gender}</span>}
            </section>

            {/* City */}
            <section className="section">
              <h3 className="section__label">City</h3>
              <div className="field-wrap">
                <select
                  className={`field field--select ${errors.city ? "field--error" : ""}`}
                  value={form.city}
                  onChange={set("city")}
                >
                  <option value="">Select a city…</option>
                  {CITIES.map((c) => <option key={c}>{c}</option>)}
                </select>
                {errors.city && <span className="err-msg">{errors.city}</span>}
              </div>
            </section>

            {/* Education */}
            <section className="section">
              <h3 className="section__label">Education <span className="optional">(optional)</span></h3>
              <div className="check-grid">
                {EDU_OPTIONS.map((edu) => (
                  <label key={edu} className={`check-pill ${form.education.includes(edu) ? "check-pill--active" : ""}`}>
                    <input type="checkbox" value={edu} checked={form.education.includes(edu)} onChange={handleEducation} hidden />
                    <span className="check-pill__tick">{form.education.includes(edu) ? "✓" : ""}</span>
                    {edu}
                  </label>
                ))}
              </div>
            </section>

            {/* Images */}
            <section className="section">
              <h3 className="section__label">Profile Photos <span className="optional">(up to 4)</span></h3>
              <div className="img-grid">
                {imageSlots.map((key, i) => (
                  <label key={key} className="img-slot">
                    {previews[key] ? (
                      <img src={previews[key]} alt={`preview ${i + 1}`} className="img-preview" />
                    ) : (
                      <div className="img-placeholder">
                        <span className="img-icon">📷</span>
                        <span className="img-hint">Photo {i + 1}</span>
                      </div>
                    )}
                    <input type="file" accept="image/*" onChange={handleImage(key)} hidden />
                  </label>
                ))}
              </div>
            </section>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
            >
              {loading ? <span className="spinner" /> : "Create Account"}
            </motion.button>

            <p className="footer-link">
              Already have an account? <Link to="/">Sign in</Link>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}

function PasswordStrength({ password }) {
  const score = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;

  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#ef4444", "#f59e0b", "#3b82f6", "#22c55e"];

  return (
    <div className="strength">
      <div className="strength__bars">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="strength__bar"
            style={{ background: i <= score ? colors[score] : "#e2e8f0" }}
          />
        ))}
      </div>
      <span className="strength__label" style={{ color: colors[score] }}>
        {labels[score]}
      </span>
    </div>
  );
}