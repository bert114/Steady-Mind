import EnergyMoodModal from "../components/EnergyModal";

function Modal({ onClose, type, isOpen }) {
  return <EnergyMoodModal onClose={onClose} isOpen={isOpen} />;
}

export default Modal;
