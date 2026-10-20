import { reqGetMajor } from "./request";
import { useAppDispatch, useAppSelector } from "@/src/redux/hooks";
import { setList } from "./slice";
import Swal from "sweetalert2";

const useMajor = () => {
    const dispatch = useAppDispatch();
    const { list, loading } = useAppSelector((state) => state.major);

    const getMajorList = () => {
        return reqGetMajor()
            .then((res) => {
                dispatch(setList(res.data));
            })
            .catch((err) => {
                console.log(err);
                Swal.fire({
                    title: "Error",
                    text: "Failed to load majors",
                    icon: "error",
                });
            })
    }

    return {
        list,
        loading,
        getMajorList,
    }
}

export default useMajor;