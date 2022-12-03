import { createSlice } from '@reduxjs/toolkit';

export const pageActiveSlice = createSlice({
    name : 'pageActive',
    initialState:{
        active : 'home',
    },
    reducers:{
        changePageActive :(state,action) => {
            state.active = action.payload;
        }
    }
});

export const { changePageActive } = pageActiveSlice.actions;

export default pageActiveSlice.reducer;