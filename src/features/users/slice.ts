import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}

interface UserState {
    user: User | null;
    avatarUploading: boolean;
}

const initialState: UserState = {
    user: null,
    avatarUploading: false,
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User | null>) => {
            state.user = action.payload;
        },

        updateUser: (state, action: PayloadAction<Partial<User>>) => {
            if (state.user) {
                state.user = {
                    ...state.user,
                    ...action.payload,
                };
            }
        },

        setAvatarUploading: (state, action: PayloadAction<boolean>) => {
            state.avatarUploading = action.payload;
        },
    },
});

export const { setUser, updateUser, setAvatarUploading } = userSlice.actions;

export default userSlice.reducer;