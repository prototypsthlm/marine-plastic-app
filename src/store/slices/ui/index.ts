import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isOnline: boolean;
  isSyncing: boolean;
  isActive: boolean;
}

const initialState: UiState = {
  isOnline: false,
  isSyncing: false,
  isActive: true
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
    }
  },
});

export const { setIsOnline, setIsSyncing, setIsActive } = uiSlice.actions;

export default uiSlice.reducer;
