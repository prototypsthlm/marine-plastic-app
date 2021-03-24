import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../store/slices/session";
import { syncOfflineEntries } from "../store/slices/observations";
import { RootState, useThunkDispatch } from "../store/store";

export default function useSync() {

  const dispatch = useThunkDispatch();

  const isLoggedIn = useSelector(selectIsLoggedIn);
  const isSyncing = useSelector<RootState, boolean>(state => (state.ui.isSyncing));
  const isOnline = useSelector<RootState, boolean>(
    (state) => state.ui.isOnline
  );

  const canSync = isOnline && isLoggedIn && !isSyncing;

  useEffect(() => {
    if(canSync) { 
      dispatch(syncOfflineEntries());
    }  
  },[isOnline, isLoggedIn]);
}