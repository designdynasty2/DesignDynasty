import { useState } from "react";
import { useToast } from "../hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../App";

const OtpPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    email: "",
    otp: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    otp: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "Email is required";
        } else if (!emailRegex.test(value)) {
          error = "Enter a valid email address";
        }
        break;

      case "otp":
        const otpRegex = /^[0-9]{6}$/;
        if (!value.trim()) {
          error = "OTP is required";
        } else if (!otpRegex.test(value)) {
          error = "OTP must be 6 digits";
        }
        break;

      default:
        break;
    }

    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField("email", formData.email),
      otp: validateField("otp", formData.otp),
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) {
      return;
    }

    try {
      setLoading(true);
      setApiError("");
      setSuccessMessage("");

      // 🔑 Replace with your OTP verify API
      const res = await fetch(`${baseUrl}auth/verify-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        // throw new Error(data.message || "OTP verification failed");
        toast({
          title: "OTP verification failed",
          description: data.error,
          variant: "destructive",
        });
      }
      else{
        toast({
        title: "OTP verified successfully",
        description:data.message,
        className: "bg-green-500 text-white border-green-600",
      });
            setFormData({ email: "", otp: "" });
      navigate("/login");
      }
    } catch (err) {
      setApiError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center px-4">
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden flex flex-col md:flex-row w-full max-w-5xl">
        {/* Left Side */}
        <div className="hidden md:flex md:w-1/2 bg-[var(--orange)] text-white flex-col items-center justify-center p-10 space-y-6">
          <h2 className="text-4xl font-bold">Verify Your Account</h2>
          <p className="text-lg opacity-90 text-center">
            Enter your email & OTP to continue
          </p>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              OTP Verification
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              Please enter your email and 6-digit OTP
            </p>

            {/* API messages */}
            {apiError && (
              <p className="text-red-500 text-sm text-center mt-3">
                {apiError}
              </p>
            )}
            {successMessage && (
              <p className="text-green-600 text-sm text-center mt-3">
                {successMessage}
              </p>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-6 space-y-4 sm:space-y-5"
            >
              {/* Email */}
              <div>
                <label className="block text-gray-600 text-sm mb-1 sm:mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--orange)] transition text-sm sm:text-base"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* OTP */}
              <div>
                <label className="block text-gray-600 text-sm mb-1 sm:mb-2">
                  OTP
                </label>
                <input
                  type="text"
                  name="otp"
                  maxLength="6"
                  value={formData.otp}
                  onChange={handleChange}
                  placeholder="Enter 6-digit OTP"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--orange)] transition text-sm sm:text-base tracking-[8px] text-center"
                />
                {errors.otp && (
                  <p className="text-red-500 text-xs mt-1">{errors.otp}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--orange)] hover:bg-orange/90 text-white font-medium py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Didn’t receive the OTP?{" "}
              <a
                href="/resend-otp"
                className="text-[var(--orange)] font-medium hover:underline"
              >
                Resend
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
