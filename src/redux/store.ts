import { configureStore } from '@reduxjs/toolkit';
import userLoginSlice from './userLogin/userLoginSlice';

const store = configureStore({
  reducer: {
    userLogin: userLoginSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch