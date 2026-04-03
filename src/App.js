import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

const API = process.env.REACT_APP_API_URL;

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState("");
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");
  console.log("API:", API);

  const register = async () => {
    await axios.post(`${API}/api/auth/register`, { email, password });
    alert("Registered! Now login.");
  };

  const login = async () => {
    const res = await axios.post(`${API}/api/auth/login`, { email, password });
    setToken(res.data.token);
  };

  const getTodos = useCallback(async () => {
  try {
    const res = await axios.get(`${API}/api/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTodos(res.data);
  } catch (err) {
    console.error(err);
  }
}, [token]);

  const addTodo = async () => {
    await axios.post(
      `${API}/api/todos`,
      { title },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setTitle("");
    getTodos();
  };

  const toggleTodo = async (id, completed) => {
    await axios.put(
      `${API}/api/todos/${id}`,
      { completed: !completed },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    getTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${API}/api//todos/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    getTodos();
  };

  const updateTodo = async () => {
    await axios.put(
      `${API}/api/todos/${editId}`,
      { title: editText },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditId(null);
    setEditText("");
    getTodos();
  };

useEffect(() => {
  getTodos();
}, [getTodos]);

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-4">Todo App</h2>

        {!token ? (
          <>
            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="w-full border p-2 rounded mb-2"
              type="password"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded w-full"
                onClick={login}
              >
                Login
              </button>
              <button
                className="bg-green-500 text-white px-4 py-2 rounded w-full"
                onClick={register}
              >
                Register
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex gap-2 mb-4">
              <input
                className="flex-1 border p-2 rounded"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a task..."
              />
              <button
                className="bg-blue-500 text-white px-4 rounded"
                onClick={addTodo}
              >
                Add
              </button>
            </div>

            <ul className="space-y-2">
              {todos.map((todo) => (
                <li
                  key={todo._id}
                  className="flex justify-between items-center bg-gray-50 p-2 rounded"
                >
                  {editId === todo._id ? (
                    <>
                      <input
                        className="border p-1 rounded flex-1"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />
                      <button
                        className="ml-2 text-green-600"
                        onClick={updateTodo}
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <>
                      <span
                        className={`flex-1 cursor-pointer ${
                          todo.completed ? "line-through text-gray-400" : ""
                        }`}
                        onClick={() =>
                          toggleTodo(todo._id, todo.completed)
                        }
                      >
                        {todo.title}
                      </span>

                      <button
                        className="text-yellow-500 mr-2"
                        onClick={() => {
                          setEditId(todo._id);
                          setEditText(todo.title);
                        }}
                      >
                        ✏️
                      </button>

                      <button
                        className="text-red-500"
                        onClick={() => deleteTodo(todo._id)}
                      >
                        ❌
                      </button>
                    </>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
}

export default App;