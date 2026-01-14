import { useState } from "react";
import InputFloatingLabel from "../Common/InputFloatingLabel";
import GoogleDividerButton from "./GoogleDividerButton";
import ToastAlert from "../Common/ToastAlert";

const RecoverForm = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleChange = (e) => {
    setEmail(e.target.value);
    setError(""); // clear error on input
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      return setError("Email is required.");
    }

    if (!validateEmail(email)) {
      return setError("Please enter a valid email address.");
    }

    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      // Success logic here
    }, 1500);
  };

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 transition-all duration-300 w-full max-w-md">
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <InputFloatingLabel
          id="recover-email"
          label="Email Address"
          type="email"
          value={email}
          onChange={handleChange}
          onFocus={() => setError("")} // clear error on focus too
          disabled={isSubmitting}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full text-sm py-3 rounded-md border-2 transition duration-200 ${
            isSubmitting
              ? "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
              : "text-blue-600 border-blue-600 bg-transparent hover:bg-blue-600 hover:text-white hover:shadow-md hover:shadow-blue-400"
          }`}
        >
          {isSubmitting ? "Processing..." : "Recover Account"}
        </button>

        <div className="flex items-center">
          <hr className="flex-grow border-t border-blue-600" />
          <span className="px-3 text-gray-500 text-sm font-medium">OR</span>
          <hr className="flex-grow border-t border-blue-600" />
        </div>

        <GoogleDividerButton text="Recover with Google Account" />

        {/* Toast Alert */}
        <div
          className={`grid transition-all duration-500 overflow-hidden ${
            error ? "max-h-24 opacity-100 mt-2" : "max-h-0 opacity-0"
          }`}
        >
          <ToastAlert type="error" message={error} />
        </div>
      </form>
    </div>
  );
};

export default RecoverForm;
