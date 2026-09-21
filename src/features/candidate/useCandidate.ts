

import { reqCreateCandidate, reqGetCandidates } from "@/src/features/candidate/request";
import { setList, setLoading } from "@/src/features/candidate/slice";
import { useAppDispatch } from "@/src/redux/hooks";

const useCandidate = () => {
    const dispatch = useAppDispatch();

    const getCandidate = () => {
        return reqGetCandidates()
            .then((res) => {
                dispatch(setLoading(true))
                dispatch(setList(res.data));
            })
            .catch((err) => {
                console.error("Failed to fetch candidates", err);
            });
    };

    const createCandidate = (payload: any) => {
        return reqCreateCandidate(payload)
            .then(() => {
                dispatch(setLoading(true));
            })
            .catch((err) => {
                console.error("Failed to create candidate", err)
            })
    }

    return { getCandidate, createCandidate };
};

export default useCandidate;
