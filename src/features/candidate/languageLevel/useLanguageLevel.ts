import { useState, useEffect } from "react";
import { reqGetLanguageLevel, reqCreateLanguageLevel, reqUpdateLanguageLevel, reqDeleteLanguageLevel, reqGetLanguageLevelById } from "./request";
import { LanguageLevelResponse, LanguageLevelPayload } from "./types";
import Swal from "sweetalert2";
import { useAppSelector, useAppDispatch } from "@/src/redux/hooks";
import { setLoading, setList, setCurrent } from "./slice";

const useLanguageLevel = () => {
    const dispatch = useAppDispatch();

    const { loading, list } = useAppSelector((state) => state.languageLevel)

    const getLanguageLevel = () => {
        dispatch(setLoading(true))
        return reqGetLanguageLevel()
            .then((res) => {
                dispatch(setList(res.data))
                dispatch(setLoading(false))
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to get language level", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.message,
                });
                return null;
            });
    }

    const getLanguageLevelById = (id: string) => {
        dispatch(setLoading(true))
        return reqGetLanguageLevelById(id)
            .then((res) => {
                dispatch(setCurrent(res.data))
                dispatch(setLoading(false))
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to get language level by id", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.message,
                });
                return null;
            });
    }

    const createLanguageLevel = (data: LanguageLevelPayload) => {
        dispatch(setLoading(true))
        return reqCreateLanguageLevel(data)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to create language level", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.description,
                });
                return null;
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    const updateLanguageLevel = (id: string, data: LanguageLevelPayload) => {
        dispatch(setLoading(true))
        return reqUpdateLanguageLevel(id, data)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to update language level", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.message,
                });
                return null;
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    const deleteLanguageLevel = (id: string) => {
        dispatch(setLoading(true))
        return reqDeleteLanguageLevel(id)
            .then((res) => {
                return res.data;
            })
            .catch((err) => {
                console.error("Failed to delete language level", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.response.data.message,
                });
                return null;
            })
            .finally(() => {
                dispatch(setLoading(false))
            })
    }

    return {
        list,
        loading,

        getLanguageLevel,
        getLanguageLevelById,
        createLanguageLevel,
        updateLanguageLevel,
        deleteLanguageLevel,
    }
};

export default useLanguageLevel;