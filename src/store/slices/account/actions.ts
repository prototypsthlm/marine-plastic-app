import { User } from "../../../models";
import { ActionError } from "../../errors/ActionError";
import { Thunk } from "../../store";
import { setUser } from "./slice";

export const setUserInfo: Thunk = () => async (dispatch, _, { api }) => {
  const result = await api.getUserMe();

  if (!result.ok || !result.data?.result)
    throw new ActionError("Couldn't get user info.");

  const user: User = result.data?.result;

  dispatch(setUser(user));
};
