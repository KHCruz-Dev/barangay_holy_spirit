import React, { useState } from "react";
import LoginForm from "../components/Auth/LoginForm";
import RegisterForm from "../components/Auth/RegisterForm";
import RecoverForm from "../components/Auth/RecoverForm";
import authHero from "../assets/images/Councilor Dave Valmocina Logo.png";

const Auth = () => {
  const [activeTab, setActiveTab] = useState("login");

  const renderForm = () => {
    switch (activeTab) {
      case "register":
        return <RegisterForm />;
      case "recover":
        return <RecoverForm />;
      default:
        return <LoginForm />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4">
      {/* MAIN CARD */}
      <div className="w-full max-w-6xl h-[700px] grid grid-cols-1 md:grid-cols-2 rounded-2xl shadow-2xl overflow-hidden bg-white">
        {/* ================= LEFT PANEL ================= */}
        <div className="hidden md:flex items-center justify-center bg-slate-50">
          <div className="text-center space-y-6">
            <img
              src={authHero}
              alt="Alagang Valmocina"
              className="w-64 mx-auto drop-shadow-xl"
            />

            <div>
              <h1 className="text-4xl font-extrabold tracking-wide text-red-700">
                ALAGANG VALMOCINA
              </h1>
              <div className="h-1 w-24 bg-red-600 mx-auto my-3 rounded-full" />
              <p className="text-lg font-medium text-red-600">
                Barangay Holy Spirit
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Health & Wellness Information System
              </p>
            </div>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="flex flex-col bg-[#F7F7F7]">
          {/* ---------- TABS (FIXED) ---------- */}
          <div className="shrink-0 px-8 pt-8">
            <div className="flex justify-center gap-10">
              {["login", "register", "recover"].map((tab) => {
                const isActive = activeTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative pb-2 text-sm font-semibold uppercase tracking-wide transition
                      ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-400 hover:text-gray-600"
                      }`}
                  >
                    {tab}
                    <span
                      className={`absolute left-0 -bottom-1 h-[2px] w-full rounded-full transition-all
                        ${
                          isActive
                            ? "bg-blue-600 scale-x-100"
                            : "bg-blue-600 scale-x-0"
                        }`}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* FORM SCROLL AREA */}
          <div className="flex-1 overflow-y-auto px-6 sm:px-10">
            <div className="min-h-full flex items-center justify-center py-8">
              <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
                {renderForm()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
