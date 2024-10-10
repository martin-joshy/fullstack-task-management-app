import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import user_api from "@/api/UserApi";

export const fetchTasks = createAsyncThunk("tasks/fetchTasks", async () => {
  const response = await user_api.get("/api/tasks/");
  return response.data;
});

export const addTask = createAsyncThunk("tasks/addTask", async (task) => {
  const response = await user_api.post("/api/tasks/", task);
  return response.data;
});

export const updateTask = createAsyncThunk("tasks/updateTask", async (task) => {
  const response = await user_api.put(`/api/tasks/${task.id}/`, task);
  return response.data;
});

export const deleteTask = createAsyncThunk("tasks/deleteTask", async (id) => {
  await user_api.delete(`/api/tasks/${id}/`);
  return id;
});

export const fetchTaskStatistics = createAsyncThunk(
  "tasks/fetchTaskStatistics",
  async () => {
    const response = await user_api.get("/api/tasks/statistics/");
    return response.data;
  }
);

const taskSlice = createSlice({
  name: "tasks",
  initialState: {
    tasks: [],
    newTask: "",
    editingTask: null,
    status: "idle",
    error: null,
    statistics: null,
  },
  reducers: {
    setNewTask: (state, action) => {
      state.newTask = action.payload;
    },
    setEditingTask: (state, action) => {
      state.editingTask = action.payload;
    },
    updateStatistics: (state, action) => {
      state.statistics = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(addTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(
          (task) => task.id === action.payload.id
        );
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      })
      .addCase(fetchTaskStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });
  },
});

export const { setNewTask, setEditingTask, updateStatistics } =
  taskSlice.actions;

export default taskSlice.reducer;
