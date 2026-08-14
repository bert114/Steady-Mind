import { useBurnoutStore } from "./useBurnoutStore";

export const changeStatus = (data) => {
  const change = useBurnoutStore.getState().setBurnoutData;

  change(data);
};
