import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  username: string;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: "",
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ username: string }>) => {
      state.username = action.payload.username;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.username = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
