import { createSlice } from '@reduxjs/toolkit';

export const scrollJudgeSlice = createSlice({
    name : 'scrollJudge',
    initialState:{
        judge : false,
    },
    reducers:{
        changeScrollJudge :(state,action) => {
            state.judge = action.payload;
        }
    }
});

export const { changeScrollJudge } = scrollJudgeSlice.actions;

export default scrollJudgeSlice.reducer;