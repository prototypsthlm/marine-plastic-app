import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isOnline: boolean;
  isOfflineModeNotificationDisabled: boolean;
}

const initialState: UiState = {
  isOnline: false,
  isOfflineModeNotificationDisabled: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsOnline: (state, { payload }) => {
      state.isOnline = payload;
    },
    setOfflineModeNotification: (state, { payload }) => {
      state.isOfflineModeNotificationDisabled = payload;
    },
  },
});

export const { setIsOnline, setOfflineModeNotification } = uiSlice.actions;

export default uiSlice.reducer;
