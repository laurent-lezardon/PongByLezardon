import { configureStore } from "@reduxjs/toolkit";
import testSliceReducer from "./features/test";
import ballSliceReducer from "./features/ball";

export const store = configureStore({
  reducer: { testSliceReducer, ballSliceReducer },
});
