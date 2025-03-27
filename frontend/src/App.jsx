import { useEffect, useState } from "react";
import "./App.css";

function App() {
    const [todos, setTodos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);

        async function fetchTodos() {
            const response = await fetch("http://localhost:3030/todos");
            const data = await response.json();

            setTodos(data);
            setLoading(false);
        }

        fetchTodos();
    }, []);

    async function updateTodo(todoId, data) {
        const response = await fetch(`http://localhost:3030/todos/${todoId}`, {
            method: "PATCH",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            console.log("Failed to update todo!");
            alert("Failed to update todo!");
        }
    }

    async function deleteTodo(todoId) {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id != todoId));

        const response = await fetch(`http://localhost:3030/todos/${todoId}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        return;

        console.log(todos.filter((todo) => todo.id != todoId));

        if (response.ok) {
            // remove deleted todo from the state
            setTodos((prevTodos) => prevTodos.filter((todo) => todo.id != todoId));
        } else {
            console.log("Failed to delete todo!");
            alert("Failed to delete todo!");
        }
    }

    async function handleAddTodo(event) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const title = formData.get("title");

        const response = await fetch("http://localhost:3030/todos", {
            method: "POST",
            body: JSON.stringify({ title }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (response.ok) {
            const data = await response.json();
            // add the added todo to the state
            setTodos((prevTodos) => [...prevTodos, data]);
        } else {
            console.log("Failed to add todo");
            alert("Failed to add todo");
        }

        event.target.reset();
    }

    return (
        <div>
            <h1 className="text-left font-[500] mb-[1rem]">Todo Application</h1>

            <form className="flex gap-[20px] mb-[3rem]" onSubmit={handleAddTodo}>
                <input
                    type="text"
                    name="title"
                    placeholder="Add todo title..."
                    className="border rounded-[8px] px-[12px] py-[8px] flex-1"
                />
                <button type="submit" className="text-[white]">
                    Add Todo
                </button>
            </form>

            {loading && <p className="text-center mb-[1rem]">Loading...</p>}

            <div className="mx-auto flex flex-col gap-[1rem]">
                {todos.map((todo) => (
                    <div
                        key={todo.id}
                        className="border rounded-[12px] bg-[white] p-[16px] flex items-center justify-between gap-[2rem]"
                    >
                        <span className="text-[20px] font-[600]">{todo.title}</span>

                        <div className="flex items-center gap-[8px]">
                            <label
                                htmlFor={`${todo.id}-isComplete`}
                                className="text-[14px] font-[500]"
                            >
                                Is Complete?
                            </label>
                            <input
                                type="checkbox"
                                name="isComplete"
                                id={`${todo.id}-isComplete`}
                                defaultChecked={todo.isComplete}
                                onChange={(event) =>
                                    updateTodo(todo.id, {
                                        isComplete: event.target.checked,
                                    })
                                }
                            />

                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="inline-block ml-[8px] text-[red] size-[20px] p-px cursor-pointer"
                                onClick={() => deleteTodo(todo.id)}
                            >
                                <path d="M3 6h18" />
                                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                                <line x1="10" x2="10" y1="11" y2="17" />
                                <line x1="14" x2="14" y1="11" y2="17" />
                            </svg>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default App;
