import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AvatarCustomization } from "@shared/schema";

interface AvatarState {
  customizations: AvatarCustomization[];
  scanHistory: {
    id: number;
    date: string;
    measurements: {
      height: number;
      weight: number;
      chestSize: number;
      waistSize: number;
      armSize: number;
      legSize: number;
    }
  }[];
  loading: boolean;
  error: string | null;
}

const initialState: AvatarState = {
  customizations: [
    {
      id: 1,
      userId: 1,
      name: "Il mio avatar",
      isPrimary: true,
      avatarData: {
        body: "athletic",
        height: 180,
        hairStyle: "short",
        hairColor: "#000000",
        skinTone: "#edc4b1",
        eyeColor: "#336699",
        facialHair: "none",
      },
      previewUrl: "https://picsum.photos/id/1/200/200",
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString(),
    },
  ],
  scanHistory: [
    {
      id: 1,
      date: "2023-06-01",
      measurements: {
        height: 180,
        weight: 80,
        chestSize: 100,
        waistSize: 85,
        armSize: 35,
        legSize: 55
      }
    },
    {
      id: 2,
      date: "2023-07-01",
      measurements: {
        height: 180,
        weight: 78,
        chestSize: 102,
        waistSize: 83,
        armSize: 37,
        legSize: 56
      }
    },
    {
      id: 3,
      date: "2023-08-01",
      measurements: {
        height: 180,
        weight: 77,
        chestSize: 103,
        waistSize: 81,
        armSize: 38,
        legSize: 58
      }
    },
  ],
  loading: false,
  error: null
};

export const avatarSlice = createSlice({
  name: "avatar",
  initialState,
  reducers: {
    setCustomizations: (state, action: PayloadAction<AvatarCustomization[]>) => {
      state.customizations = action.payload;
    },
    addCustomization: (state, action: PayloadAction<AvatarCustomization>) => {
      state.customizations.push(action.payload);
    },
    updateCustomization: (state, action: PayloadAction<{id: number, customization: Partial<AvatarCustomization>}>) => {
      const { id, customization } = action.payload;
      const index = state.customizations.findIndex(c => c.id === id);
      if (index !== -1) {
        state.customizations[index] = { ...state.customizations[index], ...customization };
      }
    },
    deleteCustomization: (state, action: PayloadAction<number>) => {
      state.customizations = state.customizations.filter(c => c.id !== action.payload);
    },
    setScanHistory: (state, action: PayloadAction<AvatarState["scanHistory"]>) => {
      state.scanHistory = action.payload;
    },
    addScan: (state, action: PayloadAction<AvatarState["scanHistory"][0]>) => {
      state.scanHistory.push(action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    }
  }
});

export const {
  setCustomizations,
  addCustomization,
  updateCustomization,
  deleteCustomization,
  setScanHistory,
  addScan,
  setLoading,
  setError
} = avatarSlice.actions;

export default avatarSlice.reducer;