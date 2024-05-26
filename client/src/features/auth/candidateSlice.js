import { createSlice } from "@reduxjs/toolkit";

const loadToken = () => {
  try {
    const localStorageToken = localStorage.getItem('token');
    if (localStorageToken) {
      return localStorageToken;
    }

    const cookieToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    return cookieToken || null;
  } catch {
    return null;
  }
};

const saveToken = (token) => {
  try {
    localStorage.setItem('token', token);
    document.cookie = `token=${token}; path=/;`;
  } catch (error) {
    console.error('Failed to save token', error);
  }
};

const clearTokenStorage = () => {
  try {
    localStorage.removeItem('token');
    document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  } catch (error) {
    console.error('Failed to clear token', error);
  }
};

const candidateSlice = createSlice({
  name: "candidateAuth",
  initialState: { token: loadToken() },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;   
      saveToken(action.payload);
    },
    clearToken: (state) => {
      state.token = null;
      clearTokenStorage();
    },
  },
});

export const { setToken, clearToken } = candidateSlice.actions;
export default candidateSlice.reducer;
