import { createSlice } from '@reduxjs/toolkit';

export const papersSortSlice = createSlice({
    name : 'papersSort',
    initialState:{
        element : "title_asc",
    },
    reducers:{
        changePapersSort :(state,action) => {
            state.element = action.payload;
        }
    }
});

export const { changePapersSort } = papersSortSlice.actions;

export default papersSortSlice.reducer;