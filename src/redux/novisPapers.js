import { createSlice } from '@reduxjs/toolkit';

export const novisPapersSlice = createSlice({
    name : 'novisPapers',
    initialState:{
        papers : [],
    },
    reducers:{
        changeNovisPapers :(state,action) => {
            state.papers = action.payload;
        }
    }
});

export const { changeNovisPapers } = novisPapersSlice.actions;

export default novisPapersSlice.reducer;