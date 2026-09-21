import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Candidate {
    candidateId?: number;
    gender?: string | null;
    contactNumber?: string | null;
    dateOfBirth?: string | null;
    country?: string | null;
    city?: string | null;
    jobTitle?: string | null;
    jobLevelId?: number | null;
    jobLevelName?: string | null;
    industry?: string | null;
    githubUsername?: string | null;
    linkedinUsername?: string | null;
    portfolio?: string | null;
    description?: string | null;
    address?: string | null;
    userId?: string;
}

interface CandidateState {
    list: Candidate[];
    loading: boolean;
}

const initialState: CandidateState = {
    list: [],
    loading: false,
};

const candidateSlice = createSlice({
    name: "candidate",
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<Candidate[]>) => {
            state.list = action.payload;
            state.loading = false;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    }
});

export const { setList, setLoading } = candidateSlice.actions;
export default candidateSlice.reducer;
