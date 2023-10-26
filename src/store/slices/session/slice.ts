import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SessionState {
  status: "PENDING" | "READY";
  errorMessage?: string;
  token?: string;
  email?: string;
}

export const initialState: SessionState = {
  status: "READY",
  errorMessage: undefined,
  token: undefined,
  email: "",
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    waitingForAuthentication: (state) => {
      state.status = "PENDING";
    },
    sessionError: (state, { payload }: PayloadAction<string>) => {
      state.errorMessage = payload;
      state.status = "READY";
    },
    userLoggedIn: (
      state,
      { payload }: PayloadAction<{ token: string; email: string }>
    ) => {
      state.email = payload.email;
      state.errorMessage = undefined;
      state.token = payload.token;
      state.status = "READY";
    },
    userLoggedOut: () => {
      return initialState;
    },
  },
});

export const {
  sessionError,
  userLoggedIn,
  userLoggedOut,
  waitingForAuthentication,
} = sessionSlice.actions;

export default sessionSlice.reducer;
