import {
  addTokenToRequestPayloads,
  clearTokenFromRequestPayloads,
} from "../../../services/api";
import { ActionError } from "../../errors/ActionError";
import { Thunk } from "../../store";
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

    const token = await firebaseAuth.currentUser?.getIdToken();

    if (token === undefined) throw new ActionError();

    addTokenToRequestPayloads(token);
    dispatch(userLoggedIn(token));
    // TODO: Get user info & store it in another slice (account slice?)
    return true;
  } catch (error) {
    console.log(error);
    dispatch(sessionError(error.message));

    // Temporal
    if (error.code === "auth/invalid-email")
      throw new ActionError("Invalid email");
    if (error.code === "auth/wrong-password")
      throw new ActionError("Worng password");
    if (error.code === "auth/user-not-found")
      throw new ActionError("User not found");

    return false;
  }
};

export const logOut: Thunk = () => (dispatch) => {
  clearTokenFromRequestPayloads();
  dispatch(userLoggedOut());
};
