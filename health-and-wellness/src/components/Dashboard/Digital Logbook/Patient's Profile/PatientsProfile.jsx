import React, { useState, useEffect, useRef } from "react";
import { FaUsers, FaHome, FaMapMarkerAlt, FaVoteYea } from "react-icons/fa";
import { MdAdd } from "react-icons/md";

import SummaryCard from "./SummaryCard";
import PatientsProfileModal from "./PatientsProfileModal";
import InputFloatingLabel from "../../../Common/InputFloatingLabel";
import PatientsProfileCard from "./PatientsProfileCard";

import { useResidents } from "../../../../hooks/useResidents";

import { ROLES } from "../../../../config/navigation/roles";
import { useAuth } from "../../../../context/authContext";

import { bulkUpdateResidentIdStatus } from "../../../../config/services/residentsIdStatusService";

import GenerateBulkFrontPreview from "../../../IDCard/GenerateBulkFrontPreview";
import GenerateBulkBackPreview from "../../../IDCard/GenerateBulkBackPreview";
import { A4_PRESETS } from "../../../../utils/a4Layouts";
import { generateResidentA4 } from "../../../../utils/bulkIdGenerator";
import { waitForStableRef } from "../../../../utils/waitForStableRef";
import { waitForImages } from "../../../../utils/waitForImages";

const PatientsProfile = () => {
  function useDebounce(value, delay = 300) {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const timer = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(timer);
    }, [value, delay]);

    return debounced;
  }
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedResident, setSelectedResident] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [modalLoading, setModalLoading] = useState(false);

  // Search Bar
  const [search, setSearch] = useState("");

  const [recordType, setRecordType] = useState("RESIDENT");

  const debouncedSearch = useDebounce(search, 300);

  const [activeCategory, setActiveCategory] = useState("RESIDENT");

  const [summaryData, setSummaryData] = useState([]);

  const { user } = useAuth();

  const [recordSubType, setRecordSubType] = useState("DEFAULT");

  // ID Printer Status Filter
  const [idStatusFilter, setIdStatusFilter] = useState(null);

  const bulkFrontRef = useRef(null);
  const bulkBackRef = useRef(null);

  const [bulkResidents, setBulkResidents] = useState([]);

  const [bulkAvatarMap, setBulkAvatarMap] = useState({});

  const [barangayFilter, setBarangayFilter] = useState(null);

  const { residents, total, totalPages, loading, error, refetch } =
    useResidents({
      page: currentPage,
      limit: itemsPerPage,
      search: debouncedSearch,
      recordType: activeCategory,
      idStatus: idStatusFilter,
      barangayId: barangayFilter, // ✅ NEW
    });

  const startIndex = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;

  const endIndex = Math.min(currentPage * itemsPerPage, total);

  const isIdPrinter =
    user?.role === ROLES.ID_PRINTER && activeCategory === "RESIDENT";

  const handleAdd = () => {
    setRecordType("RESIDENT");
    setSelectedResident(null);
    setIsModalOpen(true);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const handleEdit = async (resident) => {
    setModalLoading(true);
    setIsModalOpen(true);
    setSelectedResident(null);

    try {
      const isNonResident = activeCategory === "NON_RESIDENT";

      setRecordType(isNonResident ? "NON_RESIDENT" : "RESIDENT");

      const endpoint = isNonResident
        ? `${API_URL}/api/nonResidentsProfile/${resident.id}`
        : `${API_URL}/api/residentsProfile/${resident.id}`;

      const res = await fetch(endpoint, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to load resident details");
      }

      const fullRecord = await res.json();
      setSelectedResident(fullRecord);
    } catch (err) {
      console.error("Failed to fetch record:", err);
      alert("Unexpected error loading record");
      setIsModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const openAddResident = () => {
    setRecordType("RESIDENT");
    setRecordSubType("DEFAULT");
    setSelectedResident(null);
    setIsModalOpen(true);
  };

  const openAddDistrict2Resident = () => {
    setRecordType("RESIDENT");
    setRecordSubType("DISTRICT_2");
    setSelectedResident(null);
    setIsModalOpen(true);
  };

  const openAddNonResident = () => {
    setRecordType("NON_RESIDENT");
    setRecordSubType("DEFAULT");
    setSelectedResident(null);
    setIsModalOpen(true);
  };

  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const buildFullName = (r) =>
    [r.first_name, r.middle_name, r.last_name, r.suffix]
      .filter(Boolean)
      .join(" ");

  const isAddressComplete = (r) =>
    r.gis_region_name &&
    r.gis_province_name &&
    r.gis_municipality_name &&
    r.gis_barangay_name &&
    r.gis_subdivision_name;

  const toggleSelectAll = () => {
    if (selectedIds.length === residents.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(residents.map((r) => r.id));
    }
  };

  const handleBulkGenerate = async () => {
    if (!selectedIds.length) {
      alert("Select residents first");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/residentsProfile/bulk`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ids: selectedIds }),
      });

      const rawResidents = await res.json();

      // 🔥 Normalize data
      const normalizedResidents = rawResidents.map((r) => ({
        ...r,
        alagangValmocinaID: r.alagang_valmocina_id,
        firstName: r.first_name,
        middleName: r.middle_name,
        lastName: r.last_name,
        contactNumber: r.contact_number,
        birthDate: r.birthdate,
      }));

      // 🖼️ BUILD AVATAR MAP
      const avatarMap = {};
      rawResidents.forEach((r) => {
        if (r.img_url) {
          avatarMap[r.id] = r.img_url;
          // ⚠️ If img_url is BASE64 → already fine
          // ⚠️ If img_url is path → must be publicly accessible
        }
      });
      setBulkAvatarMap(avatarMap);

      const CHUNK = 10;
      const batches = [];

      for (let i = 0; i < normalizedResidents.length; i += CHUNK) {
        batches.push(normalizedResidents.slice(i, i + CHUNK));
      }

      for (let i = 0; i < batches.length; i++) {
        setBulkResidents(batches[i]);
        await waitForStableRef(bulkFrontRef);
        await waitForImages(bulkFrontRef.current);

        await generateResidentA4({
          frontRef: bulkFrontRef,
          backRef: bulkBackRef,
          resident: batches[i][0],
          index: i,
          batchName: `ALAGANG_VALMOCINA_BATCH_${i + 1}`,
          avatarMap, // ✅ PASS HERE
        });
      }

      await bulkUpdateResidentIdStatus(selectedIds, "Generated");
      await refetch();
      setSelectedIds([]);

      alert("Bulk ID generation completed!");
    } catch (err) {
      console.error(err);
      alert("Bulk generation failed");
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (!selectedIds.length) {
      alert("Select at least one resident.");
      return;
    }

    try {
      await bulkUpdateResidentIdStatus(selectedIds, status);

      await refetch(); // 🔄 refresh table
      setSelectedIds([]); // ✅ clear selection
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  // Summary Data
  useEffect(() => {
    async function loadSummary() {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/dashboard/summary`,
          { credentials: "include" }
        );

        if (!res.ok) return;

        const data = await res.json();
        console.log("SUMMARY RESPONSE:", data);
        // =========================
        // ADMIN VIEW
        // =========================
        if (data.role === "ADMINISTRATOR") {
          setSummaryData([
            {
              title: "Registered Barangay Residents",
              value: data.summary.total_residents,
              icon: FaHome,
            },
            {
              title: "Registered Non-Residents",
              value: data.summary.total_non_residents,
              icon: FaMapMarkerAlt,
            },
            {
              title: "Registered Resident Voters",
              value: data.summary.voters,
              icon: FaVoteYea,
            },
            {
              title: "Registered Non Resident Non-Voters",
              value: data.summary.non_voters,
              icon: FaUsers,
            },
          ]);
        }

        // =========================
        // ENCODER / REGISTRATION / COORDINATOR
        // =========================
        if (data.role === "ENCODER_VIEW") {
          setSummaryData([
            {
              title: "Residents Encoded",
              value: data.summary.encoded_residents,
              icon: FaHome,
            },
            {
              title: "Non-Residents Encoded",
              value: data.summary.encoded_non_residents,
              icon: FaMapMarkerAlt,
            },
            {
              title: "Today's Encoded Records",
              value: data.summary.encoded_today,
              icon: FaVoteYea,
            },
            {
              title: "Total Records Encoded",
              value: data.summary.encoded_total,
              icon: FaUsers,
            },
          ]);
        }

        // =========================
        // ✅ ID PRINTER VIEW (FINAL FIX)
        // =========================
        if (data.role === "ID_PRINTER") {
          setSummaryData([
            {
              title: "Total Barangay Residents",
              value: data.summary.total_residents, // ✅ MUST BE `value`
              icon: FaHome,
            },
          ]);
        }
      } catch (err) {
        console.error("Failed to load summary:", err);
      }
    }

    loadSummary();
  }, []);

  const ID_STATUS_BADGE = {
    Pending: "bg-yellow-100 text-yellow-800 border border-yellow-300",
    Generated: "bg-blue-100 text-blue-800 border border-blue-300",
    Printed: "bg-indigo-100 text-indigo-800 border border-indigo-300",
    "For Distribution":
      "bg-orange-100 text-orange-800 border border-orange-300",
    Distributed: "bg-green-100 text-green-800 border border-green-300",
  };

  const renderIdStatus = (status) => {
    const classes =
      ID_STATUS_BADGE[status] ||
      "bg-gray-100 text-gray-600 border border-gray-300";

    return (
      <span
        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${classes}`}
      >
        {status || "—"}
      </span>
    );
  };

  const visibleResidents = residents;

  const ID_STATUSES = [
    "Pending",
    "Generated",
    "Printed",
    "For Distribution",
    "Distributed",
  ];

  const [idStatusCounts, setIdStatusCounts] = useState({});

  const fetchIdStatusCounts = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/residentsProfile/id-status-counts`,
        { credentials: "include" }
      );

      if (!res.ok) return;

      const data = await res.json();
      setIdStatusCounts(data);
    } catch (err) {
      console.error("Failed to fetch ID status counts:", err);
    }
  };

  useEffect(() => {
    if (user?.role === ROLES.ID_PRINTER) {
      fetchIdStatusCounts();
    }
  }, [user]);

  const BARANGAYS = {
    HOLY_SPIRIT: "bcd4ef7a-6c32-4014-992a-6ccebd894b79",
    PAYATAS: "705c13e1-d45a-4430-989a-1aaa143bb934",
    COMMONWEALTH: "85624e18-9b9a-4ebb-a1e6-99d33897a2fb",
    BATASAN_HILLS: "b9c61d5d-6c59-457e-bd93-f4656ffbcc2f",
    BAGONG_SILANGAN: "c5ba5980-081f-44b9-add2-61dbfab7d692",
  };

  return (
    <div className={loading || modalLoading ? "cursor-wait" : ""}>
      {/* Header */}
      <h1 className="text-2xl font-semibold text-gray-800">
        Patient's Profile
      </h1>
      <p className="text-sm text-gray-800 mt-2">
        Manage and monitor health & wellness Resident's Profile.
      </p>

      {/* Summary */}
      <h1 className="text-lg font-semibold text-gray-800 ">Quick Overview</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 pb-6">
        {summaryData.map((item, index) => (
          <SummaryCard key={index} {...item} />
        ))}
      </div>

      <hr className="my-1 border-gray-400" />

      {/* ================= SEARCH ================= */}
      <h1 className="text-lg font-semibold text-gray-800 mt-4">
        Search Profiles
      </h1>
      <p className="text-xs text-gray-500 mb-2">Find residents by name or ID</p>

      <div className="w-full md:w-96 bg-white border rounded-md p-4 shadow-sm mb-6">
        <InputFloatingLabel
          label="Search Profile (Name / ID)"
          value={search}
          onChange={(e) => {
            setCurrentPage(1);
            setSearch(e.target.value);
          }}
        />
      </div>

      {/* ================= ACTIONS ================= */}
      <hr className="my-1 border-gray-400 mb-4" />

      <div className="flex items-center justify-end mb-2">
        <h1 className="text-lg font-semibold text-gray-700">
          Create New Profile
        </h1>
      </div>

      <div className="flex flex-wrap gap-3 mb-6 justify-end">
        <button
          onClick={openAddNonResident}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md
      border border-green-800 text-green-800 bg-white
      hover:bg-green-800 hover:text-white transition"
        >
          <MdAdd size={18} />
          Non-Resident
        </button>

        <button
          onClick={openAddDistrict2Resident}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md
      border border-green-800 text-green-800 bg-white
      hover:bg-green-800 hover:text-white transition"
        >
          <MdAdd size={18} />
          District 2 Resident
        </button>

        <button
          onClick={openAddResident}
          className="inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-md
      border border-green-800 text-green-800 bg-white
      hover:bg-green-800 hover:text-white transition"
        >
          <MdAdd size={18} />
          Barangay Resident
        </button>
      </div>

      {/* ================= FILTERS ================= */}
      <h1 className="text-lg font-semibold text-gray-700 mb-2">
        Filter Records
      </h1>

      <div className="flex flex-wrap gap-2 mb-6">
        {[
          { label: "Barangay Holy Spirit", id: BARANGAYS.HOLY_SPIRIT },
          { label: "Barangay Payatas", id: BARANGAYS.PAYATAS },
          { label: "Barangay Commonwealth", id: BARANGAYS.COMMONWEALTH },
          { label: "Barangay Batasan Hills", id: BARANGAYS.BATASAN_HILLS },
          { label: "Barangay Bagong Silangan", id: BARANGAYS.BAGONG_SILANGAN },
        ].map((b) => (
          <button
            key={b.id}
            onClick={() => {
              setActiveCategory("RESIDENT");
              setRecordType("RESIDENT");
              setBarangayFilter(b.id);
              setSelectedIds([]);
              setCurrentPage(1);
            }}
            className={`px-4 py-2 text-sm font-medium rounded-md border transition ${
              barangayFilter === b.id
                ? "bg-green-800 text-white border-green-800"
                : "bg-white text-green-800 border-green-800 hover:bg-green-800 hover:text-white"
            }`}
          >
            {b.label}
          </button>
        ))}

        {/* DISTRICT 2 */}
        <button
          onClick={() => {
            setActiveCategory("RESIDENT");
            setRecordType("RESIDENT");
            setBarangayFilter(null);
            setRecordSubType("DISTRICT_2");
            setCurrentPage(1);
          }}
          className="px-4 py-2 text-sm font-medium rounded-md border
      bg-white text-green-800 border-green-800 hover:bg-green-800 hover:text-white"
        >
          District 2 Residents
        </button>

        {/* NON RESIDENTS */}
        <button
          onClick={() => {
            setActiveCategory("NON_RESIDENT");
            setRecordType("NON_RESIDENT");
            setBarangayFilter(null);
            setSelectedIds([]);
            setCurrentPage(1);
          }}
          className={`px-4 py-2 text-sm font-medium rounded-md border transition ${
            activeCategory === "NON_RESIDENT"
              ? "bg-green-800 text-white border-green-800"
              : "bg-white text-green-800 border-green-800 hover:bg-green-800 hover:text-white"
          }`}
        >
          Non Residents
        </button>
      </div>

      {/* Cards */}
      <h1 className="text-lg text-gray-800 mt-2 mb-2">
        {activeCategory === "RESIDENT"
          ? "Manage Barangay Residents"
          : "Manage Non-Residents"}
      </h1>
      {!loading && !error && residents.length === 0 && (
        <p className="text-sm text-gray-600">No resident/s record found.</p>
      )}

      {/* ID PRINTER TABLE VIEW */}
      {isIdPrinter ? (
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-green-800 text-white">
              <tr>
                <th className="px-3 py-2 text-xs">
                  <input
                    type="checkbox"
                    checked={
                      residents.length > 0 &&
                      selectedIds.length === residents.length
                    }
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="px-4 py-3 text-left">Full Name</th>
                <th className="px-4 py-3 text-left">Full Address</th>
                <th className="px-4 py-3 text-left">ID Status</th>
              </tr>
            </thead>

            <tbody>
              {visibleResidents.map((r) => {
                const incomplete = !isAddressComplete(r);

                return (
                  <tr
                    key={r.id}
                    className="border-t transition hover:bg-gray-50"
                  >
                    {/* ✅ Checkbox column — NO modal opening */}
                    <td className="w-12 px-2 py-3 text-center">
                      <label className="inline-flex items-center justify-center w-10 h-10 cursor-pointer">
                        <input
                          type="checkbox"
                          className="h-5 w-5 accent-green-700"
                          checked={selectedIds.includes(r.id)}
                          onChange={() => toggleSelect(r.id)}
                        />
                      </label>
                    </td>

                    {/* ✅ Clickable cell */}
                    <td
                      onClick={() => handleEdit(r)}
                      className="px-2 py-1 font-medium text-gray-800 cursor-pointer"
                    >
                      {buildFullName(r)}
                    </td>

                    {/* ✅ Clickable cell */}
                    <td
                      onClick={() => handleEdit(r)}
                      className="px-2 py-1 cursor-pointer"
                    >
                      {incomplete ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded">
                          Address is incomplete
                        </span>
                      ) : (
                        <span className="text-gray-700">
                          {r.complete_address}
                        </span>
                      )}
                    </td>

                    {/* ✅ ID STATUS COLUMN */}
                    <td
                      onClick={() => handleEdit(r)}
                      className="px-2 py-1 cursor-pointer"
                    >
                      {renderIdStatus(r.alagang_valmocina_id_status)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* BULK ACTION */}
          {/* BULK UPDATE ACTIONS */}
          <div className="border-t bg-gray-50 p-4">
            <p className="text-xs font-semibold text-gray-600 uppercase mb-2">
              Bulk Update Actions
            </p>

            <div className="flex flex-wrap justify-end gap-2">
              {/* 1️⃣ Generate ID */}
              <button
                onClick={handleBulkGenerate}
                disabled={!selectedIds.length}
                className="px-4 py-2 text-sm font-medium rounded-md
        bg-blue-600 text-white hover:bg-blue-700
        disabled:opacity-40 disabled:cursor-not-allowed"
              >
                1. Generate ID
              </button>

              {/* 2️⃣ Printed */}
              <button
                onClick={() => handleBulkStatusUpdate("Printed")}
                disabled={!selectedIds.length}
                className="px-4 py-2 text-sm font-medium rounded-md
        bg-indigo-600 text-white hover:bg-indigo-700
        disabled:opacity-40 disabled:cursor-not-allowed"
              >
                2. Printed
              </button>

              {/* 3️⃣ For Distribution */}
              <button
                onClick={() => handleBulkStatusUpdate("For Distribution")}
                disabled={!selectedIds.length}
                className="px-4 py-2 text-sm font-medium rounded-md
        bg-orange-600 text-white hover:bg-orange-700
        disabled:opacity-40 disabled:cursor-not-allowed"
              >
                3. For Distribution
              </button>

              {/* 4️⃣ Distributed */}
              <button
                onClick={() => handleBulkStatusUpdate("Distributed")}
                disabled={!selectedIds.length}
                className="px-4 py-2 text-sm font-medium rounded-md
        bg-green-700 text-white hover:bg-green-800
        disabled:opacity-40 disabled:cursor-not-allowed"
              >
                4. Distributed
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* DEFAULT CARD VIEW */
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 ${
            loading || modalLoading
              ? "cursor-wait opacity-70 pointer-events-none"
              : ""
          }`}
        >
          {residents.map((resident) => (
            <PatientsProfileCard
              key={resident.id}
              resident={resident}
              onEdit={handleEdit}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {/* Pagination */}
      {total > 0 && (
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-700">
          {/* Left: Range info */}
          <div>
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {startIndex}–{endIndex}
            </span>{" "}
            of <span className="font-semibold text-gray-900">{total}</span>{" "}
            records
          </div>

          {/* Center: Page info */}
          <div className="hidden sm:block">
            Page{" "}
            <span className="font-semibold text-gray-900">{currentPage}</span>{" "}
            of <span className="font-semibold text-gray-900">{totalPages}</span>
          </div>

          {/* Right: Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1 || loading}
              className="px-4 py-2 rounded-full border border-gray-300
                   hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || loading}
              className="px-4 py-2 rounded-full border border-gray-300
                   hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      <PatientsProfileModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        existingResident={selectedResident}
        recordType={recordType}
        recordSubType={recordSubType}
        onSaved={async () => {
          await refetch(); // 🔄 fetch fresh data
          setCurrentPage(1); // ✅ optional: reset to page 1 on add
          setIsModalOpen(false); // ❌ close modal
        }}
      />

      {/* Floating Button (Tablet) */}
      <button
        onClick={handleAdd}
        className="fixed bottom-6 right-6 lg:hidden w-14 h-14 rounded-full bg-green-800 text-white shadow-lg"
      >
        <MdAdd size={28} />
      </button>

      <div className="fixed -left-[99999px] top-0 pointer-events-none">
        <GenerateBulkFrontPreview
          ref={bulkFrontRef}
          residents={bulkResidents}
          avatarMap={bulkAvatarMap}
          layoutSize={10}
        />

        <GenerateBulkBackPreview
          ref={bulkBackRef}
          residents={bulkResidents}
          layoutSize={10}
        />
      </div>
    </div>
  );
};

export default PatientsProfile;
