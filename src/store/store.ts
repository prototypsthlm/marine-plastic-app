import { configureStore, combineReducers } from "@reduxjs/toolkit";
import observationsReducer from "./slices/observations";
import uiReducer from "./slices/ui";

const rootReducer = combineReducers({
  observations: observationsReducer,
  ui: uiReducer,
});

const store = configureStore({
  reducer: rootReducer,
  devTools: true,
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof rootReducer>;
export default store;
