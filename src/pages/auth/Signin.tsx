import { Footer } from "@/layouts/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import logo from "@/assets/images/KPV_Taxi_logo_text.png";
import loginImg from "@/assets/images/login.webp";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  Shield,
  Zap,
  Users,
  TrendingUp,
} from "lucide-react";

export default function SigninPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error for this field
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Phone number is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreedToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, just navigate to login
    alert("Account created successfully! Please login.");
    navigate("/auth/login");
    setIsLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col overflow-hidden bg-gradient-to-br from-violet-50 via-purple-50 to-fuchsia-100 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fuchsia-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-violet-400/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative flex-grow flex items-center justify-center p-4 md:p-6">
        <div className="w-full max-w-6xl">
          <Card className="overflow-hidden border-0 shadow-2xl backdrop-blur-sm bg-white/80 dark:bg-slate-900/80 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
            <CardContent className="grid p-0 md:grid-cols-2">
              {/* Left Side - Features */}
              <div className="relative hidden md:flex bg-gradient-to-br from-purple-600 via-violet-600 to-fuchsia-700 p-12 flex-col justify-between overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>

                <div className="relative z-10 space-y-8">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-bold text-white leading-tight">
                      Start Your Journey Today
                    </h2>
                    <p className="text-purple-100 text-lg">
                      Join thousands of satisfied operators using our platform to grow their business.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {[
                      {
                        icon: Shield,
                        title: "Secure & Reliable",
                        description: "Enterprise-grade security for your data",
                      },
                      {
                        icon: Zap,
                        title: "Lightning Fast",
                        description: "Optimized performance for seamless operations",
                      },
                      {
                        icon: Users,
                        title: "Team Collaboration",
                        description: "Work together with your entire team",
                      },
                      {
                        icon: TrendingUp,
                        title: "Business Growth",
                        description: "Scale your operations with confidence",
                      },
                    ].map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 text-white animate-in fade-in-0 slide-in-from-left-4 duration-700"
                        style={{ animationDelay: `${index * 100 + 400}ms` }}
                      >
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold mb-1">{feature.title}</h3>
                          <p className="text-sm text-purple-100">{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-auto">
                  <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20">
                    <p className="text-white text-sm italic">
                      "This platform has transformed how we manage our fleet. Highly recommended!"
                    </p>
                    <p className="text-purple-100 text-xs mt-2">- Sarah Johnson, Fleet Manager</p>
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

              {/* Right Side - Form */}
              <div className="p-8 md:p-12 flex flex-col justify-center max-h-[90vh] overflow-y-auto">
                <div className="flex flex-col gap-6">
                  {/* Logo and Header */}
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="w-36 h-auto mb-1 animate-in fade-in-0 zoom-in-95 duration-500">
                      <img src={logo} alt="KPV Taxi" className="w-full h-auto" />
                    </div>
                    <div className="space-y-1 animate-in fade-in-0 slide-in-from-top-4 duration-700 delay-150">
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 bg-clip-text text-transparent">
                        Create Account
                      </h1>
                      <p className="text-muted-foreground text-sm">
                        Get started with your free account
                      </p>
                    </div>
                  </div>

                  {/* Form */}
                  <form
                    onSubmit={handleSignup}
                    className="space-y-4 animate-in fade-in-0 slide-in-from-bottom-4 duration-700 delay-300"
                  >
                    {/* Full Name */}
                    <div className="space-y-2">
                      <Label htmlFor="fullName" className="text-sm font-medium">
                        Full Name
                      </Label>
                      <div className="relative group">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
                        <Input
                          id="fullName"
                          type="text"
                          value={formData.fullName}
                          placeholder="John Doe"
                          onChange={handleChange}
                          className={`pl-10 h-11 transition-all duration-200 ${
                            errors.fullName
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-purple-500 focus-visible:border-purple-500"
                          }`}
                        />
                      </div>
                      {errors.fullName && (
                        <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-medium">
                        Email Address
                      </Label>
                      <div className="relative group">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          placeholder="john@example.com"
                          onChange={handleChange}
                          className={`pl-10 h-11 transition-all duration-200 ${
                            errors.email
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-purple-500 focus-visible:border-purple-500"
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <div className="relative group">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          placeholder="+1 (555) 000-0000"
                          onChange={handleChange}
                          className={`pl-10 h-11 transition-all duration-200 ${
                            errors.phone
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-purple-500 focus-visible:border-purple-500"
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                      )}
                    </div>

                    {/* Password */}
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-medium">
                        Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          value={formData.password}
                          placeholder="••••••••"
                          onChange={handleChange}
                          className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                            errors.password
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-purple-500 focus-visible:border-purple-500"
                          }`}
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
                      {errors.password && (
                        <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                      )}
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium">
                        Confirm Password
                      </Label>
                      <div className="relative group">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-purple-600 transition-colors" />
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          value={formData.confirmPassword}
                          placeholder="••••••••"
                          onChange={handleChange}
                          className={`pl-10 pr-10 h-11 transition-all duration-200 ${
                            errors.confirmPassword
                              ? "border-red-500 focus-visible:ring-red-500"
                              : "focus-visible:ring-purple-500 focus-visible:border-purple-500"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                      )}
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={agreedToTerms}
                        onCheckedChange={(checked) => {
                          setAgreedToTerms(checked as boolean);
                          if (errors.terms) {
                            setErrors((prev) => ({ ...prev, terms: "" }));
                          }
                        }}
                        className={errors.terms ? "border-red-500" : ""}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        I agree to the{" "}
                        <a href="#" className="text-purple-600 hover:underline font-medium">
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a href="#" className="text-purple-600 hover:underline font-medium">
                          Privacy Policy
                        </a>
                      </label>
                    </div>
                    {errors.terms && (
                      <p className="text-xs text-red-500 mt-1">{errors.terms}</p>
                    )}

                    {/* Sign Up Button */}
                    <Button
                      type="submit"
                      className="w-full h-11 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02]"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Creating account...
                        </div>
                      ) : (
                        "Create Account"
                      )}
                    </Button>

                    {/* Divider */}
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-slate-900 px-2 text-muted-foreground">
                          Or sign up with
                        </span>
                      </div>
                    </div>

                    {/* Social Sign Up Buttons */}
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
                        <span className="sr-only">Sign up with Apple</span>
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
                        <span className="sr-only">Sign up with Google</span>
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
                        <span className="sr-only">Sign up with Facebook</span>
                      </Button>
                    </div>

                    {/* Login Link */}
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground">
                        Already have an account?{" "}
                        <Link
                          to="/auth/login"
                          className="font-medium text-purple-600 hover:text-purple-700 hover:underline transition-colors"
                        >
                          Sign in
                        </Link>
                      </p>
                    </div>
                  </form>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Terms */}
          <div className="mt-6 text-center animate-in fade-in-0 duration-1000 delay-500">
            <p className="text-xs text-muted-foreground">
              Protected by reCAPTCHA and subject to the Google Privacy Policy
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
