import { createSlice } from '@reduxjs/toolkit';
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

export const socketSlice = createSlice({
    name: 'socket',
    initialState: {
      value: io(ENDPOINT),
    },
    reducers: {
      get: (state) => {
        return state
      },
    },
  })
  
  // Action creators are generated for each case reducer function
  export const { get } = socketSlice.actions;
  export default socketSlice.reducer;