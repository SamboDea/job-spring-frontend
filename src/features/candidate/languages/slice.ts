import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LanguageResponse } from "./types"

interface LanguageState {
    list: LanguageResponse[]
    current: LanguageResponse | null
    loading: boolean
}

const initialState: LanguageState = {
    list: [],
    current: null,
    loading: false,
}

const languageSlice = createSlice({
    name: "language",
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<LanguageResponse[]>) => {
            state.list = action.payload
        },
        setCurrent: (state, action: PayloadAction<LanguageResponse>) => {
            state.current = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        },
    },
})

export const { setList, setCurrent, setLoading } = languageSlice.actions
export default languageSlice.reducer