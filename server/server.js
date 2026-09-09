const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


// ===============================
// HOME / API STATUS
// ===============================
app.get("/", (req, res) => {
    res.json({
        message: "Task Management API is running"
    });
});


// ===============================
// GET ALL TASKS
// ===============================
app.get("/api/tasks", (req, res) => {

    const sql = "SELECT * FROM tasks ORDER BY created_at DESC";

    db.query(sql, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to retrieve tasks"
            });
        }

        res.json(results);
    });
});


// ===============================
// GET SINGLE TASK
// ===============================
app.get("/api/tasks/:id", (req, res) => {

    const { id } = req.params;

    const sql = "SELECT * FROM tasks WHERE id = ?";

    db.query(sql, [id], (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to retrieve task"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json(results[0]);
    });
});


// ===============================
// ADD TASK
// ===============================
app.post("/api/tasks", (req, res) => {

    const { title, description } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const sql = `
        INSERT INTO tasks (title, description)
        VALUES (?, ?)
    `;

    db.query(
        sql,
        [title.trim(), description || null],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to create task"
                });
            }

            res.status(201).json({
                message: "Task created successfully",
                task: {
                    id: result.insertId,
                    title: title.trim(),
                    description: description || null,
                    status: "PENDING"
                }
            });
        }
    );
});


// ===============================
// UPDATE TASK
// ===============================
app.put("/api/tasks/:id", (req, res) => {

    const { id } = req.params;
    const { title, description } = req.body;

    if (!title || title.trim() === "") {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const sql = `
        UPDATE tasks
        SET title = ?, description = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [title.trim(), description || null, id],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    message: "Failed to update task"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Task not found"
                });
            }

            res.json({
                message: "Task updated successfully"
            });
        }
    );
});


// ===============================
// MARK TASK AS COMPLETED
// ===============================
app.put("/api/tasks/:id/complete", (req, res) => {

    const { id } = req.params;

    const sql = `
        UPDATE tasks
        SET status = 'COMPLETED'
        WHERE id = ?
    `;

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to complete task"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task marked as completed"
        });
    });
});


// ===============================
// DELETE TASK
// ===============================
app.delete("/api/tasks/:id", (req, res) => {

    const { id } = req.params;

    const sql = "DELETE FROM tasks WHERE id = ?";

    db.query(sql, [id], (err, result) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                message: "Failed to delete task"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Task not found"
            });
        }

        res.json({
            message: "Task deleted successfully"
        });
    });
});


// ===============================
// START SERVER
// ===============================
const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});