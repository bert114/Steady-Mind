import { useEffect, useRef, useState } from "react";
import { useBoundaryStore } from "./useBoundaryStore.js";

const TONES = [
  { id: "soft", label: "Soft", note: "Kind, room to stay close" },
  { id: "direct", label: "Direct", note: "Plain, no over-explaining" },
  { id: "firm", label: "Firm", note: "Kind, and final" },
];

const TONE_LABEL = TONES.reduce((acc, t) => ({ ...acc, [t.id]: t.label }), {});

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
};

export function useBoundaryHook() {
  const situation = useBoundaryStore((s) => s.situation);
  const setSituation = useBoundaryStore((s) => s.setSituation);
  const tone = useBoundaryStore((s) => s.tone);
  const setTone = useBoundaryStore((s) => s.setTone);
  const draftTone = useBoundaryStore((s) => s.draftTone);
  const message = useBoundaryStore((s) => s.message);
  const source = useBoundaryStore((s) => s.source);
  const savedId = useBoundaryStore((s) => s.savedId);
  const draftCount = useBoundaryStore((s) => s.draftCount);
  const loading = useBoundaryStore((s) => s.loading);
  const saving = useBoundaryStore((s) => s.saving);
  const error = useBoundaryStore((s) => s.error);
  const history = useBoundaryStore((s) => s.history);
  const historyLoading = useBoundaryStore((s) => s.historyLoading);
  const generateBoundary = useBoundaryStore((s) => s.generateBoundary);
  const save = useBoundaryStore((s) => s.save);
  const copyText = useBoundaryStore((s) => s.copyText);
  const loadHistory = useBoundaryStore((s) => s.loadHistory);

  const [expandedId, setExpandedId] = useState(null);
  const draftRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  useEffect(() => {
    if (!draftCount || !message) return;
    draftRef.current?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
    });
  }, [draftCount, message]);

  const toggleExpanded = (id) =>
    setExpandedId((current) => (current === id ? null : id));

  const handleSubmit = (e) => {
    e.preventDefault();
    generateBoundary();
  };

  return {
    TONES,
    TONE_LABEL,
    formatDate,
    situation,
    setSituation,
    tone,
    setTone,
    draftTone,
    message,
    source,
    savedId,
    draftCount,
    loading,
    saving,
    error,
    history,
    historyLoading,
    generateBoundary,
    save,
    copyText,
    expandedId,
    toggleExpanded,
    draftRef,
    handleSubmit,
  };
}