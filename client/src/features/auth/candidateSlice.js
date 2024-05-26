import { createSlice } from "@reduxjs/toolkit";

const loadToken = () => {
  try {
    const token = localStorage.getItem('token');
    return token || null;
  } catch {
    return null;
  }
};

const candidateSlice = createSlice({
  name: "candidateAuth",
  initialState: { token: loadToken() },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      localStorage.setItem('token', action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      localStorage.removeItem('token');
    },
  },
});


export const { setToken, clearToken } = candidateSlice.actions;
export default candidateSlice.reducer;
