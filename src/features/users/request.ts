import axios from "axios";
import { User } from "./slice";

export const updateProfile = async (payload: User) => {
    const response = await axios.put<User>("/profile", payload);

    return response.data;
};

export const reqUploadUserAvatar = async (formData: FormData) => {
    const oldUrl = formData.get("oldUrl") as string | null;
    const method = oldUrl ? "PATCH" : "POST";

    const response = await fetch("/api/upload/", {
        method,
        body: formData,
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({
            error: "Upload failed",
        }));
        throw new Error(data.error || "Upload failed");
    }

    return response.json();
};