import { createSlice } from '@reduxjs/toolkit';

export const userInfoSlice = createSlice({
  name: 'user',
  initialState: JSON.parse(localStorage.getItem("user")),
  reducers: {
    getUser: (state, action) => {
      return state;
    },
    setUser: (state, action) => {
      return action.payload;
    }
  },
})

// Action creators are generated for each case reducer function
export const { setUser } = userInfoSlice.actions;
export default userInfoSlice.reducer;