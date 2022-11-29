import { configureStore } from '@reduxjs/toolkit';
import papersCountReducer from './papersCountSlice';
import startYearReducer from './startYearSlice';
import endYearReducer from './endYearSlice';
import keywordReducer from './keywordSlice';
import papersSortReducer from './papersSortSlice';
import papersKeywordReducer from './papersKeywordSlice';
import papersDetailReducer from './papersDetailSlice';
import searchFormReducer from './searchFormSlice';
import columnsJudgeReducer from './columnsSlice';
import scrollJudgeReducer from './scrollJudge';
import tableDataJudgeReducer from './tableDataJudge';

import novisKeywordReducer from './novisKeyword';
import novisPapersReducer from './novisPapers';

export const store = configureStore({
  reducer: {
    papersCounter : papersCountReducer,
    startYear: startYearReducer,
    endYear: endYearReducer,
    keyword: keywordReducer,
    papersSort:papersSortReducer,
    papersKeyword:papersKeywordReducer,
    papersDetail:papersDetailReducer,
    searchForm: searchFormReducer,
    columnsJudge: columnsJudgeReducer,
    scrollJudge: scrollJudgeReducer,
    tableDataJudge: tableDataJudgeReducer,

    novisKeyword: novisKeywordReducer,
    novisPapers: novisPapersReducer,
  },
});