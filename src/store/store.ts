import {
  configureStore,
  combineReducers,
  AnyAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Services
import api from "../services/api";
import localStorage from "../services/localStorage";
import * as navigation from "../services/navigation";
import { firebaseAuth } from "../services/firebaseAuth";

// Slices
import observationsReducer from "./slices/observations";
import sessionReducer from "./slices/session";
import uiReducer from "./slices/ui";

const rootReducer = combineReducers({
  observations: observationsReducer,
  session: sessionReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          api,
          localStorage,
          navigation,
          firebaseAuth,
        },
      },
    }),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export default store;

interface Services {
  api: typeof api;
  localStorage: typeof localStorage;
  navigation: typeof navigation;
  firebaseAuth: typeof firebaseAuth;
}

export type Thunk<P = undefined, R = void> = P extends undefined
  ? () => ThunkAction<R, RootState, Services, AnyAction>
  : (payload: P) => ThunkAction<R, RootState, Services, AnyAction>;

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();
