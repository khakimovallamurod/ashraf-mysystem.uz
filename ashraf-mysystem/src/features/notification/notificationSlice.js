import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  playSound: false,
  notficationData: [],
};

export const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    playSound: (state) => {
      state.playSound = true;
    },
    pauseSound: (state) => {
      state.playSound = false;
    },
    addNotificationData: (state, action) => {
      const { name, list, count } = action.payload;
      if (name) {
        const item = state?.notficationData?.find((item) => item.name === name);
        if (!item) {
          state.notficationData?.push({
            name,
            count,
            list: [...list],
          });
        } else {
          item.count = count;
          item.list = [...list];
        }
      }
    },
  },
});

export const { playSound, pauseSound, addNotificationData } =
  notificationSlice.actions;

export default notificationSlice.reducer;

export const selectNotifSound = (state) => state.notification.playSound;
export const selectNotifData = (state) => state.notification.notficationData;
