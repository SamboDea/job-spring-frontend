export interface CountryResponse {
    name: string;
    flag: string;
    iso2: string;
    iso3: string;
}

export interface CountryApiResponse {
    error: boolean;
    msg: string;
    data: CountryResponse[];
}

export interface CountryState {
    list: CountryResponse[];
    loading: boolean;
}