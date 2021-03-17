import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isOnline: boolean;
  isSyncing: boolean;
}

const initialState: UiState = {
  isOnline: false,
  isSyncing: false
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
  },
});

export const { setIsOnline, setIsSyncing } = uiSlice.actions;

export default uiSlice.reducer;
