// counterSlice.js
import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user_profile',
  initialState: {
    user_email: '',        
    user_name: '',         
    user_picture: '',
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
    isAddChatModalVisible: false,
    isToggleDropdownModalVisible: false,

  },
  reducers: {
    Set_isAddChatModalVisible: (state, action) => {
      state.isAddChatModalVisible = action.payload;
    },
    Set_isToggleDropdownModalVisible: (state, action) => {
        state.isToggleDropdownModalVisible = action.payload;
      },
  },
});

const OtherSlice = createSlice({
    name: 'Other',
    initialState: {
    ip : '',
    },
    reducers: {
      Set_ip: (state, action) => {
        state.ip = action.payload;
      },
    },
  });

export const {
  Set_user_email,
  Set_user_name,
  Set_user_picture,
  Set_user_age,
} = userSlice.actions;

export const { Set_isAddChatModalVisible, Set_isToggleDropdownModalVisible } = ModalsSlice.actions;

export const { Set_ip } = OtherSlice.actions;

export const userProfileReducer = userSlice.reducer;
export const ModalsReducer = ModalsSlice.reducer;
export const OtherReducer = OtherSlice.reducer;