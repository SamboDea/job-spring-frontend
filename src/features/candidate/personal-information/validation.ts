import * as Yup from "yup";

export const personalInfoValidationSchema = Yup.object({
    name: Yup.string().required("Full name is required"),
    gender: Yup.string().required("Gender is required"),
    contactNumber: Yup.string().required("Phone number is required"),
    // email: Yup.string().email("Invalid email address").required("Email is required"),
    dateOfBirth: Yup.date().required("Date of birth is required"),
    country: Yup.string().required("Country is required"),
    city: Yup.string().required("City is required"),
    industry: Yup.string().required("Industry is required"),
    address: Yup.string().required("Address is required"),
});

