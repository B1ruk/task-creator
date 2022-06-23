import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch,TypedUseSelectorHook } from "react-redux";
import taskActivityReducer from "./features/taskActivitySlice";

const store = configureStore({
  reducer: {
    taskActivity: taskActivityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;



export type AppDispatch=typeof store.dispatch
export const useAppDispatch:()=>AppDispatch=useDispatch // Export a hook that can be reused to resolve types

export const useAppSelector:TypedUseSelectorHook<RootState>=useSelector;

export default store;
