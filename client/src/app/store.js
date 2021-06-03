import { configureStore } from '@reduxjs/toolkit';
import keywordReducer from '../slices/keywordSlice';
import currentUserReducer from '../slices/currentUserSlice';
import userInfoReducer from '../slices/userInfoSlice';

export default configureStore({
  reducer: {
      keyword: keywordReducer,
      currentUser: currentUserReducer,
      user: userInfoReducer
  },
})