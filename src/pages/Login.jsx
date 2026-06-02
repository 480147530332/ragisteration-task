import { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const validate = () => {
    const e = {};
    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Enter a valid email";
    if (password.length < 1) e.password = "Password is required";
    return e;
  };

  const submitHandler = async (ev) => {
    ev.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      showToast("Welcome back! Redirecting…", "success");
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (err) {
      showToast(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lpage">
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

      {/* Left decorative panel */}
      <div className="lpage__left" aria-hidden="true">
        <div className="brand">
          <div className="brand__icon">✦</div>
          <h2 className="brand__name">Nexus</h2>
          <p className="brand__tagline">Good to have you back.</p>
        </div>
        <ul className="feature-list">
          {["Secure authentication", "Instant dashboard access", "Your data, always safe"].map((f) => (
            <li key={f} className="feature-item">
              <span className="feature-check">✓</span> {f}
            </li>
          ))}
        </ul>
        <div className="deco-circles">
          <span className="dc dc1" />
          <span className="dc dc2" />
          <span className="dc dc3" />
        </div>
      </div>

      {/* Right form panel */}
      <main className="lpage__right">
        <motion.div
          className="lcard"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <header className="lcard__header">
            <h1 className="lcard__title">Welcome back</h1>
            <p className="lcard__sub">Sign in to continue to your dashboard</p>
          </header>

          <form onSubmit={submitHandler} noValidate>
            {/* Email */}
            <div className="field-wrap">
              <label className="field-label" htmlFor="login-email">Email address</label>
              <input
                id="login-email"
                className={`field ${errors.email ? "field--error" : ""}`}
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {errors.email && <span className="err-msg">{errors.email}</span>}
            </div>

            {/* Password */}
            <div className="field-wrap">
              <div className="pass-header">
                <label className="field-label" htmlFor="login-pass">Password</label>
                <a href="#" className="forgot-link">Forgot password?</a>
              </div>
              <div className="pass-wrap">
                <input
                  id="login-pass"
                  className={`field ${errors.password ? "field--error" : ""}`}
                  type={showPass ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="eye-btn" onClick={() => setShowPass((v) => !v)}>
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && <span className="err-msg">{errors.password}</span>}
            </div>

            {/* Remember me */}
            <label className="remember">
              <input type="checkbox" className="remember__check" />
              <span className="remember__box" />
              Keep me signed in
            </label>

            <motion.button
              type="submit"
              className="submit-btn"
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.02 }}
              whileTap={loading ? {} : { scale: 0.98 }}
            >
              {loading ? <span className="spinner" /> : "Sign In"}
            </motion.button>

            <div className="divider"><span>or</span></div>

            <p className="footer-link">
              Don't have an account? <Link to="/register">Create one free</Link>
            </p>
          </form>
        </motion.div>
      </main>
    </div>
  );
}