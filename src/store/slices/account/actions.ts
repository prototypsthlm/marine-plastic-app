import { User } from "../../../models";
import { ActionError } from "../../errors/ActionError";
import { Thunk } from "../../store";
import { setUser } from "./slice";

export const setUserInfo: Thunk = () => async (
  dispatch,
  _,
  { api, localStorage, firebaseAuth }
) => {
  let user: User | null = await localStorage.getUser();

  const userEmail = firebaseAuth.currentUser?.email;

  if (user === null || user.email !== userEmail) {
    const result = await api.getUserMe();

    if (!result.ok || !result.data?.result)
      throw new ActionError("Couldn't get user info.");

    user = result.data?.result;

    await localStorage.saveUser(user);
  }

  dispatch(setUser(user));
};
