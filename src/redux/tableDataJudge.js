import { createSlice } from "@reduxjs/toolkit";

export const tableDataJudgeSlice = createSlice({
  name: "tableDataJudge",
  initialState: {
    judge: true,
  },
  reducers: {
    changeTableDataJudge: (state, action) => {
      state.judge = action.payload;
    },
  },
});

export const { changeTableDataJudge } = tableDataJudgeSlice.actions;

export default tableDataJudgeSlice.reducer;
