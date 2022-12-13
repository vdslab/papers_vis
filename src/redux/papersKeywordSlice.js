import { createSlice } from "@reduxjs/toolkit";

export const papersKeywordSlice = createSlice({
  name: "papersKeyword",
  initialState: {
    papers: [],
  },
  reducers: {
    changePapersKeyword: (state, action) => {
      state.papers = action.payload;
    },
  },
});

export const { changePapersKeyword } = papersKeywordSlice.actions;

export default papersKeywordSlice.reducer;
