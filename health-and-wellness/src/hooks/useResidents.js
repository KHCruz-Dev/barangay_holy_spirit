// src/hooks/useResidents.js
import { useEffect, useState } from "react";
import { getResidents } from "../config/services/residentsService";
import { getNonResidents } from "../config/services/nonResidentsService";

export function useResidents({
  page,
  limit,
  search,
  recordType,
  idStatus,
  barangayId, // ✅ ADDED
}) {
  const [residents, setResidents] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const normalize = (data) => {
    if (data && Array.isArray(data.rows)) {
      return {
        rows: data.rows,
        total: data.total ?? data.rows.length,
        totalPages: data.totalPages ?? 1,
      };
    }

    if (Array.isArray(data)) {
      return { rows: data, total: data.length, totalPages: 1 };
    }

    return { rows: [], total: 0, totalPages: 1 };
  };

  async function fetchData() {
    try {
      setLoading(true);
      setError(null);

      const raw =
        recordType === "NON_RESIDENT"
          ? await getNonResidents({ page, limit, search })
          : await getResidents({
              page,
              limit,
              search,
              idStatus,
              barangayId, // ✅ HERE
            });

      const data = normalize(raw);

      setResidents(data.rows);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err.message || "Failed to fetch records");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [page, limit, search, recordType, idStatus, barangayId]); // ✅ HERE

  return {
    residents,
    total,
    totalPages,
    loading,
    error,
    canGoPrev: page > 1,
    canGoNext: page < totalPages,
    refetch: fetchData,
  };
}
