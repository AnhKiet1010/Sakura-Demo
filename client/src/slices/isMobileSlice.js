import { createSlice } from '@reduxjs/toolkit';

export const isMobileSlice = createSlice({
  name: 'isMobile',
  initialState: window.innerWidth > 768 ? false : true,
  reducers: {
    setIsMobile: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setIsMobile } = isMobileSlice.actions;
export default isMobileSlice.reducer;