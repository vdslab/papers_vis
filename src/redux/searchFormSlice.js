import { createSlice } from '@reduxjs/toolkit';

export const searchFormSlice = createSlice({
    name : 'searchForm',
    initialState:{
        search : '',
    },
    reducers:{
        changeSearchForm :(state,action) => {
            state.search = action.payload;
        }
    }
});

export const { changeSearchForm } = searchFormSlice.actions;

export default searchFormSlice.reducer;