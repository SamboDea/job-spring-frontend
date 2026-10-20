import { useAppDispatch, useAppSelector } from "@/src/redux/hooks"
import {
    reqGetLanguageByCandidateId,
    reqCreateLanguage,
    reqCreateLanguages,
    reqUpdateLanguage,
    reqDeleteLanguage,
} from "./request"
import { setList, setLoading } from "./slice"
import Swal from "sweetalert2"
import { LanguagePayload, LanguageSaveRow } from "./types"

const useLanguage = () => {
    const dispatch = useAppDispatch()
    const { list, loading } = useAppSelector((state) => state.language)

    const getLanguageByCandidateId = (candidateId: number) => {
        dispatch(setLoading(true))
        return reqGetLanguageByCandidateId(candidateId)
            .then((res) => {
                dispatch(setList(res.data))
                return res.data
            })
            .catch((err) => {
                console.error("Failed to get language by candidate id", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    const createLanguage = (payload: LanguagePayload) => {
        dispatch(setLoading(true))
        return reqCreateLanguage(payload)
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                console.error("Failed to create language", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    const createLanguages = (payload: LanguagePayload[]) => {
        dispatch(setLoading(true))
        return reqCreateLanguages(payload)
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                console.error("Failed to create languages", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    const updateLanguage = (candidateId: number, languageId: string, payload: LanguagePayload) => {
        dispatch(setLoading(true))
        return reqUpdateLanguage(candidateId, languageId, payload)
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                console.error("Failed to update language", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    const deleteLanguage = (candidateId: number, languageId: string) => {
        dispatch(setLoading(true))
        return reqDeleteLanguage(candidateId, languageId)
            .then((res) => {
                return res.data
            })
            .catch((err) => {
                console.error("Failed to delete language", err)
                const d = err.response?.data?.error?.description
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: typeof d === "string" ? d : d?.[0]?.reason ?? "Something went wrong",
                })
                return null
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    const saveLanguages = (candidateId: number, rows: LanguageSaveRow[]) => {
        const existingIds = new Set(list.map((l) => l.languageId))
        const submittedIds = new Set(rows.map((r) => r.languageId).filter(Boolean))

        const removed = list.filter((l) => !submittedIds.has(l.languageId))

        return Promise.all(removed.map((l) => deleteLanguage(candidateId, l.languageId)))
            .then((deleteResults) => {
                if (deleteResults.some((r) => r === null)) return null

                return Promise.all(
                    rows.map((row) => {
                        const payload: LanguagePayload = {
                            candidateId,
                            languageName: row.languageName,
                            languageLevelId: row.languageLevelId,
                        }

                        if (row.languageId && existingIds.has(row.languageId)) {
                            return updateLanguage(candidateId, row.languageId, payload)
                        }
                        return createLanguage(payload)
                    })
                )
            })
            .then((saveResults) => {
                const failed = saveResults === null || saveResults.some((r) => r === null)
                // Always reload so the form matches the server, even after a partial failure
                return getLanguageByCandidateId(candidateId).then(() => !failed)
            })
    }

    return {
        list,
        loading,
        getLanguageByCandidateId,
        createLanguage,
        createLanguages,
        updateLanguage,
        deleteLanguage,
        saveLanguages,
    }
}

export default useLanguage