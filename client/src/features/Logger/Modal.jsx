import EnergyMoodModal from "../components/EnergyModal";
import InteractionModal from "./interaction/InteractionModal.jsx";
import { useModalStore } from "./useModalStore.js";

function Modal() {
  const { isOpen, modalType, openModal, closeModal } = useModalStore();

  // if (true) return <></>;

  return modalType === "energy" ? <EnergyMoodModal /> : <InteractionModal />;
}

export default Modal;
