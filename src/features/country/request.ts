import axios from "axios";
import { CountryApiResponse } from "./types";

const publicApi = axios.create({
    baseURL: "https://countriesnow.space/api/v0.1",
    timeout: 15000,
});

export const reqGetCountries = () => {
    return publicApi.get<CountryApiResponse>("/countries/flag/images");
};