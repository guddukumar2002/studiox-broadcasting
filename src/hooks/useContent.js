/**
 * useContent.js
 * Encapsulates content fetching logic with loading/error/data states.
 * Components consume this hook — no direct service calls inside components.
 */

import { useState, useEffect, useCallback } from "react";
import { contentService } from "../services/content.service";
import { useAuth } from "../context/AuthContext";

export function useTeacherContent(teacherId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!teacherId) return;
    setLoading(true);
    setError(null);
    try {
      const result = await contentService.getByTeacher(teacherId);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useAllContent() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await contentService.getAll();
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load content");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

export function useLiveContent(teacherId) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetch = useCallback(async () => {
    if (!teacherId) return;
    setError(null);
    try {
      const result = await contentService.getLiveByTeacher(teacherId);
      setData(result);
    } catch (err) {
      setError(err.message || "Failed to load live content");
    } finally {
      setLoading(false);
    }
  }, [teacherId]);

  useEffect(() => {
    fetch();
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [fetch]);

  return { data, loading, error };
}

export function useCreateContent() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const create = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const result = await contentService.create({
        ...payload,
        teacherId: user?.id,
        teacherName: user?.name,
      });
      return result;
    } catch (err) {
      const msg = err.message || "Upload failed.";
      setError(msg);
      throw new Error(msg);
    } finally {
      setLoading(false);
    }
  }, [user]);

  return { create, loading, error };
}
