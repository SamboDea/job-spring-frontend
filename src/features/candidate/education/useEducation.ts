import Swal from "sweetalert2";
import axios from "axios";
import {
    reqGetEducationsByCandidateId,
    reqCreateEducation,
    reqUpdateEducation,
    reqDeleteEducation,
} from "./request";
import {
    setLoading,
    setEducationList,
    addEducation,
    updateEducationInList,
    removeEducationFromList,
} from "./slice";
import { EducationPayload } from "@/src/features/candidate/education/types";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";

export default function useEducation() {
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector((state) => state.education);

    const getEducationsByCandidateId = (candidateId: number) => {
        dispatch(setLoading(true));

        return reqGetEducationsByCandidateId({ candidateId })
            .then((res) => {
                dispatch(setEducationList(res.data));
                return res.data;
            })
            .catch((err) => {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    dispatch(setEducationList([]));
                    return [];
                }
                console.error("Failed to fetch educations by candidateId", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch education records",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const createEducation = (data: EducationPayload) => {
        dispatch(setLoading(true));

        return reqCreateEducation(data)
            .then((res) => {
                dispatch(addEducation(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to create education", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `${err.response?.data?.message || "Failed to create education"}`,
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const updateEducation = (id: number, data: EducationPayload) => {
        dispatch(setLoading(true));

        return reqUpdateEducation({ id, data })
            .then((res) => {
                dispatch(updateEducationInList(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to update education", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `${err.response?.data?.message || "Failed to update education"}`,
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const deleteEducation = (id: number) => {
        dispatch(setLoading(true));

        return reqDeleteEducation({ id })
            .then(() => {
                dispatch(removeEducationFromList(id));
            })
            .catch((err) => {
                console.error("Failed to delete education", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete education record",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return {
        list,
        loading,
        getEducationsByCandidateId,
        createEducation,
        updateEducation,
        deleteEducation,
    };
}