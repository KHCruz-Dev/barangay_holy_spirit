import { useState, useEffect } from "react";
import InputFloatingLabel from "../Common/InputFloatingLabel";
import ComboBoxFloatingLabel from "../Common/ComboFloatingLabel";
import {
  getAllNamePrefix,
  getAllNameSuffx,
} from "../../config/services/hris/hrisService";

import GoogleDividerButton from "./GoogleDividerButton";
import { Eye, EyeOff } from "lucide-react";
import { registerAccount } from "../../config/services/auth/authService";

const RegisterForm = () => {
  const [form, setForm] = useState({
    prefix: "",
    firstName: "",
    middleName: "",
    lastName: "",
    suffix: "",
    contact: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [prefixOptions, setPrefixOptions] = useState([]);
  const [suffixOptions, setSuffixOptions] = useState([]);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  /* =========================
     SANITIZERS
  ========================== */
  const sanitizeName = (v) => v.replace(/[^a-zA-Z\s]/g, "");
  const sanitizeContact = (v) => v.replace(/\D/g, "").slice(0, 10);
  const sanitizeEmail = (v) => v.trim().toLowerCase();
  const sanitizePassword = (v) => v.replace(/\s/g, "");

  const handleChange = (e) => {
    const { id, value } = e.target;
    let sanitized = value;

    switch (id) {
      case "firstName":
      case "middleName":
      case "lastName":
        sanitized = sanitizeName(value);
        break;
      case "contact":
        sanitized = sanitizeContact(value);
        break;
      case "email":
        sanitized = sanitizeEmail(value);
        break;
      case "password":
      case "confirmPassword":
        sanitized = sanitizePassword(value);
        break;
      default:
        sanitized = value;
    }

    setForm((p) => ({ ...p, [id]: sanitized }));
    if (error) setError("");
  };

  const updateField = (field) => (valueOrEvent) => {
    const value = valueOrEvent?.target?.value ?? valueOrEvent ?? "";
    setForm((p) => ({ ...p, [field]: value }));
    if (error) setError("");
  };

  /* =========================
     VALIDATION
  ========================== */
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const {
      firstName,
      middleName,
      lastName,
      prefix,
      suffix,
      contact,
      email,
      password,
      confirmPassword,
    } = form;

    /* ================= CLIENT VALIDATION ================= */
    if (!firstName || !lastName) {
      return setError("First and Last Name are required.");
    }

    if (contact.length !== 10) {
      return setError("Mobile number must be exactly 10 digits.");
    }

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }

    if (!password || password !== confirmPassword) {
      return setError("Passwords do not match.");
    }

    /* ================= API CALL ================= */
    try {
      setIsSubmitting(true);

      await registerAccount({
        firstName,
        middleName,
        lastName,
        prefix,
        suffix,
        contact,
        email,
        password,
        confirmPassword,
      });

      // ✅ SUCCESS
      alert("Registration successful! Your account is pending admin approval.");

      setForm({
        prefix: "",
        firstName: "",
        middleName: "",
        lastName: "",
        suffix: "",
        contact: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      /* ================= ERROR HANDLING ================= */
      const message =
        err?.response?.data?.message ||
        "Registration failed. Please try again.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  /* =========================
     LOAD PREFIX / SUFFIX
  ========================== */
  useEffect(() => {
    const mapToOptions = (rows, key) =>
      rows.map((r) => ({ label: r[key], value: r[key] }));

    async function loadAffixes() {
      try {
        const [prefixes, suffixes] = await Promise.all([
          getAllNamePrefix(),
          getAllNameSuffx(),
        ]);

        setPrefixOptions(mapToOptions(prefixes, "prefix_category"));
        setSuffixOptions(mapToOptions(suffixes, "suffix_category"));
      } catch (err) {
        console.error("Failed to load prefix/suffix", err);
      }
    }

    loadAffixes();
  }, []);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full max-w-3xl overflow-visible">
      <form
        className="flex flex-col gap-4 overflow-visible"
        onSubmit={handleSubmit}
      >
        {/* ================= NAME (PRIMARY) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 overflow-visible">
          <InputFloatingLabel
            id="firstName"
            label="First Name"
            value={form.firstName}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <InputFloatingLabel
            id="middleName"
            label="Middle Name"
            value={form.middleName}
            onChange={handleChange}
            disabled={isSubmitting}
          />

          <InputFloatingLabel
            id="lastName"
            label="Last Name"
            value={form.lastName}
            onChange={handleChange}
            disabled={isSubmitting}
          />
        </div>

        {/* ================= PREFIX / SUFFIX ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 opacity-90 overflow-visible">
          <ComboBoxFloatingLabel
            label="Prefix (Optional)"
            options={prefixOptions}
            value={form.prefix}
            onChange={updateField("prefix")}
          />

          <ComboBoxFloatingLabel
            label="Suffix (Optional)"
            options={suffixOptions}
            value={form.suffix}
            onChange={updateField("suffix")}
          />
        </div>

        {/* ================= CONTACT ================= */}
        <InputFloatingLabel
          id="contact"
          label="Mobile Number (+639XXXXXXXXX)"
          value={form.contact}
          onChange={handleChange}
          onBlur={() => {
            if (form.contact.length !== 10) {
              setError("Mobile number must be exactly 10 digits.");
            }
          }}
        />

        {/* ================= EMAIL ================= */}
        <InputFloatingLabel
          id="email"
          label="Email Address"
          type="email"
          value={form.email}
          onChange={handleChange}
        />

        {/* ================= PASSWORDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="relative">
            <InputFloatingLabel
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-[60%] -translate-y-1/2 text-gray-500"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>

          <div className="relative">
            <InputFloatingLabel
              id="confirmPassword"
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              value={form.confirmPassword}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-[60%] -translate-y-1/2 text-gray-500"
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
        </div>

        {/* ================= SUBMIT ================= */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 border-2 border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition"
        >
          {isSubmitting ? "Registering..." : "Register"}
        </button>

        <GoogleDividerButton text="Register with Google Account" />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default RegisterForm;
