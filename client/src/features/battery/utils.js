import { useBatteryStore } from "./useBatteryStore.js";

const setBatteryData = (res = "no battery") => {
  const updateBattery = useBatteryStore.getState().setBatteryData;

  updateBattery(res.data.battery_level);
};

export { setBatteryData };
