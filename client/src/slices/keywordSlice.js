import { createSlice } from '@reduxjs/toolkit';

export const keywordSlice = createSlice({
  name: 'keyword',
  initialState: "",
  reducers: {
    getKeyword: (state, action) => {
      return state;
    },
    setKeyword: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setKeyword } = keywordSlice.actions;
export default keywordSlice.reducer;