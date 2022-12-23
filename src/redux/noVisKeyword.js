import { createSlice } from "@reduxjs/toolkit";

export const novisKeywordSlice = createSlice({
  name: "novisKeyword",
  initialState: {
    keyword: "",
  },
  reducers: {
    changeNovisKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
});

export const { changeNovisKeyword } = novisKeywordSlice.actions;

export default novisKeywordSlice.reducer;
