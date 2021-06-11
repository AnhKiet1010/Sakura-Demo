import { createSlice } from '@reduxjs/toolkit';

export const listSearchFriendsSlice = createSlice({
  name: 'listSearchFriends',
  initialState: [],
  reducers: {
    setListSearchFriends: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setListSearchFriends } = listSearchFriendsSlice.actions;
export default listSearchFriendsSlice.reducer;