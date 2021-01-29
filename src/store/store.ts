import {
  configureStore,
  combineReducers,
  AnyAction,
  ThunkAction,
} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

// Services
import * as navigation from "../services/navigation";

// Slices
import observationsReducer from "./slices/observations";
import uiReducer from "./slices/ui";

const rootReducer = combineReducers({
  observations: observationsReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          navigation,
        },
      },
    }),
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export default store;

interface Services {
  navigation: typeof navigation;
}

export type Thunk<P = undefined, R = void> = P extends undefined
  ? () => ThunkAction<R, RootState, Services, AnyAction>
  : (payload: P) => ThunkAction<R, RootState, Services, AnyAction>;

export const useThunkDispatch = () => useDispatch<typeof store.dispatch>();
