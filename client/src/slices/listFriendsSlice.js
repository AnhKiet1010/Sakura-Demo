import { createSlice } from '@reduxjs/toolkit';

export const listFriendsSlice = createSlice({
  name: 'listFriends',
  initialState: [],
  reducers: {
    setListFriends: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setListFriends } = listFriendsSlice.actions;
export default listFriendsSlice.reducer;