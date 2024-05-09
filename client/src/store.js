import { configureStore } from "@reduxjs/toolkit";
import candidateAuthReducer from "./features/auth/candidateSlice";
import recruiterAuthReducer from "./features/auth/recruiterSlice";
import adminAuthReducer from "./features/auth/adminSlice";

const store = configureStore({
  reducer: {
    candidateAuth: candidateAuthReducer,
    recruiterAuth: recruiterAuthReducer,
    adminAuth: adminAuthReducer,
  },
});
export default store;
