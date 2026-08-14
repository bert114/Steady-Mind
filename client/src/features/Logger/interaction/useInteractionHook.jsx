import { useState } from "react";
import { handleToast } from "../../toast/toast.util.js";
import { useModalStore } from "../useModalStore.js";
import { id } from "../../test/id.js";
import { socialService } from "./Interaction.service.js";
import {
  buildInteractionPayload,
  INITIAL_FORM_STATE,
  validateInteractionForm,
} from "./Interaction.utils.js";
import { useCallback } from "react";
import { useEffect } from "react";
import { changeStatus } from "../../burnout/burnoutUtils.js";
import { refreshDashboard } from "../../Dashboard/dashboard.service.js";

export const useInteractionHook = (currentUserId) => {
  const { closeModal } = useModalStore();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState("");

  const handleChange = useCallback((field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  }, []);

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_STATE);
    setError("");
  }, []);

  const handleDismiss = useCallback(() => {
    resetForm();
    closeModal();
  }, [resetForm, closeModal]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInteractionForm(formData);
    if (validationError) {
      setError(validationError);
      handleToast(validationError, "warning", 3000);
      return;
    }

    const payload = buildInteractionPayload(formData, currentUserId);

    try {
      const res = await socialService.logInteraction(payload);

      changeStatus(res.data.burnoutRisk);

      await refreshDashboard();
      handleToast(res.message, "success", 3000);

      handleDismiss();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to record interaction.";

      setError(errorMsg);
      handleToast(errorMsg, "error", 3000);
    }
  };

  const fetchInteraction = useCallback(async () => {
    if (!id) return;

    // setIsLoading(true);
    try {
      const data = await socialService.getUserInteractions(id);

      //setInteractions(data);
    } catch (err) {
      const errorMsg =
        err?.response?.message || "Failed to fetch interactions.";
      setError(errorMsg);
      handleToast(errorMsg, "error", 3000);
    } finally {
      // setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchInteraction();
  }, [fetchInteraction]);

  return {
    formData,
    error,
    handleChange,
    handleSubmit,
    handleDismiss,
    resetForm,
  };
};
