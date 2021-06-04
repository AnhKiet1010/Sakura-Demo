import { createSlice } from '@reduxjs/toolkit';

export const typingSlice = createSlice({
  name: 'typing',
  initialState: {
    state: false,
    id: ""
  },
  reducers: {
    setTyping: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTyping } = typingSlice.actions;
export default typingSlice.reducer;