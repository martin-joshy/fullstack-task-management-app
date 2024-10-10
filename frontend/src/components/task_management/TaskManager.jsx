import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, Trash2 } from "lucide-react";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  setNewTask,
  setEditingTask,
  fetchTaskStatistics,
  updateStatistics,
} from "./taskSlice";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

export default function TaskManager() {
  const dispatch = useDispatch();
  const { tasks, newTask, editingTask, status, error, statistics } =
    useSelector((state) => state.tasks);
  const VITE_API_WEBSOCKET_URL = import.meta.env.VITE_API_WEBSOCKET_URL;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchTasks());
      dispatch(fetchTaskStatistics());
    }
  }, [status, dispatch]);

  useEffect(() => {
    const socket = new WebSocket(VITE_API_WEBSOCKET_URL + "ws/tasks/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "tasks_update") {
        dispatch(fetchTasks());
        dispatch(updateStatistics(data.statistics));
      }
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  const handleAddTask = (e) => {
    e.preventDefault();
    if (newTask.trim()) {
      dispatch(addTask({ text: newTask, is_done: false }));
      dispatch(setNewTask(""));
    }
  };

  const handleDeleteTask = (id) => {
    dispatch(deleteTask(id));
  };

  const handleStartEditing = (task) => {
    dispatch(setEditingTask(task));
    dispatch(setNewTask(task.text));
  };

  const handleUpdateTask = (e) => {
    e.preventDefault();
    if (editingTask && newTask.trim()) {
      dispatch(updateTask({ ...editingTask, text: newTask }));
      dispatch(setEditingTask(null));
      dispatch(setNewTask(""));
    }
  };

  const handleToggleTask = (task) => {
    dispatch(updateTask({ ...task, is_done: !task.is_done }));
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  const chartData = statistics
    ? [
        { name: "Completed", value: statistics.completed_tasks },
        { name: "Remaining", value: statistics.remaining_tasks },
      ]
    : [];

  const COLORS = ["#0088FE", "#00C49F"];

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">Task Manager</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <form
            onSubmit={editingTask ? handleUpdateTask : handleAddTask}
            className="mb-6"
          >
            <div className="flex space-x-2">
              <Input
                type="text"
                value={newTask}
                onChange={(e) => dispatch(setNewTask(e.target.value))}
                placeholder="Enter a task"
                className="flex-grow"
              />
              <Button type="submit">{editingTask ? "Update" : "Add"}</Button>
            </div>
          </form>
          <div className="space-y-4">
            {tasks.map((task) => (
              <Card key={task.id} className={task.is_done ? "opacity-50" : ""}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={task.is_done}
                      onCheckedChange={() => handleToggleTask(task)}
                    />
                    <span className={task.is_done ? "line-through" : ""}>
                      {task.text}
                    </span>
                  </div>
                  <div className="space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleStartEditing(task)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <div>
          <Card>
            <CardContent className="p-4">
              <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
              {statistics && (
                <div className="space-y-2">
                  <p>Total Tasks: {statistics.total_tasks}</p>
                  <p>Completed Tasks: {statistics.completed_tasks}</p>
                  <p>Remaining Tasks: {statistics.remaining_tasks}</p>
                </div>
              )}
              <div className="h-64 mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
