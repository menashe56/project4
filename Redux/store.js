// store.js
import { configureStore } from '@reduxjs/toolkit';
import { userProfileReducer, ModalsReducer, OtherReducer } from './counterSlice';

const store = configureStore({
  reducer: {
    user_profile: userProfileReducer,
    Modals: ModalsReducer,
    Other: OtherReducer,
  },
});

export default store;
