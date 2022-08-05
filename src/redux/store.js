import { configureStore } from '@reduxjs/toolkit';
import papersCountReducer from './papersCountSlice';
import startYearReducer from './startYearSlice';
import endYearReducer from './endYearSlice';
import keywordReducer from './keywordSlice';
import papersSortReducer from './papersSortSlice';
import papersKeywordReducer from './papersKeywordSlice';
import papersDetailReducer from './papersDetailSlice';

export const store = configureStore({
  reducer: {
    papersCounter : papersCountReducer,
    startYear: startYearReducer,
    endYear: endYearReducer,
    keyword: keywordReducer,
    papersSort:papersSortReducer,
    papersKeyword:papersKeywordReducer,
    papersDetail:papersDetailReducer,
  },
});