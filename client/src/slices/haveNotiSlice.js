import { createSlice } from '@reduxjs/toolkit';

export const haveNotiSlice = createSlice({
  name: 'haveNoti',
  initialState: false,
  reducers: {
    setHaveNoti: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setHaveNoti } = haveNotiSlice.actions;
export default haveNotiSlice.reducer;