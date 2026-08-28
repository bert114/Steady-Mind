import React, { useEffect } from "react";
import { useToastStore } from "./useToastStore.js";
import "./toast.scss";

const Toast = () => {
  const { isOpen, message, type, duration, hideToast } = useToastStore();

  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      hideToast();
    }, duration);

    return () => clearTimeout(timer);
  }, [isOpen, duration, hideToast]);

  if (!isOpen) return null;

  return (
    <div className={`toast-container ${type}`} role="status">
      <span className="toast-dot" />
      <p className="toast-message">{message}</p>
      <button
        type="button"
        className="toast-dismiss"
        onClick={hideToast}
        aria-label="Close notification"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
