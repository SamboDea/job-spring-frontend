import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Education } from "@/src/features/candidate/education/types";

interface EducationState {
    list: Education[];
    loading: boolean;
}

const initialState: EducationState = {
    list: [],
    loading: false,
};

const educationSlice = createSlice({
    name: "education",
    initialState,
    reducers: {
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
        setEducationList: (state, action: PayloadAction<Education[]>) => {
            state.list = action.payload;
        },
        addEducation: (state, action: PayloadAction<Education>) => {
            state.list.push(action.payload);
        },
        updateEducationInList: (state, action: PayloadAction<Education>) => {
            const idx = state.list.findIndex((e) => e.educationId === action.payload.educationId);
            if (idx !== -1) state.list[idx] = action.payload;
        },
        removeEducationFromList: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter((e) => e.educationId !== action.payload);
        },
    },
});

export const {
    setLoading,
    setEducationList,
    addEducation,
    updateEducationInList,
    removeEducationFromList,
} = educationSlice.actions;

export default educationSlice.reducer;