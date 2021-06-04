import { configureStore } from '@reduxjs/toolkit';
import keywordReducer from '../slices/keywordSlice';
import currentUserReducer from '../slices/currentUserSlice';
import userInfoReducer from '../slices/userInfoSlice';
import typingReducer from '../slices/typingSlice';
import listFriendsReducer from '../slices/listFriendsSlice';
import listMessagesReducer from '../slices/listMessagesSlice';

export default configureStore({
  reducer: {
      keyword: keywordReducer,
      currentUser: currentUserReducer,
      user: userInfoReducer,
      typing: typingReducer,
      listFriends: listFriendsReducer,
      listMessages: listMessagesReducer
  },
})