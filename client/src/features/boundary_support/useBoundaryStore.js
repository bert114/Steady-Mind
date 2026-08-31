import { create } from "zustand";
import { useToastStore } from "../toast/useToastStore.js";
import { generate, getMessages, saveMessage } from "./boundary.service.js";

export const useBoundaryStore = create((set, get) => ({
  situation: "",
  tone: "soft",
  draftTone: "soft",
  message: "",
  source: "ai",
  savedId: null,
  draftCount: 0,
  loading: false,
  saving: false,
  error: "",
  history: [],
  historyLoading: true,

  setSituation: (value) => set({ situation: value }),
  setTone: (value) => set({ tone: value }),

  loadHistory: async () => {
    set({ historyLoading: true });

    try {
      const rows = await getMessages();
      set({ history: rows || [], historyLoading: false });
    } catch {
      set({ history: [], historyLoading: false });
    }
  },

  generateBoundary: async () => {
    const { situation, tone, loading } = get();
    const trimmed = situation.trim();

    if (!trimmed || loading) return false;

    set({ loading: true, error: "", savedId: null });

    try {
      const { message, source } = await generate(trimmed, tone);

      set((state) => ({
        message,
        source,
        draftTone: tone,
        draftCount: state.draftCount + 1,
        loading: false,
      }));

      return true;
    } catch (err) {
      set({
        error:
          err.response?.data?.errors?.situation ||
          err.response?.data?.message ||
          err.message ||
          "Couldn't draft a message right now.",
        loading: false,
      });

      return false;
    }
  },

  save: async () => {
    const { situation, message, draftTone, source, saving } = get();

    if (!message || saving) return;

    set({ saving: true });

    try {
      const row = await saveMessage({
        situation: situation.trim(),
        message,
        tone: draftTone,
        source,
      });

      set((state) => ({
        savedId: row.id,
        history: [row, ...state.history],
        saving: false,
      }));

      useToastStore.getState().showToast("Saved to field notes", "success");
    } catch (err) {
      useToastStore
        .getState()
        .showToast(
          err.response?.data?.errors?.message ||
            err.response?.data?.message ||
            "Couldn't save this time.",
          "error",
        );

      set({ saving: false });
    }
  },

  copyText: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      useToastStore.getState().showToast("Copied", "success");
    } catch {
      useToastStore.getState().showToast(
        "Couldn't copy — select it manually",
        "error",
      );
    }
  },
}));