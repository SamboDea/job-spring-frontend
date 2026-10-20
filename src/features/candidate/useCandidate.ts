import {
    reqCreateCandidate,
    reqDeleteCandidate,
    reqGetCandidateByUserId,
    reqGetCandidates,
    reqUpdateCandidate,
} from "@/src/features/candidate/request";

import {
    setList,
    setLoading,
    setCurrent
} from "@/src/features/candidate/slice";

import {
    useAppDispatch,
    useAppSelector,
} from "@/src/redux/hooks";
import axios from "axios";
import Swal from "sweetalert2";

const useCandidate = () => {
    const dispatch = useAppDispatch();

    const {
        current,
        list,
        loading,
    } = useAppSelector((state) => state.candidate);

    const getCandidate = () => {
        dispatch(setLoading(true));
        return reqGetCandidates()
            .then((res) => {
                dispatch(setList(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to fetch candidates", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch candidates",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const getCandidateByUserId = (id: string) => {
        dispatch(setLoading(true));
        return reqGetCandidateByUserId({ id })
            .then((res) => {
                dispatch(setCurrent(res.data));
                return res.data;
            })
            .catch((err) => {
                if (axios.isAxiosError(err) && err.response?.status === 404) {
                    dispatch(setCurrent(null));
                    return null;
                }
                console.error("Failed to fetch candidate by userId", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to fetch candidate by userId",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const createCandidate = (payload: any) => {
        dispatch(setLoading(true));
        return reqCreateCandidate(payload)
            .then((res) => {
                dispatch(setCurrent(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error(
                    "Failed to create candidate",
                    err
                );
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to create candidate",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const updateCandidate = (
        id: number,
        payload: any
    ) => {
        dispatch(setLoading(true));
        return reqUpdateCandidate(id, payload)
            .then((res) => {
                dispatch(setCurrent(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error(
                    "Failed to update candidate",
                    err
                );
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to update candidate",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    const deleteCandidate = (id: number) => {
        dispatch(setLoading(true));
        return reqDeleteCandidate(id)
            .then(() => {
                dispatch(setCurrent(null));
            })
            .catch((err) => {
                console.error(
                    "Failed to delete candidate",
                    err
                );
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to delete candidate",
                });
                throw err;
            })
            .finally(() => {
                dispatch(setLoading(false));
            });
    };

    return {
        getCandidate,
        getCandidateByUserId,
        createCandidate,
        updateCandidate,
        deleteCandidate,
        current,
        list,
        loading,
    };
};

export default useCandidate;