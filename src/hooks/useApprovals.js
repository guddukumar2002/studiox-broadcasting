/**
 * useApprovals.js
 * Encapsulates pending approvals fetching and approve/reject actions.
 */

import { useState, useEffect, useCallback } from "react";
import { approvalService } from "../services/approval.service";

export function useApprovals() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await approvalService.getPending();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load pending approvals");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const approve = async (id) => {
    setActionLoading(true);
    try {
      await approvalService.approve(id);
      setData((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setActionLoading(false);
    }
  };

  const reject = async (id, reason) => {
    setActionLoading(true);
    try {
      await approvalService.reject(id, reason);
      setData((prev) => prev.filter((c) => c.id !== id));
    } finally {
      setActionLoading(false);
    }
  };

  return { data, loading, error, actionLoading, approve, reject };
}
