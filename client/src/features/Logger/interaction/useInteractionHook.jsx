import { useState } from "react";
import { handleToast } from "../../toast/toast.util.js";
import { useModalStore } from "../useModalStore.js";

export const useInteractionHook = (currentUserId) => {
  const { isOpen, modalType, openModal, closeModal } = useModalStore();

  const [formData, setFormData] = useState({
    relationship: "",
    personName: "",
    duration: "",
    drainScore: 5,
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
      drainScore: 5,
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
      userId: currentUserId || "primary_user",
      timestamp: new Date().toISOString(),
      relationship: formData.relationship,
      personName: formData.personName.trim() || null,
      duration: formData.duration,
      drainScore: Number(formData.drainScore),
    };

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
