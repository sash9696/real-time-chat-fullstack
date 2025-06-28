import { configureStore } from "@reduxjs/toolkit";
import activeUserSlice from "./redux/activeUserSlice";
import chatsSlice from "./redux/chatsSlice";

const store = configureStore({
  reducer: {
    activeUser: activeUserSlice,
    chats: chatsSlice
  },
});

export default store;
