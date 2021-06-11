import { createSlice } from '@reduxjs/toolkit';

export const listNotiSlice = createSlice({
  name: 'listNoti',
  initialState: [],
  reducers: {
    setListNoti: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setListNoti } = listNotiSlice.actions;
export default listNotiSlice.reducer;