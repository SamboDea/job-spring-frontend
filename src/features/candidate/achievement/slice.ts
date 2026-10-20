import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { AchievementRes } from "./types";

interface AchievementState {
    list: AchievementRes[]
    loading: boolean
}

const initialState: AchievementState = {
    list: [],
    loading: false
}

const achievementSlice = createSlice({
    name: "achievement",
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<AchievementRes[]>) => {
            state.list = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        }
    },
})

export const { setList, setLoading } = achievementSlice.actions
export default achievementSlice.reducer