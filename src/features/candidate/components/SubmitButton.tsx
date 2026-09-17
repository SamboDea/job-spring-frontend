"use client";

import AppButton from "@/src/components/common/AppButton";
import { useFormikContext } from "formik";

export function SubmitButton() {
    const { isSubmitting } = useFormikContext();

    return (
        <AppButton loading={isSubmitting} loadingText="Saving..." sx={{ height: 40, fontSize: "14px" }}>
            Save Changes
        </AppButton>
    );
}