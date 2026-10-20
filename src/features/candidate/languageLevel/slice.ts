import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { LanguageLevelResponse } from "./types"

interface LanguageLevelState {
    list: LanguageLevelResponse[]
    current: LanguageLevelResponse | null
    loading: boolean
}

const initialState: LanguageLevelState = {
    list: [],
    current: null,
    loading: false,
}

const languageLevelSlice = createSlice({
    name: "languageLevel",
    initialState,
    reducers: {
        setList: (state, action: PayloadAction<LanguageLevelResponse[]>) => {
            state.list = action.payload
        },
        setCurrent: (state, action: PayloadAction<LanguageLevelResponse>) => {
            state.current = action.payload
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.loading = action.payload
        }
    }
})

export const { setList, setCurrent, setLoading } = languageLevelSlice.actions
export default languageLevelSlice.reducer