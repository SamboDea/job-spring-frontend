import { useDispatch } from "react-redux";
import { useAppSelector } from "@/src/redux/hooks";
import {
    reqCreateWorkExperience,
    reqCreateWorkExperiences,
    reqGetWorkExperiences,
    reqGetWorkExperienceById,
    reqGetWorkExperiencesByCandidateId,
    reqUpdateWorkExperience,
    reqDeleteWorkExperience,
} from "./request";
import {
    setList,
    setCurrent,
    setLoading,
    addToList,
    removeFromList,
    updateInList,
} from "./slice";
import { WorkExperiencePayload } from "./types";
import Swal from "sweetalert2";

const useWorkExperience = () => {
    const dispatch = useDispatch();
    const { list, current, loading } = useAppSelector(
        (state) => state.workExperience
    );

    const createWorkExperience = (payload: WorkExperiencePayload) => {
        dispatch(setLoading(true));
        return reqCreateWorkExperience(payload)
            .then((res) => {
                dispatch(addToList(res.data));
                return res.data;
            })
            .catch((error) => {
                Swal.fire({
                    title: "Failed to create work experience",
                    text: error,
                    icon: "error",
                });
                throw error;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const createWorkExperiences = (payloads: WorkExperiencePayload[]) => {
        dispatch(setLoading(true));
        return reqCreateWorkExperiences(payloads)
            .then((res) => {
                res.data.forEach((item) => dispatch(addToList(item)));
                return res.data;
            })
            .catch((error) => {
                Swal.fire({
                    title: "Failed to create work experience",
                    text: error,
                    icon: "error",
                });
                throw error;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const getWorkExperiences = () => {
        dispatch(setLoading(true));
        return reqGetWorkExperiences()
            .then((res) => {
                dispatch(setList(res.data));
                return res.data;
            })
            .catch((error) => {
                Swal.fire({
                    title: "Failed to get work experience",
                    text: error,
                    icon: "error",
                });
                throw error;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const getWorkExperienceById = (id: number) => {
        dispatch(setLoading(true));
        return reqGetWorkExperienceById(id)
            .then((res) => {
                dispatch(setCurrent(res.data));
                return res.data;
            })
            .catch((error) => {
                Swal.fire({
                    title: "Failed to get work experience",
                    text: error,
                    icon: "error",
                });
                throw error;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const getWorkExperiencesByCandidateId = (candidateId: number) => {
        dispatch(setLoading(true));
        return reqGetWorkExperiencesByCandidateId(candidateId)
            .then((res) => {
                dispatch(setList(res.data));
                return res.data;
            })
            .catch((error) => {
                Swal.fire({
                    title: "Failed to get work experience",
                    text: error,
                    icon: "error",
                });
                throw error;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const updateWorkExperience = (
        id: number,
        payload: Partial<WorkExperiencePayload>
    ) => {
        dispatch(setLoading(true));
        return reqUpdateWorkExperience(id, payload)
            .then((res) => {
                dispatch(updateInList(res.data));
                return res.data;
            })
            .catch((error) => {
                Swal.fire({
                    title: "Failed to update work experience",
                    text: error,
                    icon: "error",
                });
                throw error;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const deleteWorkExperience = (id: number) => {
        dispatch(setLoading(true));
        return reqDeleteWorkExperience(id)
            .then(() => {
                dispatch(removeFromList(id));
            })
            .catch((error) => {
                Swal.fire({
                    title: "Failed to delete work experience",
                    text: error,
                    icon: "error",
                });
                throw error;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return {
        list,
        current,
        loading,
        createWorkExperience,
        createWorkExperiences,
        getWorkExperiences,
        getWorkExperienceById,
        getWorkExperiencesByCandidateId,
        updateWorkExperience,
        deleteWorkExperience,
    };
};

export default useWorkExperience;