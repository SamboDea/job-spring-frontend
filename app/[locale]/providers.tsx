"use client";

import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Provider } from "react-redux";
import { store } from "@/src/redux/store";
import { setUpAxios } from "@/src/helpers/axiosHelper";

setUpAxios();

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        {children}
      </LocalizationProvider>
    </Provider>

  );
}