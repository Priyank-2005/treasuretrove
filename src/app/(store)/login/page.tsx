"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

type ViewState = "auth" | "forgot" | "otp-register" | "otp-forgot" | "reset";
type TabState = "login" | "register";

export default function LoginPage() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading: isAuthLoading,
    login,
    register,
    verifyOtp,
    requestPasswordReset,
    resetPassword,
  } = useAuth();

  const [view, setView] = useState<ViewState>("auth");
  const [tab, setTab] = useState<TabState>("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Form states
  const [loginEmail, setLoginEmail] = useState("ayushi@example.com");
  const [loginPassword, setLoginPassword] = useState("demo123");
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);

  const [forgotEmail, setForgotEmail] = useState("");

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Redirect if authenticated
  useEffect(() => {
    if (!isAuthLoading && isAuthenticated) {
      router.push("/account");
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // Timer for OTP
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if ((view === "otp-register" || view === "otp-forgot") && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [view, countdown]);

  if (isAuthLoading || isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-light">
        <Loader2 className="w-8 h-8 animate-spin text-gold-mid" />
      </div>
    );
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await login(loginEmail, loginPassword);
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Login failed");
    } else {
      router.push("/account");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (regPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    const res = await register({
      name: regName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
    });
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Registration failed");
    } else {
      setOtp(["", "", "", "", "", ""]);
      setCountdown(30);
      setView("otp-register");
    }
  };

  const handleForgotRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await requestPasswordReset(forgotEmail);
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Failed to send reset email");
    } else {
      setOtp(["", "", "", "", "", ""]);
      setCountdown(30);
      setView("otp-forgot");
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setError("Please enter all 6 digits");
      return;
    }
    setError("");
    setLoading(true);

    if (view === "otp-register") {
      const res = await verifyOtp(otpValue);
      setLoading(false);
      if (!res.success) {
        setError(res.error || "Invalid OTP");
      } else {
        router.push("/account");
      }
    } else if (view === "otp-forgot") {
      // Simulate verifying forgot OTP without logging in, just transition to reset
      setTimeout(() => {
        setLoading(false);
        setView("reset");
      }, 1000);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    const otpValue = otp.join("");
    const res = await resetPassword(otpValue, newPassword);
    setLoading(false);
    if (!res.success) {
      setError(res.error || "Failed to reset password");
    } else {
      setView("auth");
      setTab("login");
    }
  };

  const renderError = () => {
    if (!error) return null;
    return <div className="text-red-500 text-sm mt-2 text-center font-sans">{error}</div>;
  };

  const transitionProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 }
  };

  return (
    <div className="min-h-screen bg-base-light flex items-center justify-center pt-28 md:pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Decorative Star Motifs */}
      <div className="absolute top-10 left-10 text-gold-mid/20 pointer-events-none">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 text-gold-mid/20 pointer-events-none">
        <svg width="60" height="60" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5L12 0z" />
        </svg>
      </div>

      <div className="max-w-md w-full bg-white rounded-2xl shadow-soft p-8 relative z-10 border border-gold-mid/10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Treasure Trove"
              width={140}
              height={40}
              className="mx-auto"
              priority
            />
          </Link>
        </div>

        <AnimatePresence mode="wait">
          {view === "auth" && (
            <motion.div key="auth" {...transitionProps}>
              <div className="flex border-b border-gold-mid/20 mb-6">
                <button
                  onClick={() => { setTab("login"); setError(""); }}
                  className={`flex-1 pb-3 font-serif text-lg transition-colors ${
                    tab === "login"
                      ? "text-base-dark border-b-2 border-gold-mid font-semibold"
                      : "text-text-light-muted hover:text-base-dark"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setTab("register"); setError(""); }}
                  className={`flex-1 pb-3 font-serif text-lg transition-colors ${
                    tab === "register"
                      ? "text-base-dark border-b-2 border-gold-mid font-semibold"
                      : "text-text-light-muted hover:text-base-dark"
                  }`}
                >
                  Create Account
                </button>
              </div>

              {tab === "login" ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type={showLoginPassword ? "text" : "password"}
                        required
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-light-muted hover:text-base-dark"
                      >
                        {showLoginPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => { setView("forgot"); setError(""); }}
                      className="text-sm text-gold-mid hover:text-base-dark font-medium transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  {renderError()}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-pill w-full mt-2 flex justify-center items-center py-3 text-white font-medium"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Sign In"}
                  </button>

                  <div className="mt-4 text-center text-xs text-text-light-muted font-sans border-t border-gold-mid/10 pt-4">
                    Demo credentials: <br />
                    <span className="font-semibold text-base-dark">ayushi@example.com</span> / <span className="font-semibold text-base-dark">demo123</span>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Full Name</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                        <User className="h-5 w-5" />
                      </div>
                      <input
                        type="text"
                        required
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                        placeholder="Ayushi Sainani"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Email</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                        <Mail className="h-5 w-5" />
                      </div>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                        placeholder="you@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Phone</label>
                    <div className="relative flex">
                      <span className="inline-flex items-center px-3 border border-r-0 border-gold-mid/30 bg-gold-highlight/20 text-base-dark text-sm rounded-l">
                        +91
                      </span>
                      <div className="absolute inset-y-0 left-12 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                        <Phone className="h-4 w-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        className="w-full pl-10 pr-3 py-2 border border-gold-mid/30 rounded-r focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                        placeholder="9876543210"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                        <Lock className="h-5 w-5" />
                      </div>
                      <input
                        type={showRegPassword ? "text" : "password"}
                        required
                        minLength={6}
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-10 py-2 border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                        placeholder="Min 6 characters"
                      />
                      <button
                        type="button"
                        onClick={() => setShowRegPassword(!showRegPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-light-muted hover:text-base-dark"
                      >
                        {showRegPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  {renderError()}

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-pill w-full mt-4 flex justify-center items-center py-3 text-white font-medium"
                  >
                    {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Create Account"}
                  </button>
                </form>
              )}
            </motion.div>
          )}

          {view === "forgot" && (
            <motion.div key="forgot" {...transitionProps}>
              <button
                onClick={() => { setView("auth"); setError(""); }}
                className="flex items-center text-sm text-text-light-muted hover:text-base-dark mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Sign In
              </button>
              <h2 className="text-2xl font-serif text-base-dark mb-2 text-center">Reset Password</h2>
              <p className="text-text-light-muted text-sm text-center mb-6 font-sans">
                Enter your email address and we'll send you an OTP to reset your password.
              </p>
              
              <form onSubmit={handleForgotRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                      <Mail className="h-5 w-5" />
                    </div>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {renderError()}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pill w-full mt-4 flex justify-center items-center py-3 text-white font-medium"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send OTP"}
                </button>
              </form>
            </motion.div>
          )}

          {(view === "otp-register" || view === "otp-forgot") && (
            <motion.div key="otp" {...transitionProps}>
              <button
                onClick={() => { 
                  setView(view === "otp-register" ? "auth" : "forgot"); 
                  setError(""); 
                }}
                className="flex items-center text-sm text-text-light-muted hover:text-base-dark mb-6 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-1" /> Change Email
              </button>
              <h2 className="text-2xl font-serif text-base-dark mb-2 text-center">Verify Email</h2>
              <p className="text-text-light-muted text-sm text-center mb-6 font-sans">
                We've sent a 6-digit code to <br />
                <span className="font-semibold text-base-dark">
                  {view === "otp-register" ? regEmail : forgotEmail}
                </span>
              </p>

              <div className="flex justify-between mb-6 gap-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => { otpRefs.current[index] = el; }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center font-serif text-2xl border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 bg-base-light/50 text-base-dark transition-colors"
                  />
                ))}
              </div>

              {renderError()}

              <button
                onClick={handleVerifyOtp}
                disabled={loading || otp.join("").length < 6}
                className="btn-pill w-full mt-4 flex justify-center items-center py-3 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Verify"}
              </button>

              <div className="mt-6 text-center text-sm font-sans">
                <span className="text-text-light-muted">Didn't receive the code? </span>
                {countdown > 0 ? (
                  <span className="text-gold-mid font-medium">Resend in {countdown}s</span>
                ) : (
                  <button 
                    onClick={() => { setCountdown(30); /* Trigger resend API ideally */ }}
                    className="text-base-dark font-semibold hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
              </div>
            </motion.div>
          )}

          {view === "reset" && (
            <motion.div key="reset" {...transitionProps}>
              <h2 className="text-2xl font-serif text-base-dark mb-2 text-center">Create New Password</h2>
              <p className="text-text-light-muted text-sm text-center mb-6 font-sans">
                Please enter your new password below.
              </p>

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-1">New Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                      placeholder="Min 6 characters"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-light-muted hover:text-base-dark"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-1">Confirm Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gold-mid/70">
                      <Lock className="h-5 w-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2 border border-gold-mid/30 rounded focus:outline-none focus:border-gold-mid focus:ring-1 focus:ring-gold-mid/50 font-sans text-base-dark transition-colors"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-light-muted hover:text-base-dark"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {renderError()}

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-pill w-full mt-4 flex justify-center items-center py-3 text-white font-medium"
                >
                  {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Reset Password"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
