import {
  addTokenToRequestPayloads,
  clearTokenFromRequestPayloads,
} from "../../../services/api/api";
import { ActionError } from "../../errors/ActionError";
import { Thunk } from "../../store";
import { setUserInfo } from "../account";
import {
  sessionError,
  userLoggedIn,
  userLoggedOut,
  waitingForAuthentication,
} from "./slice";

export const loginWithEmailAndPassword: Thunk<
  {
    email: string;
    password: string;
  },
  Promise<boolean>
> = ({ email, password }) => async (dispatch, _, { firebaseAuth }) => {
  try {
    dispatch(waitingForAuthentication());
    await firebaseAuth.signInWithEmailAndPassword(email, password);
    dispatch(setUserWithNewToken());
    return true;
  } catch (error) {
    console.log(error);
    dispatch(sessionError(error.message));

    if (error.code === "auth/invalid-email")
      throw new ActionError("Invalid email");
    if (error.code === "auth/wrong-password")
      throw new ActionError("Worng password");
    if (error.code === "auth/user-not-found")
      throw new ActionError("User not found");

    return false;
  }
};

export const setUserWithNewToken: Thunk = () => async (
  dispatch,
  _,
  { firebaseAuth }
) => {
  const token = await firebaseAuth.currentUser?.getIdToken();

  if (token === undefined) throw new ActionError("User wasn't stored");

  addTokenToRequestPayloads(token);
  dispatch(userLoggedIn(token));
  dispatch(setUserInfo());
};

export const logOut: Thunk = () => (dispatch) => {
  clearTokenFromRequestPayloads();
  dispatch(userLoggedOut());
};
