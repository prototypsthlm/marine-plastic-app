import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/session/selectors";
import { useEffect, useState } from "react";
import { RootState, useThunkDispatch } from "../store/store";
import {
  initialState as sessionInitialState,
  userLoggedInOffline,
} from "../store/slices/session";
import { setUserInfoOffline } from "../store/slices/account";

export const useLogoutDetection = ({ isOnline }: { isOnline: boolean }) => {
  const dispatch = useThunkDispatch();

  const user = useSelector((state: RootState) => state.account.user);
  const session = useSelector((state: RootState) => state.session);
  const hasToken = useSelector(selectIsLoggedIn);

  const [shouldBeLoggedOut, setShouldBeLoggedOut] = useState(false);

  const debug = () => {
    console.log("---------- DEBUG -----------");
    console.log(" ");
    console.log(" ");
    console.log("isOnline: ", isOnline);
    console.log("hasToken: ", hasToken);
    console.log("local user:", user);
    console.log("session: ", JSON.stringify(session, null, 4));
    console.log("shouldBeLoggedOut:", shouldBeLoggedOut);
    console.log(" ");
    console.log(" ");
    console.log("-----------------------------");
    console.log(" ");
    console.log(" ");
  };

  useEffect(() => {
    // Get user from localStorage if offline
    if (!isOnline && !user) {
      dispatch(setUserInfoOffline());
    }
  }, [isOnline]);

  useEffect(() => {
    // Log in offline
    if (!isOnline && user && session === sessionInitialState) {
      dispatch(userLoggedInOffline({ email: user.email }));
    }
  }, [user, isOnline]);

  useEffect(() => {
    /**
     * Note:
     * The session state will be in initialState if we are closing the app and then starting it again when offline (the app won't be able to fetch token)
     * User data is stored in LocalStorage on login, so that is the only thing we can use to know if the user historically logged in or not
     */

    if (!isOnline) {
      if (session === sessionInitialState) {
        setShouldBeLoggedOut(true);
        return;
      }

      setShouldBeLoggedOut(false);
      return;
    }

    /** If the app is online just do the normal token check  */
    setShouldBeLoggedOut(!hasToken);
  }, [session, isOnline, user]);

  return shouldBeLoggedOut;
};
