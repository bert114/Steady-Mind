import { useToastStore } from "./useToastStore";

function handleToast(message, type = "success") {
  const { showToast, hideToast } = useToastStore.getState();
  showToast(message, type);
}

export { handleToast };
