import { ApiOkResponse } from "apisauce";
import { User } from "../../../models";
import { UserResponse } from "../../../services/api/types";
import { ActionError } from "../../errors/ActionError";
import { Thunk } from "../../store";
import { setUser } from "./slice";
import { GenericApiProblem } from "../../../services/api/genericTypes";

export const setUserInfoOffline: Thunk =
  () =>
  async (dispatch, _, { localStorage }) => {
    let user: User | null = await localStorage.getUser();
    if (user) {
      dispatch(setUser(user));
    }
  };

export const setUserInfo: Thunk =
  () =>
  async (dispatch, _, { api, localStorage, firebaseAuth }) => {
    let user: User | null = await localStorage.getUser();

    const userEmail = firebaseAuth.currentUser?.email;

    if (user === null || user.email !== userEmail) {
      const result = await api.getUserMe() as ApiOkResponse<UserResponse> | GenericApiProblem;

      if (!result.ok || !result.data?.result)
        throw new ActionError(
          `Couldn't get user info: ${result.problem ?? result.problem} ${
            result.originalError ?? result.originalError.message
          }`
        );

      user = result.data?.result;

      await localStorage.saveUser(user);
    }

    dispatch(setUser(user));
  };
