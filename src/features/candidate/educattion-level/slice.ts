import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { EducationLevel } from "@/src/features/candidate/educattion-level/types";

interface EducationLevelState {
    list: EducationLevel[];
    current: EducationLevel | null;
    loading: boolean;
}

const initialState: EducationLevelState = {
    list: [],
    current: null,
    loading: false,
};

const educationLevelSlice = createSlice({
    name: "educationLevel",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setEducationLevelList: (state, action: PayloadAction<EducationLevel[]>) => {
            state.list = action.payload;
        },
        setCurrentEducationLevel: (state, action: PayloadAction<EducationLevel | null>) => {
            state.current = action.payload;
        },
        addEducationLevel: (state, action: PayloadAction<EducationLevel>) => {
            state.list.push(action.payload);
        },
        updateEducationLevelInList: (state, action: PayloadAction<EducationLevel>) => {
            const idx = state.list.findIndex((e) => e.educationLevelId === action.payload.educationLevelId);
            if (idx !== -1) state.list[idx] = action.payload;
        },
        removeEducationLevelFromList: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter((e) => e.educationLevelId !== action.payload);
        },
    },
});

export const {
    setLoading,
    setEducationLevelList,
    setCurrentEducationLevel,
    addEducationLevel,
    updateEducationLevelInList,
    removeEducationLevelFromList,
} = educationLevelSlice.actions;

export default educationLevelSlice.reducer;