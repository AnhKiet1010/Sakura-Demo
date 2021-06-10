import { createSlice } from '@reduxjs/toolkit';

export const touchingMessSlice = createSlice({
  name: 'touchingMess',
  initialState: {
    mess: {},
    showEditPanel: false,
    self: false
  },
  reducers: {
    setTouchingMess: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setTouchingMess } = touchingMessSlice.actions;
export default touchingMessSlice.reducer;