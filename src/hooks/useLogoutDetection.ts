import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/session/selectors";
import { useEffect, useState } from "react";
import { RootState } from "../store/store";
import { initialState } from "../store/slices/session";

export const useLogoutDetection = ({ isOnline }: { isOnline: boolean }) => {
  const session = useSelector((state: RootState) => state.session);
  const hasToken = useSelector(selectIsLoggedIn);

  const [shouldBeLoggedOut, setShouldBeLoggedOut] = useState(false);

  const debug = () => {
    console.log("---------- DEBUG -----------");
    console.log(" ");
    console.log(" ");
    console.log("isOnline: ", isOnline);
    console.log("hasToken: ", hasToken);
    console.log("session: ", JSON.stringify(session, null, 4));
    console.log("shouldBeLoggedOut:", shouldBeLoggedOut);
    console.log(" ");
    console.log(" ");
    console.log("-----------------------------");
    console.log(" ");
    console.log(" ");
  };

  useEffect(() => {
    if (!isOnline) {
      /**
       *  If the app is offline with no internet connection we want to prevent logging out the user
       *  If the session is in an intial state that means that the user probably actively logged out of the app
       *  Otherwise keep the user logged in until there is an internet connection
       */
      if (session === initialState) {
        setShouldBeLoggedOut(true);
        return;
      }

      return;
    }

    /** If the app is online just do the normal token check  */
    setShouldBeLoggedOut(!hasToken);
  }, [session, isOnline]);

  return shouldBeLoggedOut;
};
