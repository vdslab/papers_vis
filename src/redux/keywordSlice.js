import { createSlice } from "@reduxjs/toolkit";

export const keywordSlice = createSlice({
  name: "keyword",
  initialState: {
    keyword: "",
  },
  reducers: {
    changeKeyword: (state, action) => {
      state.keyword = action.payload;
    },
  },
});

export const { changeKeyword } = keywordSlice.actions;

export default keywordSlice.reducer;
