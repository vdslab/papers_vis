import { createSlice } from '@reduxjs/toolkit';

export const papersDetailSlice = createSlice({
    name : 'papersDetail',
    initialState:{
        papers : [],
    },
    reducers:{
        changePapersDetail :(state,action) => {
            state.papers = action.payload;
        }
    }
});

export const { changePapersDetail } = papersDetailSlice.actions;

export default papersDetailSlice.reducer;