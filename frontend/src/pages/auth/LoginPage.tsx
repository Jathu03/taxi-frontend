import { Footer } from "@/layouts/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import loginImg from "@/assets/images/login.webp";
import logo from "@/assets/images/KPV_Taxi_logo_text.png";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, Car, CheckCircle2 } from "lucide-react";

import { userService } from "@/services/user/userService";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // "LOGIN" | "FORGOT_PASSWORD" | "VERIFY_OTP"
  const [viewState, setViewState] = useState<"LOGIN" | "FORGOT_PASSWORD" | "VERIFY_OTP">("LOGIN");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    otpCode: "",
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    setSuccessMessage("");
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // ─────────────────────────────────────────────────────────────
  // 1. Handle Login
  // ─────────────────────────────────────────────────────────────
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Hardcoded admin fallback
    if (formData.email === "admin@gmail.com" && formData.password === "123456") {
      const userData = {
        id: 0,
        email: "admin@gmail.com",
        name: "Admin User",
        role: "admin",
        isAuthenticated: true,
      };
      login(userData);
      setIsLoading(false);
      navigate("/admin");
      return;
    }

    const roleMap: Record<string, string> = {
      admin: "admin",
      administrator: "admin",
      accountant: "accountant",
      "call center agent": "callCenterAgent",
      callcenteragent: "callCenterAgent",
      call_center_agent: "callCenterAgent",
      corporate: "corporate",
      driver: "driver",
    };

    try {
      const response = await userService.login({
        username: formData.email,
        password: formData.password,
      });

      const rawRole =
        response.roles && response.roles.length > 0
          ? response.roles[0].roleName
          : "admin";

      const role = roleMap[rawRole.toLowerCase()] ?? rawRole.toLowerCase();

      const userData = {
        id: response.id,
        email: response.email,
        name: `${response.firstName} ${response.lastName}`,
        role: role,
        isAuthenticated: true,
      };

      login(userData);
      setIsLoading(false);

      const redirectPath = role === "driver" ? "/admin/driver-dashboard" : "/admin";
      navigate(redirectPath);
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message ||
        err.message ||
        "Invalid credentials. Please try again."
      );
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 2. Handle Forgot Password (Send OTP)
  // ─────────────────────────────────────────────────────────────
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setIsLoading(true);

    try {
      const response = await userService.forgotPassword(formData.email);
      setSuccessMessage(response.message);
      setIsLoading(false);
      setViewState("VERIFY_OTP");
    } catch (err: any) {
      console.error("Failed to send OTP:", err);
      setError(err.response?.data?.message || err.message || "Failed to send OTP.");
      setIsLoading(false);
    }
  };

  // ─────────────────────────────────────────────────────────────
  // 3. Handle Verify OTP
  // ─────────────────────────────────────────────────────────────
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await userService.verifyOtp(formData.email, formData.otpCode);
      setIsLoading(false);
      // Navigate to reset password page with userId
      navigate(`/admin/users/${response.userId}/reset-password`);
    } catch (err: any) {
      console.error("OTP verification failed:", err);
      setError(err.response?.data?.message || "Invalid OTP code.");
      setIsLoading(false);
    }
  };


  // ─────────────────────────────────────────────────────────────
  // UI RENDERERS
  // ─────────────────────────────────────────────────────────────

  const renderLoginForm = () => (
    <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            placeholder="john@example.com"
            onChange={handleChange}
            className={`pl-10 h-11 transition-all duration-200 ${error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-blue-500 focus-visible:border-blue-500"}`}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <button
            type="button"
            onClick={() => { setError(""); setViewState("FORGOT_PASSWORD"); }}
            className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            className={`pl-10 pr-10 h-11 transition-all duration-200 ${error ? "border-red-500 focus-visible:ring-red-500" : "focus-visible:ring-blue-500 focus-visible:border-blue-500"}`}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Signing in...
          </div>
        ) : ("Sign In")}
      </Button>
    </form>
  );

  const renderForgotPasswordForm = () => (
    <form onSubmit={handleSendOtp} className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Reset Password</h2>
        <p className="text-sm text-muted-foreground mt-1">Enter your email to receive a verification code.</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-medium">Email Address</Label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            placeholder="john@example.com"
            onChange={handleChange}
            className="pl-10 h-11 focus-visible:ring-blue-500 focus-visible:border-blue-500"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? "Sending..." : "Send Verification Code"}
      </Button>

      <button
        type="button"
        onClick={() => { setError(""); setViewState("LOGIN"); }}
        className="w-full text-sm text-slate-500 hover:text-slate-900 mt-4"
      >
        Back to Login
      </button>
    </form>
  );

  const renderVerifyOtpForm = () => (
    <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-4">
        <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100">Verify Code</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Enter the 6-digit code sent to <span className="font-medium text-slate-900">{formData.email}</span>
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="otpCode" className="text-sm font-medium">OTP Code</Label>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
          <Input
            id="otpCode"
            type="text"
            maxLength={6}
            value={formData.otpCode}
            placeholder="123456"
            onChange={handleChange}
            className="pl-10 h-11 tracking-widest text-lg font-mono focus-visible:ring-blue-500 focus-visible:border-blue-500"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300"
        disabled={isLoading}
      >
        {isLoading ? "Verifying..." : "Verify Code"}
      </Button>

      <button
        type="button"
        onClick={() => { setError(""); setViewState("FORGOT_PASSWORD"); }}
        className="w-full text-sm text-slate-500 hover:text-slate-900 mt-4"
      >
        Back to Email Entry
      </button>
    </form>
  );

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative flex-grow flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl">
          <Card className="overflow-hidden border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Left Side - Form */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <div className="flex flex-col gap-8">
                  {/* Logo and Header */}
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-40 h-auto mb-2 animate-in fade-in-0 zoom-in-95 duration-500">
                      <img src={logo} alt="KPV Taxi" className="w-full h-auto" />
                    </div>
                    {viewState === "LOGIN" && (
                      <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-150">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                          Welcome Back
                        </h1>
                        <p className="text-muted-foreground text-sm">
                          Sign in to access your KPV Taxi Administration
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Feedback Messages */}
                  {error && (
                    <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                      <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        {error}
                      </p>
                    </div>
                  )}
                  {successMessage && (
                    <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                      <p className="text-green-600 dark:text-green-400 text-sm font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-600 rounded-full"></span>
                        {successMessage}
                      </p>
                    </div>
                  )}

                  {/* Dynamic Form Rendering */}
                  {viewState === "LOGIN" && renderLoginForm()}
                  {viewState === "FORGOT_PASSWORD" && renderForgotPasswordForm()}
                  {viewState === "VERIFY_OTP" && renderVerifyOtpForm()}

                </div>
              </div>

              {/* Right Side - Image & Features */}
              <div className="relative hidden md:flex bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 p-12 flex-col justify-between overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-white leading-tight">
                      Manage Your Taxi Fleet with Ease
                    </h2>
                    <p className="text-blue-100 text-lg">
                      Streamline operations, track bookings, and optimize your taxi service all in one place.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      "Real-time booking management",
                      "Advanced driver tracking",
                      "Comprehensive analytics",
                      "24/7 customer support",
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 text-white animate-in fade-in-0 slide-in-from-left-4 duration-700"
                        style={{ animationDelay: `${index * 100 + 400}ms` }}
                      >
                        <div className="flex-shrink-0 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                          <CheckCircle2 className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <div className="flex items-center gap-3 text-white/80 text-xs">
                    <Car className="w-5 h-5" />
                    <span>Trusted by 1000+ taxi operators worldwide</span>
                  </div>
                </div>

                {/* Background Image Overlay */}
                <div className="absolute inset-0 opacity-10">
                  <img
                    src={loginImg}
                    alt="Taxi Service"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="mt-6 text-center animate-in fade-in-0 duration-1000 delay-500">
            <p className="text-xs text-muted-foreground">
              By continuing, you agree to our{" "}
              <a href="#" className="underline hover:text-foreground transition-colors">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="underline hover:text-foreground transition-colors">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
