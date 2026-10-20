import Swal from "sweetalert2";
import {
    reqGetEducationLevels,
    reqGetEducationLevelById,
    reqCreateEducationLevel,
    reqUpdateEducationLevel,
    reqDeleteEducationLevel,
} from "./request";
import {
    setLoading,
    setEducationLevelList,
    setCurrentEducationLevel,
    addEducationLevel,
    updateEducationLevelInList,
    removeEducationLevelFromList,
} from "@/src/features/candidate/educattion-level/slice";

import { EducationLevelPayload } from "@/src/features/candidate/educattion-level/types";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";

export default function useEducationLevel() {
    const dispatch = useAppDispatch();
    const { list, current, loading } = useAppSelector((state) => state.educationLevel)

    const getEducationLevels = () => {
        dispatch(setLoading(true));

        return reqGetEducationLevels()
            .then((res) => {
                dispatch(setEducationLevelList(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to fetch education levels", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch education levels",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const getEducationLevelById = (educationLevelId: number) => {
        dispatch(setLoading(true));

        return reqGetEducationLevelById({ educationLevelId })
            .then((res) => {
                dispatch(setCurrentEducationLevel(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to fetch education level", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch education level",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const createEducationLevel = (data: EducationLevelPayload) => {
        dispatch(setLoading(true));

        return reqCreateEducationLevel(data)
            .then((res) => {
                dispatch(addEducationLevel(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to create education level", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to create education level",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const updateEducationLevel = (educationLevelId: number, data: EducationLevelPayload) => {
        dispatch(setLoading(true));

        return reqUpdateEducationLevel({ educationLevelId, data })
            .then((res) => {
                dispatch(updateEducationLevelInList(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to update education level", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update education level",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const deleteEducationLevel = (educationLevelId: number) => {
        dispatch(setLoading(true));

        return reqDeleteEducationLevel({ educationLevelId })
            .then(() => {
                dispatch(removeEducationLevelFromList(educationLevelId));
            })
            .catch((err) => {
                console.error("Failed to delete education level", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete education level",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };
    return {
        list,
        current,
        loading,
        getEducationLevels,
        getEducationLevelById,
        createEducationLevel,
        updateEducationLevel,
        deleteEducationLevel,
    };
}