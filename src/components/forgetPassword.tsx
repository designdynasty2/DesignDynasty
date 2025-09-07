import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../App";

const ForgetPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value.trim()) {
      return "Email is required";
    } else if (!emailRegex.test(value)) {
      return "Enter a valid email address";
    }
    return "";
  };

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(validateEmail(e.target.value));
    setApiError("");
    setSuccessMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateEmail(email);
    setError(validationError);
    if (validationError) return;

    try {
      setLoading(true);
      setApiError("");
      setSuccessMessage("");

      const res = await fetch(`${baseUrl}auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "Login failed",
          description: data.error,
          variant: "destructive",
        });
      } else {
        toast({
          description: data.message,
          className: "bg-green-500 text-white border-green-600",
        });
        navigate("/reset-password");
        setEmail("");
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
          <h2 className="text-4xl font-bold">Forgot Password?</h2>
          <p className="text-lg opacity-90 text-center">
            Enter your email and we’ll send you reset instructions
          </p>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Forgot Password
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              Please enter your registered email
            </p>

            {/* API Messages */}
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
                  value={email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--orange)] transition text-sm sm:text-base"
                />
                {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--orange)] hover:bg-orange/90 text-white font-medium py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Remembered your password?{" "}
              <a
                href="/login"
                className="text-[var(--orange)] font-medium hover:underline"
              >
                Login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgetPassword;
