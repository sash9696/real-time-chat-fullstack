//createAsyncThunk
//fetch the data using redux

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  id: "",
  email: "",
  profilePic: "",
  bio: "",
  name: "",
};

const activeUserSlice = createSlice({
  name: "activeUser",
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.profilePic = action.payload.profilePic;
      state.bio = action.payload.bio;
      state.name = action.payload.name;
    },
    setUserNameAndBio: (state, action) => {
      state.bio = action.payload.bio;
      state.name = action.payload.name;
    },
  },
});

export const {setActiveUser, setUserNameAndBio}  = activeUserSlice.actions;

export default activeUserSlice.reducer;