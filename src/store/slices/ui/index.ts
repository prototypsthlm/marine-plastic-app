import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  isOnline: boolean;
}

const initialState: UiState = {
  isOnline: false,
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setIsOnline: (state, { payload }) => {
      state.isOnline = payload;
    },
  },
});

export const { setIsOnline } = uiSlice.actions;

export default uiSlice.reducer;
