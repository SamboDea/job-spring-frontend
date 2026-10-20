import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setList, addSkill, updateInList, setLoading, setError, setCandidateSkills } from "./slice"
import { reqCreateSkill, reqDeleteCandidateSkill, reqDeleteSkill, reqGetCandidateSkills, reqGetSkillById, reqGetSkills, reqUpdateCandidateSkill } from "./request";
import Swal from "sweetalert2";
import { SkillPayload, SkillRes } from "./types";

const useSkill = () => {
    const dispatch = useAppDispatch();
    const { list, loading, error, candidateSkills } = useAppSelector((state) => state.skill);

    const getSkills = () => {
        dispatch(setLoading(true));
        reqGetSkills()
            .then((res) => {
                dispatch(setList(res.data));
            })
            .catch((error) => {
                dispatch(setError(error.response.data.message));
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }

    const createSkill = (skill: SkillPayload): Promise<SkillRes | undefined> => {
        dispatch(setLoading(true));
        return reqCreateSkill(skill)
            .then((res) => {
                dispatch(addSkill(res.data));
                return res.data;
            })
            .catch((error) => {
                dispatch(setError(error.response.data.message));
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                });
                return undefined;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }

    const getSkillById = (skillid: number) => {
        dispatch(setLoading(true));
        reqGetSkillById(skillid.toString())
            .then((res) => {
                dispatch(updateInList(res.data));
            }).catch((error) => {
                dispatch(setError(error.response.data.message));
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                });
            }).finally(() => {
                dispatch(setLoading(false));
            })
    }

    const getCandidateSkills = (candidateId: number) => {
        dispatch(setLoading(true));
        reqGetCandidateSkills(candidateId.toString())
            .then((res) => {
                dispatch(setCandidateSkills(res.data));
            })
            .catch((error) => {
                dispatch(setError(error.response.data.message));
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                });
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }


    const updateSkill = (candidateId: number, skillId: number, skill: SkillPayload): Promise<SkillRes | undefined> => {
        dispatch(setLoading(true));
        return reqUpdateCandidateSkill(candidateId.toString(), skillId.toString(), skill)
            .then((res) => {
                dispatch(updateInList(res.data));
                return res.data;
            })
            .catch((error) => {
                dispatch(setError(error.response.data.message));
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                });
                return undefined;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    }

    const deleteSkill = (skillId: number) => {
        dispatch(setLoading(true))
        return reqDeleteSkill(skillId.toString())
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                dispatch(setError(error.response.data.message));
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                });
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const deleteCandidateSkill = (candidateId: number, skillId: number) => {
        dispatch(setLoading(true))
        return reqDeleteCandidateSkill(candidateId.toString(), skillId.toString())
            .then((res) => {
                return res.data
            })
            .catch((error) => {
                dispatch(setError(error.response.data.message));
                Swal.fire({
                    title: "Error",
                    text: error.response.data.message,
                    icon: "error",
                });
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    return {
        list,
        candidateSkills,
        loading,
        error,

        getSkills,
        createSkill,
        getSkillById,
        updateSkill,
        deleteSkill,
        deleteCandidateSkill,
        getCandidateSkills,
    }
}

export default useSkill;