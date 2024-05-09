import { createSlice } from "@reduxjs/toolkit";

const loadToken = () => {
  try {
    const token = localStorage.getItem('token');
    return token || null;
  } catch {
    return null;
  }
};

const initialState = {
  token: loadToken(),
};

const adminSlice = createSlice({
  name: "adminAuth",
  initialState,
  reducers: {
    setData: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearData: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setData, clearData } = adminSlice.actions;
export default adminSlice.reducer;
