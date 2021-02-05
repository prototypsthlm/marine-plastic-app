import { RootState } from "../../store";

export const selectIsLoggedIn = (state: RootState): boolean =>
  Boolean(state.session.token);
