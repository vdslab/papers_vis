import { createSlice } from "@reduxjs/toolkit";

export const columnsJudgeSlice = createSlice({
  name: "columnsJudge",
  initialState: {
    judge: "",
  },
  reducers: {
    changeColumnsJudge: (state, action) => {
      state.judge = action.payload;
    },
  },
});

export const { changeColumnsJudge } = columnsJudgeSlice.actions;

export default columnsJudgeSlice.reducer;
