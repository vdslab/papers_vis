import { createSlice } from "@reduxjs/toolkit";

export const endYearSlice = createSlice({
  name: "endYear",
  initialState: {
    year: 2021,
  },
  reducers: {
    changeEndYear: (state, action) => {
      state.year = action.payload;
    },
  },
});

export const { changeEndYear } = endYearSlice.actions;

export default endYearSlice.reducer;
