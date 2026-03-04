import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  username: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  isAuthenticated: boolean;
  hydrated: boolean;
}

const initialState: AuthState = {
  username: "",
  fullName: "",
  email: "",
  phoneNumber: "",
  companyName: "",
  isAuthenticated: false,
  hydrated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    hydrateAuth: (
      state,
      action: PayloadAction<{
        username?: string;
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        companyName?: string;
        isAuthenticated?: boolean;
      }>,
    ) => {
      state.username = action.payload.username ?? "";
      state.fullName = action.payload.fullName ?? "";
      state.email = action.payload.email ?? "";
      state.phoneNumber = action.payload.phoneNumber ?? "";
      state.companyName = action.payload.companyName ?? "";
      state.isAuthenticated = action.payload.isAuthenticated ?? false;
      state.hydrated = true;
    },
    setCredentials: (
      state,
      action: PayloadAction<{
        username: string;
        fullName?: string;
        email?: string;
        phoneNumber?: string;
        companyName?: string;
      }>,
    ) => {
      state.username = action.payload.username;
      state.fullName = action.payload.fullName ?? action.payload.username;
      state.email = action.payload.email ?? action.payload.username;
      state.phoneNumber = action.payload.phoneNumber ?? "";
      state.companyName = action.payload.companyName ?? "";
      state.isAuthenticated = true;
      state.hydrated = true;
    },
    logout: (state) => {
      state.username = "";
      state.fullName = "";
      state.email = "";
      state.phoneNumber = "";
      state.companyName = "";
      state.isAuthenticated = false;
      state.hydrated = true;
    },
  },
});

export const { hydrateAuth, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
