import { createSlice } from '@reduxjs/toolkit';

export const papersCountSlice = createSlice({
    name : 'papersCounter',
    initialState:{
        count : 5000,
    },
    reducers:{
        changePapersCount :(state,action) => {
            state.count = action.payload;
        }
    }
});

export const { changePapersCount } = papersCountSlice.actions;

export default papersCountSlice.reducer;