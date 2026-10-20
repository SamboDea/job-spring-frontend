import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface Candidate {
    candidateId?: number;
    userId?: string;
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
    isDeleted?: boolean;
    createdAt?: string;
}

interface CandidateState {
    list: Candidate[];
    current: Candidate | null;
    loading: boolean;
}

const initialState: CandidateState = {
    list: [],
    current: null,
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
        setCurrent: (state, action: PayloadAction<Candidate | null>) => {
            state.current = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setList, setCurrent, setLoading } = candidateSlice.actions;
export default candidateSlice.reducer;