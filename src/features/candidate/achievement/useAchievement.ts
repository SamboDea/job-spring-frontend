import { useAppDispatch, useAppSelector } from "@/src/redux/hooks"
import { setList, setLoading } from "./slice";
import { reqCreateCandidateAchievement, reqDeleteCandidateAchievement, reqGetAchievementByCandidateId, reqGetAchievementById, reqGetAchievements, reqUpdateCandidateAchievement } from "./request";
import Swal from "sweetalert2";
import { AchievementRes } from "./types";

const useAcheivement = () => {
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector((state) => state.achievement);

    const getAchievement = () => {
        dispatch(setLoading(true));
        return reqGetAchievements()
            .then((res) => {
                dispatch(setList(res.data));
            })
            .catch((err) => {
                Swal.fire({ title: "Error", text: "Failed to fetch achievements", icon: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const getAchievementById = (id: number) => {
        dispatch(setLoading(true));
        return reqGetAchievementById(id.toString())
            .then((res) => {
                dispatch(setList([res.data]));
                return res.data
            })
            .catch((err) => {
                Swal.fire({ title: "Error", text: "Failed to fetch achievement", icon: "error" });
                throw err
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const getAchievementByCandidateId = (candidateId: number) => {
        dispatch(setLoading(true));
        return reqGetAchievementByCandidateId(candidateId.toString())
            .then((res) => {
                dispatch(setList(res.data));
            })
            .catch((err) => {
                Swal.fire({ title: "Error", text: "Failed to fetch achievement", icon: "error" });
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const createAchievement = (payload: AchievementRes) => {
        dispatch(setLoading(true));
        return reqCreateCandidateAchievement(payload)
            .then((res) => {
                dispatch(setList([...list, res.data]));
                return res.data
            })
            .catch((err) => {
                Swal.fire({ title: "Error", text: "Failed to create achievement", icon: "error" });
                throw err
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const updateAchievement = (achievementId: number, payload: AchievementRes) => {
        dispatch(setLoading(true));
        return reqUpdateCandidateAchievement(achievementId.toString(), payload)
            .then((res) => {
                dispatch(setList(list.map((a) => (a.achievementId === achievementId ? res.data : a))));
                return res.data
            })
            .catch((err) => {
                Swal.fire({ title: "Error", text: "Failed to update achievement", icon: "error" });
                throw err
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const deleteAchievement = (id: number) => {
        dispatch(setLoading(true));
        return reqDeleteCandidateAchievement(id.toString())
            .then((res) => {
                dispatch(setList(list.filter((a) => a.achievementId !== id)));
                return res.data
            })
            .catch((err) => {
                Swal.fire({ title: "Error", text: "Failed to delete achievement", icon: "error" });
                throw err
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    return {
        list,
        loading,
        getAchievement,
        getAchievementById,
        getAchievementByCandidateId,
        createAchievement,
        updateAchievement,
        deleteAchievement,
    };
}

export default useAcheivement;