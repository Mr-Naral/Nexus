const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

// Get tasks for a specific project
router.get('/:projectId', auth, async (req, res) => {
    try {
        const tasks = await pool.query(
            "SELECT * FROM tasks WHERE project_id = $1 ORDER BY created_at ASC",
            [req.params.projectId]
        );
        res.json(tasks.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create a task
router.post('/', auth, async (req, res) => {
    try {
        const { project_id, title, priority } = req.body;
        console.log("Creating task with data:", { project_id, title, priority });
        const newTask = await pool.query(
            "INSERT INTO tasks (project_id, title, priority) VALUES ($1, $2, $3) RETURNING *",
            [project_id, title, priority || 'Medium']
        );
        res.json(newTask.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Update task status (The "Drag & Drop" logic)
router.patch('/:id', auth, async (req, res) => {
    try {
        const { status } = req.body;
        const updatedTask = await pool.query(
            "UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *",
            [status, req.params.id]
        );
        res.json(updatedTask.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;