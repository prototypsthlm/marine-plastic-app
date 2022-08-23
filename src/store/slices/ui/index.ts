import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isOnline: boolean;
  isSyncing: boolean;
  isActive: boolean;
  isWelcomeMessageVisible: boolean;
}

const initialState: UiState = {
  isOnline: false,
  isSyncing: false,
  isActive: true,
  isWelcomeMessageVisible: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsOnline: (state, { payload }) => {
      state.isOnline = payload;
    },
    setIsSyncing: (state, { payload}) => {
      state.isSyncing = payload;
    },
    setIsActive: (state, {payload}) => {
      state.isActive = payload
    },
    setIsWelcomeMessageVisible: (state, {payload}) => {
      state.isWelcomeMessageVisible = payload
    }
  },
});

export const { setIsOnline, setIsSyncing, setIsActive, setIsWelcomeMessageVisible } = uiSlice.actions;

export default uiSlice.reducer;
