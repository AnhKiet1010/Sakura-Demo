import { createSlice } from '@reduxjs/toolkit';

export const currentUserSlice = createSlice({
  name: 'currentUser',
  initialState: {},
  reducers: {
    getCurrentUser: (state, action) => {
      return state;
    },
    setCurrentUser: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setCurrentUser } = currentUserSlice.actions;
export default currentUserSlice.reducer;