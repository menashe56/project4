// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user_profile',
  initialState: {
    user_email: '',   //  me13@gmail.com     
    user_name: '',         
    user_picture: 'https://cdn-icons-png.flaticon.com/256/149/149071.png',
    user_age: 0,
  },
  reducers: {
    Set_user_email: (state, action) => {
      state.user_email = action.payload;
    },
    Set_user_name: (state, action) => {
      state.user_name = action.payload;
    },
    Set_user_picture: (state, action) => {
      state.user_picture = action.payload;
    },
    Set_user_age: (state, action) => {
      state.user_age = action.payload;
    },
  },
});

const ModalsSlice = createSlice({
  name: 'Modals',
  initialState: {
    newChatVisible: false
  },
  reducers: {
      Set_newChatVisible: (state, action) => {
        state.newChatVisible = action.payload;
      },
  },
});

const OtherSlice = createSlice({
    name: 'Other',
    initialState: {
    ip : '',
    currentRouteName : '',
    lighterColor : '',
    searchInput : '',
    onSearch : false,
    },
    reducers: {
      Set_ip: (state, action) => {
        state.ip = action.payload;
      },
      Set_currentRouteName: (state, action) => {
        state.currentRouteName = action.payload;
      },
      Set_lighterColor: (state, action) => {
        state.lighterColor = action.payload;
      },
      Set_searchInput: (state, action) => {
        state.searchInput = action.payload;
      },
      Set_onSearch: (state, action) => {
        state.onSearch = action.payload;
      },
    },
  });

export const {
  Set_user_email,
  Set_user_name,
  Set_user_picture,
  Set_user_age,
} = userSlice.actions;

export const { Set_newChatVisible } = ModalsSlice.actions;

export const { Set_ip, Set_currentRouteName, Set_lighterColor, Set_searchInput, Set_onSearch } = OtherSlice.actions;

export const userProfileReducer = userSlice.reducer;
export const ModalsReducer = ModalsSlice.reducer;
export const OtherReducer = OtherSlice.reducer;