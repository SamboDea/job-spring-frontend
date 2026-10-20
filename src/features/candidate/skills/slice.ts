import { createSlice } from "@reduxjs/toolkit";
import { SkillRes } from "./types";

interface SkillState {
    list: SkillRes[];
    candidateSkills: SkillRes[];
    loading: boolean;
    error: string | null;
}

const initialState: SkillState = {
    list: [],
    candidateSkills: [],
    loading: false,
    error: null,
}

const skillSlice = createSlice({
    name: "skillSection",
    initialState,
    reducers: {
        setList: (state, action) => {
            state.list = action.payload;
        },
        setCandidateSkills: (state, action) => {
            state.candidateSkills = action.payload;
        },
        addSkill: (state, action) => {
            state.list.push(action.payload);
        },
        updateInList: (state, action) => {
            const index = state.list.findIndex((s) => s.skillId === action.payload.skillId);
            if (index !== -1) {
                state.list[index] = action.payload;
            }
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setList, setCandidateSkills, addSkill, updateInList, setLoading, setError } = skillSlice.actions;
export default skillSlice.reducer;