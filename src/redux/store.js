import { configureStore } from '@reduxjs/toolkit';
import papersCountReducer from './papersCountSlice';
import startYearReducer from './startYearSlice';
import endYearReducer from './endYearSlice';
import keywordReducer from './keywordSlice';

export const store = configureStore({
  reducer: {
    papersCounter : papersCountReducer,
    startYear: startYearReducer,
    endYear: endYearReducer,
    keyword: keywordReducer,
  },
});