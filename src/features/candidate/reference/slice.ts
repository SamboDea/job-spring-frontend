import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ReferenceResponse } from "./types";

interface ReferenceState {
    list: ReferenceResponse[];
    loading: boolean;
}

const initialState: ReferenceState = {
    list: [],
    loading: false,
};

const referenceSlice = createSlice({
    name: "reference",
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<ReferenceResponse[]>) => {
            state.list = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        }
    },
});

export const { setList, setLoading } = referenceSlice.actions;

export default referenceSlice.reducer;