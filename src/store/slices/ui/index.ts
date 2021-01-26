import { createSlice } from "@reduxjs/toolkit";

interface UiState {
  activeScreen: string;
}

const initialState: UiState = {
  activeScreen: "list",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setActiveScreen: (state, { payload }) => {
      state.activeScreen = payload;
    },
  },
});

export const { setActiveScreen } = uiSlice.actions;

export default uiSlice.reducer;
