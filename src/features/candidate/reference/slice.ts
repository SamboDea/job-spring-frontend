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
            state.list = Array.isArray(action.payload) ? action.payload : [];
        },
        addReference: (state, action: PayloadAction<ReferenceResponse>) => {
            state.list.push(action.payload);
        },
        updateReferenceInList: (state, action: PayloadAction<ReferenceResponse>) => {
            const i = state.list.findIndex(
                (r) => r.referenceId === action.payload.referenceId
            );
            if (i !== -1) state.list[i] = action.payload;
        },
        removeReference: (state, action: PayloadAction<number>) => {
            state.list = state.list.filter((r) => r.referenceId !== action.payload);
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const {
    setList,
    addReference,
    updateReferenceInList,
    removeReference,
    setLoading,
} = referenceSlice.actions;

export default referenceSlice.reducer;