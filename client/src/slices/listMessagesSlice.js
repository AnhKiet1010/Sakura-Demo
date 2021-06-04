import { createSlice } from '@reduxjs/toolkit';

export const listMessagesSlice = createSlice({
  name: 'listMessages',
  initialState: [],
  reducers: {
    setListMessages: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setListMessages } = listMessagesSlice.actions;
export default listMessagesSlice.reducer;