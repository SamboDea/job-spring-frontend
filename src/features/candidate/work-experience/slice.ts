import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WorkExperience } from "./types";

interface WorkExperienceState {
    list: WorkExperience[];
    current: WorkExperience | null;
    loading: boolean;
}

const initialState: WorkExperienceState = {
    list: [],
    current: null,
    loading: false,
};

const workExperienceSlice = createSlice({
    name: "work-experience",
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<WorkExperience[]>) => {
            state.list = action.payload;
            state.loading = false;
        },
        setCurrent: (state, action: PayloadAction<WorkExperience | null>) => {
            state.current = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        addToList: (state, action: PayloadAction<WorkExperience>) => {
            state.list.push(action.payload);
        },
        removeFromList: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter(
                (item) => item.workExperienceId !== action.payload
            );
        },
        updateInList: (state, action: PayloadAction<WorkExperience>) => {
            const index = state.list.findIndex(
                (item) => item.workExperienceId === action.payload.workExperienceId
            );
            if (index !== -1) state.list[index] = action.payload;
        },
    },
});

export const {
    setList,
    setCurrent,
    setLoading,
    addToList,
    removeFromList,
    updateInList,
} = workExperienceSlice.actions;

export default workExperienceSlice.reducer;