import { configureStore } from "@reduxjs/toolkit";
import taskReducer from "../components/task_management/taskSlice";

const store = configureStore({
  reducer: {
    tasks: taskReducer,
  },
});

export default store;
