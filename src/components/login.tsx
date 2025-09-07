import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../App";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 👈 loader state
  const [serverError, setServerError] = useState(""); // 👈 backend error

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
    setErrors({ ...errors, [name]: "" });
    setServerError("");
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const res = await fetch(`${baseUrl}auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const message = data.error || "Login failed";
        toast({
          title: "Login failed",
          description: message,
          variant: "destructive",
        });
      } else {
        if (data.user.role === "admin") {
          toast({
            title: "Logged in",
            description: "You have successfully logged in.",
            className: "bg-green-500 text-white border-green-600",
          });
          if (data.token) {
            localStorage.setItem("ddtoken", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("email", data.user.email);
            // Store login timestamp for auto-logout handling
            localStorage.setItem("loginTime", String(Date.now()));
          }
          navigate("/auth/dashboard");
        } else {
          toast({
            title: "Logged in",
            description: "You have successfully logged in.",
            className: "bg-green-500 text-white border-green-600",
          });
          localStorage.setItem("ddtoken", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("username", data.user.username);
            localStorage.setItem("email", data.user.email);
            // Store login timestamp for auto-logout handling
            localStorage.setItem("loginTime", String(Date.now()));
          navigate("/pricing");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      const message = "Something went wrong. Please try again.";
      setServerError(message);
      toast({
        title: "Network error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-[var(--orange)] text-white items-center justify-center p-10">
          <div className="text-center space-y-6">
            <h2 className="text-4xl font-bold">Welcome Back!</h2>
            <p className="text-lg opacity-90">
              Enter your credentials and continue your journey with us
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex items-center justify-center">
          <div className="w-full">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Login
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              Welcome back! Please enter your details
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Email */}
              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                    errors.email
                      ? "border-red-500 focus:ring-red-500"
                      : "focus:ring-[var(--orange)]"
                  } transition`}
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              {/* Password with toggle */}
              <div>
                <label className="block text-gray-600 text-sm mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 ${
                      errors.password
                        ? "border-red-500 focus:ring-red-500"
                        : "focus:ring-[var(--orange)]"
                    } transition`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOffIcon size={20} />
                    ) : (
                      <EyeIcon size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Server error */}
              {serverError && (
                <p className="text-red-600 text-sm text-center">
                  {serverError}
                </p>
              )}

              {/* Remember me & Forgot password */}
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 text-gray-600">
                  <input
                    type="checkbox"
                    name="remember"
                    checked={formData.remember}
                    onChange={handleChange}
                    className="h-4 w-4 text-[var(--orange)] rounded focus:ring-[var(--orange)]"
                  />
                  <span>Remember me</span>
                </label>
                <a
                  href="/forget-password"
                  className="text-[var(--orange)] font-medium hover:underline"
                >
                  Forgot password?
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--orange)] hover:bg-orange/90 text-white font-medium py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Don’t have an account?{" "}
              <a
                href="/signup"
                className="text-[var(--orange)] font-medium hover:underline"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
