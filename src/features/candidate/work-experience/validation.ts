import * as Yup from "yup";


export const validationSchema = Yup.object({
    jobTitle: Yup.string().required("Job title is required"),
    companyName: Yup.string().required("Company name is required"),
    country: Yup.string().nullable(),
    city: Yup.string().nullable(),
    startDate: Yup.string().required("Start date is required"),
    isCurrent: Yup.boolean().default(false),
    endDate: Yup.string()
        .nullable()
        .when("isCurrent", {
            is: false,
            then: (schema) => schema.required("End date is required"),
        }),
    jobResponsibility: Yup.string().nullable(),
});