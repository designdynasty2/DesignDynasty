import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../App";

const SignUp = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    mobile: "",
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "name":
        if (!value.trim()) {
          error = "Name is required";
        } else if (value.length < 3) {
          error = "Name must be at least 3 characters";
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          error = "Email is required";
        } else if (!emailRegex.test(value)) {
          error = "Enter a valid email address";
        }
        break;

      case "mobile":
        const mobileRegex = /^[0-9]{10}$/;
        if (!value.trim()) {
          error = "Mobile number is required";
        } else if (!mobileRegex.test(value)) {
          error = "Mobile number must be 10 digits";
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

    // Live validation while typing
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all fields fresh
    const newErrors = {
      name: validateField("name", formData.name),
      email: validateField("email", formData.email),
      mobile: validateField("mobile", formData.mobile),
    };

    setErrors(newErrors);

    // Check if any error exists
    const hasError = Object.values(newErrors).some((err) => err !== "");
    if (hasError) {
      return;
    }

    try {
      setLoading(true);
      setApiError("");
      setSuccessMessage("");

      const res = await fetch(`${baseUrl}auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: "",
          description: data.error || "Something went wrong",
          variant: "destructive",
        });
        throw new Error(data.message || "Something went wrong");
      }
      toast({
        title: "",
        description: data.message,
        className: "bg-green-500 text-white border-green-600",
      });
      setFormData({ name: "", email: "", mobile: "" });
      navigate("/otp-page");
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
          <h2 className="text-4xl font-bold">Join Us Today!</h2>
          <p className="text-lg opacity-90 text-center">
            Create an account to explore all features
          </p>
        </div>

        {/* Right Side (Form) */}
        <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            <h2 className="text-3xl font-bold text-center text-gray-800">
              Sign Up
            </h2>
            <p className="text-sm text-gray-500 text-center mt-2">
              Fill in your details to create an account
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
              {/* Name */}
              <div>
                <label className="block text-gray-600 text-sm mb-1 sm:mb-2">
                  Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--orange)] transition text-sm sm:text-base"
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
              </div>

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

              {/* Mobile */}
              <div>
                <label className="block text-gray-600 text-sm mb-1 sm:mb-2">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--orange)] transition text-sm sm:text-base"
                />
                {errors.mobile && (
                  <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--orange)] hover:bg-orange/90 text-white font-medium py-3 rounded-lg transition transform hover:scale-[1.02] active:scale-95 disabled:opacity-70"
              >
                {loading ? "Submitting..." : "Sign Up"}
              </button>
            </form>

            {/* Footer */}
            <p className="text-center text-gray-600 text-sm mt-6">
              Already have an account?{" "}
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

export default SignUp;
