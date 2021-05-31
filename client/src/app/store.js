import { configureStore } from '@reduxjs/toolkit';
import keywordReducer from '../slices/keywordSlice';
import currentUserReducer from '../slices/currentUserSlice';

export default configureStore({
  reducer: {
      keyword: keywordReducer,
      currentUser: currentUserReducer
  },
})