import { configureStore } from '@reduxjs/toolkit';
import keywordReducer from '../slices/keywordSlice';
import currentUserReducer from '../slices/currentUserSlice';
import userInfoReducer from '../slices/userInfoSlice';
import typingReducer from '../slices/typingSlice';
import listFriendsReducer from '../slices/listFriendsSlice';
import listMessagesReducer from '../slices/listMessagesSlice';
import isMobileReducer from '../slices/isMobileSlice';
import touchingMessReducer from '../slices/touchingMessSlice';
import listSearchFriendsReducer from '../slices/listSearchFriendsSlice';
import listNotiReducer from '../slices/listNotiSlice';
import haveNotiReducer from '../slices/haveNotiSlice';


export default configureStore({
  reducer: {
      keyword: keywordReducer,
      currentUser: currentUserReducer,
      user: userInfoReducer,
      typing: typingReducer,
      listFriends: listFriendsReducer,
      listMessages: listMessagesReducer,
      isMobile: isMobileReducer,
      touchingMess: touchingMessReducer,
      listSearchFriends: listSearchFriendsReducer,
      listNoti: listNotiReducer,
      haveNoti: haveNotiReducer
  },
})