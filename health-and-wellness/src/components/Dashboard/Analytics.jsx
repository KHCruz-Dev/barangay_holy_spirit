import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import DateFloatingLabel from "../Common/DateFloatingLabel";
import SelectFloatingLabel from "../Common/SelectFloatingLabel";
import SampleReport from "../../assets/images/SUMMARY-REPORT-AS-OF-MAY-28-2025.pdf";
import { FaFileAlt } from "react-icons/fa";

const mockCategories = [
  { id: "today", label: "Today", value: "Today" },
  { id: "thisWeek", label: "This Week", value: "This Week" },
  { id: "thisMonth", label: "This Month", value: "This Month" },
  { id: "thisYear", label: "This Year", value: "This Year" },
  { id: "allTime", label: "All Time", value: "All Time" },
];

const COLORS = [
  "#14532d", // green-900
  "#15803d", // green-700
  "#4ade80", // green-300
  "#f44336", // red
  "#ff9800", // orange
  "#03a9f4", // blue
];

// Function to generate random chart data
const randomData = (labels, min = 200, max = 2000) =>
  labels.map((name) => ({
    name,
    value: Math.floor(Math.random() * (max - min + 1)) + min,
  }));

// Function for trends
const randomTrends = () => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  return months.map((month) => ({
    month,
    residents: Math.floor(Math.random() * (2500 - 1500) + 1500),
    voters: Math.floor(Math.random() * (2500 - 1500) + 1500),
  }));
};

const ReportsAndAnalytics = () => {
  const [category, setCategory] = useState("Today");
  const [dataSets, setDataSets] = useState({});

  const openReportsInNewTab = () => {
    window.open(SampleReport, "_blank");
  };

  // Regenerate datasets whenever category changes
  useEffect(() => {
    setDataSets({
      genderData: randomData(["Male", "Female"]),
      civilStatusData: randomData(["Single", "Married", "Widowed"]),
      bloodTypeData: randomData(["A", "B", "AB", "O"]),
      fourPsData: randomData(["4Ps", "Non-4Ps"]),
      employmentData: randomData(["Employed", "Unemployed"]),
      seniorsPwdData: randomData(["Seniors", "PWDs"]),
      residencyData: randomData(["Residents", "Non-Residents"]),
      votersData: randomData(["Voters", "Non-Voters"]),
      trendsData: randomTrends(),
      servicesData: randomData(
        [
          "2D Echo",
          "Ultrasound",
          "Consultation",
          "Detox",
          "Eye Refraction",
          "Laboratory",
          "X-Ray",
          "ECG",
          "High-Potential Therapy",
        ],
        50,
        500
      ),

      // ✅ New datasets with multiple values for District
      districtTotal: randomData(
        ["District 1", "District 2", "District 3", "District 4", "District 5"],
        5000,
        20000
      ),
      barangayData: randomData(
        ["Barangay A", "Barangay B", "Barangay C", "Barangay D", "Barangay E"],
        500,
        5000
      ),
      cityData: randomData(
        ["Quezon City", "Pasig", "Makati", "Novaliches", "Bulacan"],
        1000,
        10000
      ),
    });
  }, [category]);

  const renderPie = (data) => (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, value }) => `${name}: ${value}`}
          isAnimationActive={true}
          animationDuration={800}
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );

  const renderBar = (data) => (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="value"
          fill={COLORS[0]}
          isAnimationActive={true}
          animationDuration={800}
        >
          <LabelList dataKey="value" position="top" />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );

  if (!dataSets.genderData) return null; // Wait for initial data

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-800">
        Reports & Analytics
      </h1>
      <p className="text-sm text-gray-800 mt-2">
        Visual insights into resident demographics, socioeconomic status, and
        civic engagement.
      </p>
      <hr className="my-4 border-gray-400" />

      {/* Filter Section */}
      <div className="bg-gray-50 p-4 rounded-xl shadow mb-6">
        <h2 className="text-lg font-semibold text-green-900 mb-4">
          Filter Reports
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <DateFloatingLabel id="dateRange" label="Filter by Date Range" />
          </div>
          <div className="hidden md:flex items-center text-gray-500 font-medium">
            OR
          </div>
          <div className="flex-1 w-full">
            <SelectFloatingLabel
              id="Categories"
              label="Filter by Categories"
              options={mockCategories}
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={openReportsInNewTab}
            className="mt-4 text-sm font-semibold text-green-800 py-2 px-6 rounded-lg border border-green-900 bg-white hover:bg-green-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300 flex items-center justify-center gap-2"
          >
            <FaFileAlt className="text-lg" />
            Generate Reports
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <section className="bg-gray-50 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-900">
            Total Breakdown
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderBar(dataSets.districtTotal)}
            {renderBar(dataSets.barangayData)}
            {renderBar(dataSets.cityData)}
          </div>
        </section>

        <section className="bg-gray-50 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-900">
            Services Utilization
          </h2>
          {renderHorizontalBar(dataSets.servicesData)}
        </section>

        <section className="bg-gray-50 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-900">
            Demographics Overview
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderPie(dataSets.genderData)}
            {renderPie(dataSets.civilStatusData)}
            {renderPie(dataSets.bloodTypeData)}
          </div>
        </section>

        <section className="bg-gray-50 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-900">
            Socioeconomic Classification
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderBar(dataSets.fourPsData)}
            {renderBar(dataSets.employmentData)}
            {renderBar(dataSets.seniorsPwdData)}
          </div>
        </section>

        <section className="bg-gray-50 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-900">
            Residency & Civic Engagement
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderPie(dataSets.residencyData)}
            {renderPie(dataSets.votersData)}
          </div>
        </section>

        <section className="bg-gray-50 p-4 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4 text-green-900">
            Trends Over Time
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataSets.trendsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="residents"
                stroke={COLORS[0]}
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={800}
              />
              <Line
                type="monotone"
                dataKey="voters"
                stroke={COLORS[2]}
                strokeWidth={2}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </section>
      </div>
    </div>
  );
};

const renderHorizontalBar = (data) => (
  <ResponsiveContainer width="100%" height={400}>
    <BarChart
      data={data}
      layout="vertical"
      margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis type="number" />
      <YAxis dataKey="name" type="category" width={150} />
      <Tooltip />
      <Legend />
      <Bar
        dataKey="value"
        fill={COLORS[1]}
        isAnimationActive={true}
        animationDuration={800}
      >
        <LabelList dataKey="value" position="right" />
      </Bar>
    </BarChart>
  </ResponsiveContainer>
);

export default ReportsAndAnalytics;
