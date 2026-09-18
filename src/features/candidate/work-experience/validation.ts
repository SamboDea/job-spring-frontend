import * as Yup from "yup";


export const workExperienceValidationSchema = Yup.object({
    workExperience: Yup.array().of(
        Yup.object({
            companyName: Yup.string().required("Company name is required"),
            jobTitle: Yup.string().required("Position is required"),
            startDate: Yup.date().required("Start date is required"),
            endDate: Yup.date().when("isCurrent", {
                is: false,
                then: (schema) => schema.required("End date is required"),
                otherwise: (schema) => schema.nullable(),
            }),
            isCurrent: Yup.boolean(),
            country: Yup.string().nullable(),
            jobResponsibility: Yup.string(),
        })
    ),
});