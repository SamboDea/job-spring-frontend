import { createSlice } from "@reduxjs/toolkit";
import { MajorRes } from "./types";

interface MajorState {
    list: MajorRes[];
    loading: boolean;
}

const initialState = {
    list: [],
    loading: false,
} as MajorState;

export const majorSlice = createSlice({
    name: "major",
    initialState,
    reducers: {
        setList: (state, action) => {
            state.list = action.payload;
        },
    }
})

export const { setList } = majorSlice.actions;
export default majorSlice.reducer;