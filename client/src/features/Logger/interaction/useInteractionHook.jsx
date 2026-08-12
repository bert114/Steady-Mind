import { useState } from "react";
import { handleToast } from "../../toast/toast.util.js";
import { useModalStore } from "../useModalStore.js";
import { id } from "../../test/id.js";
import { socialService } from "./Interaction.service.js";

export const useInteractionHook = (currentUserId) => {
  const { isOpen, modalType, openModal, closeModal } = useModalStore();

  const [formData, setFormData] = useState({
    relationship: "",
    personName: "",
    duration: "",
    drainScore: 0,
  });

  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError("");
  };

  const resetForm = () => {
    setFormData({
      relationship: "",
      personName: "",
      duration: "",
      drainScore: 0,
    });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.relationship) {
      setError("Please select a relationship category.");
      return;
    }
    if (!formData.duration) {
      setError("Please select a duration chip.");
      return;
    }

    const interactionPayload = {
      user_id: id || currentUserId || "primary_user",
      relationship_type: formData.relationship,
      custom_name: formData.personName.trim() || null,
      duration_minutes: Number(formData.duration),
      drain_score: Number(formData.drainScore),
      timestamp: new Date().toISOString(),
    };

    socialService.logInteraction(interactionPayload);

    console.log("Interaction logged:", interactionPayload);

    handleToast("Social interaction recorded.", "success", 3000);

    resetForm();
    closeModal();
  };

  const handleDismiss = () => {
    resetForm();
    closeModal();
  };

  return {
    formData,
    error,
    handleChange,
    handleSubmit,
    handleDismiss,
  };
};
