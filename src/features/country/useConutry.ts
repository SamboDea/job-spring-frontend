import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import Swal from "sweetalert2";
import { reqGetCountries } from "./request";
import { setList, setLoading } from "./slice";
import { CountryResponse } from "./types";

// Module level, so React Strict Mode's double effect shares one request
let inFlight: Promise<CountryResponse[] | null> | null = null;

const useCountry = () => {
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector((state) => state.country);

    const getCountry = (): Promise<CountryResponse[] | null> => {
        if (list.length > 0) return Promise.resolve(list);
        if (inFlight) return inFlight;

        dispatch(setLoading(true));
        inFlight = reqGetCountries()
            .then((res) => {
                // This API can return error: true with HTTP 200
                if (res.data.error || !Array.isArray(res.data.data)) {
                    throw new Error(res.data.msg || "Could not load countries");
                }
                const sorted = [...res.data.data].sort((a, b) =>
                    a.name.localeCompare(b.name)
                );
                dispatch(setList(sorted));
                return sorted;
            })
            .catch((err) => {
                console.error("Failed to get countries", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "Could not load countries",
                });
                return null;
            })
            .finally(() => {
                inFlight = null;
                dispatch(setLoading(false));
            });

        return inFlight;
    };

    return { list, loading, getCountry };
};

export default useCountry;