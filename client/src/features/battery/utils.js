import { useBatteryStore } from "./useBatteryStore.js";

const setBatteryData = (res = "no battery") => {
  const updateBattery = useBatteryStore.getState().setBatteryData;

  updateBattery(res.data.dailyLog.battery_level);
};

export { setBatteryData };
