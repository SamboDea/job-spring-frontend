import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CountryResponse, CountryState } from "./types";

const initialState: CountryState = {
    list: [],
    loading: false,
};

const countrySlice = createSlice({
    name: "country",
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<CountryResponse[]>) => {
            state.list = action.payload;
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload;
        },
    },
});

export const { setList, setLoading } = countrySlice.actions;
export default countrySlice.reducer;