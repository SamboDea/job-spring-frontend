import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { authClient } from "@/src/lib/auth-client";
import { User } from "./slice";
import { updateProfile, reqUploadUserAvatar } from "./request";
import { updateUser, setUser, setAvatarUploading } from "./slice";
import { useAppSelector } from "@/src/redux/hooks";

const AVATAR_URL_PREFIX = "/uploads/avatars/";

function isOwnAvatarUrl(url?: string | null): url is string {
    return !!url && url.startsWith(AVATAR_URL_PREFIX);
}

const useUser = () => {
    const dispatch = useDispatch();
    const { data: session, isPending } = authClient.useSession();

    const { user, avatarUploading } = useAppSelector((state) => state.user);

    // Keep Redux `user` in sync with the session. Runs in every
    // component that calls useUser(), but only actually dispatches
    // when the session value changes — cheap and safe to repeat.
    useEffect(() => {
        if (isPending) return;

        dispatch(
            setUser(
                session?.user
                    ? {
                        id: session.user.id,
                        name: session.user.name ?? null,
                        email: session.user.email ?? null,
                        image: session.user.image ?? null,
                    }
                    : null
            )
        );
    }, [session?.user, isPending, dispatch]);

    const handleUpdateProfile = async (payload: User) => {
        const response = await updateProfile(payload);

        dispatch(
            updateUser({
                image: response.image,
                name: response.name,
                email: response.email,
            })
        );
    };

    const uploadAvatar = async (file: File) => {
        dispatch(setAvatarUploading(true));

        try {
            const formData = new FormData();
            formData.append("avatar", file);

            if (isOwnAvatarUrl(user?.image)) {
                formData.append("oldUrl", user!.image!);
            }

            const res = await reqUploadUserAvatar(formData);
            dispatch(updateUser({ image: res.url }));

            return res.url;
        } catch (error) {
            console.error("Failed to upload avatar", error);
            throw error;
        } finally {
            dispatch(setAvatarUploading(false));
        }
    };

    return { user, avatarUploading, handleUpdateProfile, uploadAvatar };
};

export default useUser;