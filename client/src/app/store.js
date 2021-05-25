import { configureStore } from '@reduxjs/toolkit';
import socketReducer from '../slices/socketSlice';

export default configureStore({
  reducer: {
      socket: socketReducer
  },
})