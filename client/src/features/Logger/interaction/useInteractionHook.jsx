import { useCallback, useEffect, useState } from "react";
import { changeStatus } from "../../burnout/burnoutUtils.js";
import { refreshDashboard } from "../../Dashboard/dashboard.service.js";
import { id } from "../../test/id.js";
import { handleToast } from "../../toast/toast.util.js";
import { useModalStore } from "../useModalStore.js";
import { socialService } from "./Interaction.service.js";
import {
  buildInteractionPayload,
  INITIAL_FORM_STATE,
} from "./Interaction.utils.js";

export const useInteractionHook = (currentUserId) => {
  const { closeModal } = useModalStore();

  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  useEffect(() => {
    console.log(error);
  }, [error]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    //const validationError = validateInteractionForm(formData);
    // if (validationError) {
    //   setError(validationError);
    //   handleToast(validationError, "warning", 3000);
    //   return;
    // }

    if (error) return;

    const payload = buildInteractionPayload(formData, currentUserId);

    try {
      setIsSubmitting(true);
      setError("");
      const res = await socialService.logInteraction(payload);

      changeStatus(res.data.burnoutRisk);

      await refreshDashboard();
      handleToast(res.message, "success", 3000);

      handleDismiss();
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || "Failed to record interaction.";

      console.log(err?.response.data.errors);

      setError(err.response?.data?.errors);
      //handleToast(errorMsg, "error", 3000);
    } finally {
      setIsSubmitting(false);
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
    isSubmitting,
    handleChange,
    handleSubmit,
    handleDismiss,
    resetForm,
  };
};
