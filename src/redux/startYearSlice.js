import { createSlice } from '@reduxjs/toolkit';

export const startYearSlice = createSlice({
    name : 'startYear',
    initialState:{
        year : 1955,
    },
    reducers:{
        changeStartYear :(state,action) => {
            state.year = action.payload;
        }
    }
});

export const { changeStartYear } = startYearSlice.actions;

export default startYearSlice.reducer;