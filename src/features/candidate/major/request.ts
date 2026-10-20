import axios from "axios";
import { MajorRes } from "./types";

export const reqGetMajor = () => {
    return axios.get<MajorRes[]>('/majors')
}