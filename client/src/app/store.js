import { configureStore } from '@reduxjs/toolkit';
import keywordReducer from '../slices/keywordSlice';

export default configureStore({
  reducer: {
      keyword: keywordReducer
  },
})