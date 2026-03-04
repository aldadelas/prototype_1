import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const DUMMY_PROFILE = {
  username: "john.doe",
  firstName: "John",
  lastName: "Doe",
  birthDate: "1990-05-15",
  jobTitle: "HR Manager",
  email: "john.doe@demohr.com",
  phoneNumber: "+6281234567890",
  companyName: "Demo HR Corp",
  profilePhotoUrl: "https://i.pravatar.cc/100?img=12",
};

interface AuthState {
  username: string;
  fullName: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  jobTitle: string;
  email: string;
  phoneNumber: string;
  companyName: string;
  profilePhotoUrl: string;
  isAuthenticated: boolean;
  hydrated: boolean;
}

const initialState: AuthState = {
  username: DUMMY_PROFILE.username,
  fullName: `${DUMMY_PROFILE.firstName} ${DUMMY_PROFILE.lastName}`,
  firstName: DUMMY_PROFILE.firstName,
  lastName: DUMMY_PROFILE.lastName,
  birthDate: DUMMY_PROFILE.birthDate,
  jobTitle: DUMMY_PROFILE.jobTitle,
  email: DUMMY_PROFILE.email,
  phoneNumber: DUMMY_PROFILE.phoneNumber,
  companyName: DUMMY_PROFILE.companyName,
  profilePhotoUrl: DUMMY_PROFILE.profilePhotoUrl,
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
        firstName?: string;
        lastName?: string;
        birthDate?: string;
        jobTitle?: string;
        email?: string;
        phoneNumber?: string;
        companyName?: string;
        profilePhotoUrl?: string;
        isAuthenticated?: boolean;
      }>,
    ) => {
      const isAuthenticated = action.payload.isAuthenticated ?? false;
      state.username = isAuthenticated
        ? action.payload.username ?? DUMMY_PROFILE.username
        : "";
      state.firstName = isAuthenticated
        ? action.payload.firstName ?? DUMMY_PROFILE.firstName
        : "";
      state.lastName = isAuthenticated
        ? action.payload.lastName ?? DUMMY_PROFILE.lastName
        : "";
      state.fullName = isAuthenticated
        ? action.payload.fullName ??
          `${state.firstName} ${state.lastName}`.trim() ??
          DUMMY_PROFILE.firstName
        : "";
      state.birthDate = isAuthenticated
        ? action.payload.birthDate ?? DUMMY_PROFILE.birthDate
        : "";
      state.jobTitle = isAuthenticated
        ? action.payload.jobTitle ?? DUMMY_PROFILE.jobTitle
        : "";
      state.email = isAuthenticated
        ? action.payload.email ?? DUMMY_PROFILE.email
        : "";
      state.phoneNumber = isAuthenticated
        ? action.payload.phoneNumber ?? DUMMY_PROFILE.phoneNumber
        : "";
      state.companyName = isAuthenticated
        ? action.payload.companyName ?? DUMMY_PROFILE.companyName
        : "";
      state.profilePhotoUrl = isAuthenticated
        ? action.payload.profilePhotoUrl ?? DUMMY_PROFILE.profilePhotoUrl
        : DUMMY_PROFILE.profilePhotoUrl;
      state.isAuthenticated = isAuthenticated;
      state.hydrated = true;
    },
    setCredentials: (
      state,
      action: PayloadAction<{
        username: string;
        fullName?: string;
        firstName?: string;
        lastName?: string;
        birthDate?: string;
        jobTitle?: string;
        email?: string;
        phoneNumber?: string;
        companyName?: string;
        profilePhotoUrl?: string;
      }>,
    ) => {
      state.username = action.payload.username;
      state.firstName = action.payload.firstName ?? "";
      state.lastName = action.payload.lastName ?? "";
      state.fullName =
        action.payload.fullName ??
        `${state.firstName} ${state.lastName}`.trim() ??
        action.payload.username;
      if (!state.fullName) {
        state.fullName = action.payload.username;
      }
      state.birthDate = action.payload.birthDate ?? "";
      state.jobTitle = action.payload.jobTitle ?? "";
      state.email = action.payload.email ?? action.payload.username;
      state.phoneNumber = action.payload.phoneNumber ?? "";
      state.companyName = action.payload.companyName ?? "";
      state.profilePhotoUrl = action.payload.profilePhotoUrl ?? DUMMY_PROFILE.profilePhotoUrl;
      state.isAuthenticated = true;
      state.hydrated = true;
    },
    updateProfile: (
      state,
      action: PayloadAction<{
        fullName?: string;
        firstName?: string;
        lastName?: string;
        birthDate?: string;
        jobTitle?: string;
        email?: string;
        phoneNumber?: string;
        companyName?: string;
        profilePhotoUrl?: string;
      }>,
    ) => {
      if (action.payload.fullName !== undefined) {
        state.fullName = action.payload.fullName;
      }
      if (action.payload.firstName !== undefined) {
        state.firstName = action.payload.firstName;
      }
      if (action.payload.lastName !== undefined) {
        state.lastName = action.payload.lastName;
      }
      if (action.payload.birthDate !== undefined) {
        state.birthDate = action.payload.birthDate;
      }
      if (action.payload.jobTitle !== undefined) {
        state.jobTitle = action.payload.jobTitle;
      }
      if (action.payload.email !== undefined) {
        state.email = action.payload.email;
      }
      if (action.payload.phoneNumber !== undefined) {
        state.phoneNumber = action.payload.phoneNumber;
      }
      if (action.payload.companyName !== undefined) {
        state.companyName = action.payload.companyName;
      }
      if (action.payload.profilePhotoUrl !== undefined) {
        state.profilePhotoUrl = action.payload.profilePhotoUrl;
      }
      if (action.payload.firstName !== undefined || action.payload.lastName !== undefined) {
        state.fullName = `${state.firstName} ${state.lastName}`.trim();
      }
      state.hydrated = true;
    },
    logout: (state) => {
      state.username = "";
      state.fullName = "";
      state.firstName = "";
      state.lastName = "";
      state.birthDate = "";
      state.jobTitle = "";
      state.email = "";
      state.phoneNumber = "";
      state.companyName = "";
      state.profilePhotoUrl = "https://i.pravatar.cc/100?img=12";
      state.isAuthenticated = false;
      state.hydrated = true;
    },
  },
});

export const { hydrateAuth, setCredentials, updateProfile, logout } =
  authSlice.actions;
export default authSlice.reducer;
