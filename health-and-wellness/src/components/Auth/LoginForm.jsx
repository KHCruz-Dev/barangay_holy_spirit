import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputFloatingLabel from "../Common/InputFloatingLabel";
import GoogleDividerButton from "./GoogleDividerButton";
import { Eye, EyeOff } from "lucide-react";
import { loginAccount } from "../../config/services/auth/authService";
import { useAuth } from "../../context/authContext";

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = form; // ✅ THIS WAS MISSING

    if (!email || !password) {
      return setError("Email and password are required.");
    }

    try {
      setIsSubmitting(true);

      const res = await loginAccount({
        email,
        password,
      });

      // ✅ store user in AuthContext
      setUser(res.user);

      navigate("/dashboard");
    } catch (err) {
      setError(err?.message || "Login failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-300 w-full max-w-md">
      <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
        <InputFloatingLabel
          id="email"
          label="Email"
          type="email"
          value={form.email}
          onChange={handleChange}
          disabled={isSubmitting}
        />

        <div className="relative">
          <InputFloatingLabel
            id="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-[65%] -translate-y-1/2 text-lg text-gray-500 hover:text-blue-500"
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <Eye /> : <EyeOff />}
          </button>
        </div>

        <div className="flex items-center justify-between text-sm px-1 mt-2 mb-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="form-checkbox text-blue-600"
              disabled={isSubmitting}
            />
            Remember me
          </label>
          <span className="text-blue-600 hover:underline cursor-pointer">
            Forgot password?
          </span>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-sm py-3 rounded-md border-2 transition duration-200 ${
            isSubmitting
              ? "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
              : "text-blue-600 border-blue-600 bg-transparent hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-400"
          }`}
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>

        <div className="flex items-center mb-2 mt-2">
          <hr className="flex-grow border-t border-blue-600" />
          <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
          <hr className="flex-grow border-t border-blue-600" />
        </div>

        <GoogleDividerButton text="Register with Google Account" />

        {/* Inline Error */}
        <div
          className={`grid transition-all duration-500 overflow-hidden ${
            error ? "max-h-24 opacity-100 mb-2 mt-3" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
