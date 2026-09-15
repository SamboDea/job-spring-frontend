import Swal, { SweetAlertOptions, SweetAlertResult } from "sweetalert2";
import Logo from "@/public/logo/logo.png";

const BRAND_CYAN = "#07c4ec";
const BRAND_GREEN = "#71dd37";
const BRAND_RED = "#ef4444";

// Shared visual identity for every popup: logo instead of SweetAlert's
// default icon, rounded corners, brand-colored buttons.
// No explicit SweetAlertOptions annotation here — that type is a big
// discriminated union keyed off `input`, and annotating a partial config
// with it makes TS try to match the *whole* merged object against one
// narrowed union branch later, which breaks. `satisfies` checks shape
// without collapsing the inferred type.
const baseConfig = {
    imageUrl: Logo.src,
    imageWidth: 140,
    imageHeight: 42,
    imageAlt: "JobSpring",
    confirmButtonColor: BRAND_CYAN,
    cancelButtonColor: "#6b7280",
    buttonsStyling: false,
    reverseButtons: true,
    customClass: {
        popup: "js-swal-popup",
        title: "js-swal-title",
        htmlContainer: "js-swal-text",
        confirmButton: "js-swal-confirm",
        cancelButton: "js-swal-cancel",
        image: "js-swal-logo",
    },
} satisfies SweetAlertOptions;

/**
 * Success modal — logo header, single "OK" button.
 * successAlert("Profile updated", "Your changes have been saved.")
 */
export function successAlert(
    title: string,
    text?: string,
    options: SweetAlertOptions = {}
): Promise<SweetAlertResult> {
    return Swal.fire({
        ...baseConfig,
        title,
        text,
        confirmButtonText: "OK",
        confirmButtonColor: BRAND_GREEN,
        timer: 2500,
        timerProgressBar: true,
        customClass: {
            ...baseConfig.customClass,
            popup: "js-swal-popup js-swal-popup-success",
        },
        ...options,
    } as SweetAlertOptions);
}

/**
 * Error modal — logo header, single "OK" button, red accent.
 * errorAlert("Upload failed", "The image must be under 5MB.")
 */
export function errorAlert(
    title: string,
    text?: string,
    options: SweetAlertOptions = {}
): Promise<SweetAlertResult> {
    return Swal.fire({
        ...baseConfig,
        title,
        text,
        confirmButtonText: "OK",
        confirmButtonColor: BRAND_RED,
        timer: 2500,
        timerProgressBar: true,
        customClass: {
            ...baseConfig.customClass,
            popup: "js-swal-popup js-swal-popup-error",
        },
        ...options,
    } as SweetAlertOptions);
}

/**
 * Confirm modal — logo header, Confirm/Cancel buttons.
 * Resolves result.isConfirmed === true only if the user confirmed.
 *
 * const result = await confirmAlert("Remove photo?", "This can't be undone.");
 * if (result.isConfirmed) { ... }
 */
export function confirmAlert(
    title: string,
    text?: string,
    options: SweetAlertOptions = {}
): Promise<SweetAlertResult> {
    return Swal.fire({
        ...baseConfig,
        title,
        text,
        showCancelButton: true,
        confirmButtonText: "Confirm",
        cancelButtonText: "Cancel",
        ...options,
    } as SweetAlertOptions);
}

/** Convenience wrapper for the common "delete" confirm variant (red confirm button). */
export function confirmDeleteAlert(
    title: string,
    text?: string,
    options: SweetAlertOptions = {}
): Promise<SweetAlertResult> {
    return confirmAlert(title, text, {
        confirmButtonText: "Yes, delete it",
        confirmButtonColor: BRAND_RED,
        ...options,
    });
}