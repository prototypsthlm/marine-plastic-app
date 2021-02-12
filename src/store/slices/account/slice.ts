import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../../../models";

interface AccountState {
  user?: User;
}

const initialState: AccountState = {
  user: undefined,
};

export const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    setUser: (state, { payload }: PayloadAction<User>) => {
      state.user = payload;
    },
    clearUser: (state) => {
      state.user = undefined;
    },
  },
});

export const { setUser, clearUser } = accountSlice.actions;

export default accountSlice.reducer;
