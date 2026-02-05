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

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulate loading
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (formData.email != "admin@gmail.com" && formData.password != "qwerty") {
      setError("Invalid credentials. Please try again.");
      setIsLoading(false);
      return;
    }

    const userData = {
      id: 1,
      email: formData.email,
      name: "Test User",
      role: "admin",
      isAuthenticated: true,
    };
    login(userData);
    setIsLoading(false);
    navigate(`/${userData.role}`);
  };

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
                    <div className="space-y-2 animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-150">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Welcome Back
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        Sign in to access your KPV Taxi Administration
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleLogin} className="space-y-5 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300">
                    {/* Email Field */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          placeholder="john@example.com"
                          onChange={handleChange}
                          className={`pl-10 h-11 transition-all duration-200 ${
                            error
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-blue-500 focus-visible:border-blue-500"
                          }`}
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">
                          Password
                        </Label>
                        <a
                          href="#"
                          className="text-xs text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-blue-600 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          onChange={handleChange}
                          className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                            error
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-blue-500 focus-visible:border-blue-500"
                          }`}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                      <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                        <p className="text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                          {error}
                        </p>
                      </div>
                    )}

                    {/* Login Button */}
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
                      ) : (
                        "Sign In"
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                          Or continue with
                        </span>
                      </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="grid grid-cols-3 gap-3">
                      <Button
                        variant="outline"
                        type="button"
                        className="h-11 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                        >
                          <path
                            d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="sr-only">Login with Apple</span>
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        className="h-11 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                        >
                          <path
                            d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="sr-only">Login with Google</span>
                      </Button>
                      <Button
                        variant="outline"
                        type="button"
                        className="h-11 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 hover:scale-105"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          className="h-5 w-5"
                        >
                          <path
                            d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
                            fill="currentColor"
                          />
                        </svg>
                        <span className="sr-only">Login with Facebook</span>
                      </Button>
                    </div>

                    {/* Sign Up Link */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link
                          to="/auth/signup"
                          className="font-medium text-blue-600 hover:text-blue-700 hover:underline transition-colors"
                        >
                          Create account
                        </Link>
                      </p>
                    </div>
                  </form>
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
