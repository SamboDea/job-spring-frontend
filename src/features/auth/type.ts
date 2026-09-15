export interface LoginValues {
    email: string;
    password: string;
}

export interface RegisterValues {
    name: string;
    email: string;
    password: string;
    role: "candidate" | "company";
}

export interface ForgotPasswordValues {
    email: string;
}

export interface ChangePasswordValues {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
}

export interface ResetPasswordValues {
    newPassword: string;
    confirmPassword: string;
}