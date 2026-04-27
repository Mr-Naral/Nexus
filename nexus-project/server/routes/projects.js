const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/authMiddleware');

// Get all projects for logged in user
router.get('/', auth, async (req, res) => {
    try {
        const userProjects = await pool.query(
            "SELECT * FROM projects WHERE owner_id = $1 ORDER BY created_at DESC", 
            [req.user.id]
        );
        res.json(userProjects.rows);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Create a project
router.post('/', auth, async (req, res) => {
    try {
        const { title, description} = req.body;
        const newProject = await pool.query(
            "INSERT INTO projects (owner_id, title, description) VALUES ($1, $2, $3) RETURNING *",
            [req.user.id, title, description]
        );
        res.json(newProject.rows[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;