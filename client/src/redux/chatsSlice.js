import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetchAllChats } from "../apis/chat";

const initialState = {
  chats: [],
  activeChat: "",
  isLoading: false,
  notifications: [],
};

export const fetchChats = createAsyncThunk("redux/chats", async () => {
  try {
    const data = await fetchAllChats();
    console.log('fetchChats',data)
    return data;
  } catch (error) {
    console.error("error fetching chats");
  }
});

const chatsSlice = createSlice({
  name: "chats",
  initialState,

  reducers: {
    setActiveChat: (state, action) => {
      state.activeChat = action.payload;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
    },
  },
  // extraReducers:{
  //     [fetchChats.pending] : (state) => {
  //         state.isLoading = true;
  //     },

  //     [fetchChats.fulfilled] : (state, action) => {
  //         state.chats = action.payload;
  //         state.isLoading = false;
  //     },
  //     [fetchChats.rejected] : (state) => {
  //         state.isLoading = false;
  //     },
  // }
  extraReducers: (builder) => {
    builder
      .addCase(fetchChats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.chats = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchChats.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { setActiveChat, setNotifications } = chatsSlice.actions;
export default chatsSlice.reducer;
