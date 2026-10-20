import * as Yup from "yup";

export const validationSchema = Yup.object().shape({
    institution: Yup.string()
        .trim()
        .required("Institution is required")
        .max(150, "Institution name is too long"),

    educationLevel: Yup.string()
        .required("Education level is required"),

    majorName: Yup.string()
        .trim()
        .required("Major is required")
        .max(150, "Major name is too long"),

    country: Yup.string().nullable().required("Country is required"),

    city: Yup.string().nullable().required("City is required"),

    startDate: Yup.date()
        .typeError("Start date is invalid")
        .required("Start date is required"),

    isCurrent: Yup.boolean().default(false),

    endDate: Yup.date()
        .typeError("End date is invalid")
        .nullable()
        .when("isCurrent", {
            is: true,
            then: (schema) => schema.notRequired().nullable(),
            otherwise: (schema) =>
                schema
                    .required("End date is required")
                    .min(Yup.ref("startDate"), "End date cannot be before start date"),
        }),
});