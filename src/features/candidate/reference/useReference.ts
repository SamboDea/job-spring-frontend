import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { reqCreateReference, reqDeleteReference, reqGetAllReference, reqGetReferenceByCandidateId, reqGetReferenceById, reqUpdateReference } from "./request";
import { setLoading, setList } from "./slice";
import Swal from "sweetalert2";
import { ReferencePayload } from "./types";

const useReference = () => {
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector((state) => state.reference);

    const getReference = () => {
        dispatch(setLoading(true));
        return reqGetAllReference()
            .then((res) => {
                dispatch(setList(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to get all reference", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const getReferenceByCandidateId = (candidateId: number) => {
        dispatch(setLoading(true));
        return reqGetReferenceByCandidateId(candidateId)
            .then((res) => {
                dispatch(setList(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to get reference by candidate id", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const getReferenceById = (referenceId: number) => {
        dispatch(setLoading(true));
        return reqGetReferenceById(referenceId)
            .then((res) => {
                dispatch(setList(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to get reference by id", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const createReference = (candidateId: number, payload: ReferencePayload) => {
        dispatch(setLoading(true));
        return reqCreateReference(candidateId, payload)
            .then((res) => {
                dispatch(setList(res.data));
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to create reference", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const updateReference = (referenceId: number, payload: ReferencePayload) => {
        dispatch(setLoading(true));
        return reqUpdateReference(referenceId, payload)
            .then((res) => {
                res.data;
            })
            .catch((err) => {
                console.error("Failed to update reference", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    const deleteReference = (referenceId: number) => {
        dispatch(setLoading(true));
        return reqDeleteReference(referenceId)
            .then((res) => {
                res.data;
            })
            .catch((err) => {
                console.error("Failed to delete reference", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false));
            })
    }

    return {
        list,
        loading,
        getReference,
        getReferenceByCandidateId,
        getReferenceById,
        createReference,
        updateReference,
        deleteReference
    }


}

export default useReference