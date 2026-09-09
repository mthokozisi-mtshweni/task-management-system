import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "http://localhost:5000/api/tasks";

function App() {
    const [tasks, setTasks] = useState([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [editingTask, setEditingTask] = useState(null);
    const [loading, setLoading] = useState(false);

   
    const fetchTasks = async () => {
        try {
            setLoading(true);

            const response = await axios.get(API_URL);

            setTasks(response.data);
        } catch (error) {
            console.error("Failed to load tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim()) {
            alert("Please enter a task title.");
            return;
        }

        try {
            if (editingTask) {
                await axios.put(`${API_URL}/${editingTask.id}`, {
                    title,
                    description
                });
            } else {
                await axios.post(API_URL, {
                    title,
                    description
                });
            }

            resetForm();
            fetchTasks();

        } catch (error) {
            console.error("Failed to save task:", error);
            alert("Failed to save task.");
        }
    };

    const deleteTask = async (id) => {

        if (!window.confirm("Are you sure you want to delete this task?")) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/${id}`);

            fetchTasks();

        } catch (error) {
            console.error("Failed to delete task:", error);
            alert("Failed to delete task.");
        }
    };


    const completeTask = async (id) => {

        try {
            await axios.put(`${API_URL}/${id}/complete`);

            fetchTasks();

        } catch (error) {
            console.error("Failed to complete task:", error);
            alert("Failed to complete task.");
        }
    };

 
    const editTask = (task) => {
        setEditingTask(task);
        setTitle(task.title);
        setDescription(task.description || "");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };


    const resetForm = () => {
        setTitle("");
        setDescription("");
        setEditingTask(null);
    };

    const totalTasks = tasks.length;

    const completedTasks = tasks.filter(
        (task) => task.status === "COMPLETED"
    ).length;

    const pendingTasks = tasks.filter(
        (task) => task.status === "PENDING"
    ).length;

    return (
        <div className="app">

            
            <aside className="sidebar">

                <div className="logo">
                    <div className="logo-icon">✓</div>

                    <div>
                        <h2>TaskFlow</h2>
                        <span>Task Management</span>
                    </div>
                </div>

                <nav className="sidebar-nav">

                    <button className="nav-item active">
                        <span>▦</span>
                        Dashboard
                    </button>

                    <button
                        className="nav-item"
                        onClick={() =>
                            document
                                .getElementById("tasks")
                                ?.scrollIntoView({
                                    behavior: "smooth"
                                })
                        }
                    >
                        <span>✓</span>
                        My Tasks
                    </button>

                </nav>

                <div className="sidebar-footer">
                    <span>Task Management System</span>
                    <small>v1.0.0</small>
                </div>

            </aside>


            
            <main className="main-content">

                
                <header className="top-header">

                    <div>
                        <p className="eyebrow">TASK MANAGEMENT</p>
                        <h1>Dashboard</h1>
                        <p className="header-subtitle">
                            Manage your tasks and stay productive.
                        </p>
                    </div>

                    <div className="header-user">
                        <div className="user-avatar">
                            TM
                        </div>

                        <div>
                            <strong>Team Member</strong>
                            <span>Administrator</span>
                        </div>
                    </div>

                </header>


                
                <section className="stats-grid">

                    <div className="stat-card">
                        <div className="stat-icon">▦</div>

                        <div>
                            <span>Total Tasks</span>
                            <strong>{totalTasks}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon pending">◷</div>

                        <div>
                            <span>Pending</span>
                            <strong>{pendingTasks}</strong>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon completed">✓</div>

                        <div>
                            <span>Completed</span>
                            <strong>{completedTasks}</strong>
                        </div>
                    </div>

                </section>


              
                <section className="task-form-card">

                    <div className="section-heading">
                        <div>
                            <p className="eyebrow">
                                {editingTask ? "EDIT TASK" : "NEW TASK"}
                            </p>

                            <h2>
                                {editingTask
                                    ? "Update task"
                                    : "Create a task"}
                            </h2>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>

                        <div className="form-group">

                            <label>Task title</label>

                            <input
                                type="text"
                                placeholder="Enter task title..."
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                            />

                        </div>

                        <div className="form-group">

                            <label>Description</label>

                            <textarea
                                placeholder="Add a description..."
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                rows="3"
                            />

                        </div>

                        <div className="form-actions">

                            {editingTask && (
                                <button
                                    type="button"
                                    className="btn secondary"
                                    onClick={resetForm}
                                >
                                    Cancel
                                </button>
                            )}

                            <button
                                type="submit"
                                className="btn primary"
                            >
                                {editingTask
                                    ? "Update Task"
                                    : "+ Add Task"}
                            </button>

                        </div>

                    </form>

                </section>


                
                <section
                    className="tasks-section"
                    id="tasks"
                >

                    <div className="tasks-header">

                        <div>
                            <p className="eyebrow">YOUR WORK</p>
                            <h2>Tasks</h2>
                        </div>

                        <span className="task-count">
                            {totalTasks}{" "}
                            {totalTasks === 1 ? "task" : "tasks"}
                        </span>

                    </div>


                    {loading ? (

                        <div className="empty-state">
                            <p>Loading tasks...</p>
                        </div>

                    ) : tasks.length === 0 ? (

                        <div className="empty-state">

                            <div className="empty-icon">✓</div>

                            <h3>No tasks yet</h3>

                            <p>
                                Create your first task using
                                the form above.
                            </p>

                        </div>

                    ) : (

                        <div className="task-list">

                            {tasks.map((task) => (

                                <div
                                    className={`task-card ${
                                        task.status === "COMPLETED"
                                            ? "completed-task"
                                            : ""
                                    }`}
                                    key={task.id}
                                >

                                    <button
                                        className={`complete-button ${
                                            task.status === "COMPLETED"
                                                ? "checked"
                                                : ""
                                        }`}
                                        onClick={() =>
                                            task.status !== "COMPLETED" &&
                                            completeTask(task.id)
                                        }
                                        title={
                                            task.status === "COMPLETED"
                                                ? "Completed"
                                                : "Mark as completed"
                                        }
                                    >
                                        {task.status === "COMPLETED"
                                            ? "✓"
                                            : ""}
                                    </button>


                                    <div className="task-details">

                                        <h3>{task.title}</h3>

                                        {task.description && (
                                            <p>
                                                {task.description}
                                            </p>
                                        )}

                                        <span
                                            className={`status ${
                                                task.status === "COMPLETED"
                                                    ? "status-completed"
                                                    : "status-pending"
                                            }`}
                                        >
                                            {task.status === "COMPLETED"
                                                ? "Completed"
                                                : "Pending"}
                                        </span>

                                    </div>


                                    <div className="task-actions">

                                        <button
                                            onClick={() =>
                                                editTask(task)
                                            }
                                            className="action-btn edit"
                                        >
                                            Edit
                                        </button>

                                        <button
                                            onClick={() =>
                                                deleteTask(task.id)
                                            }
                                            className="action-btn delete"
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

        </div>
    );
}

export default App;