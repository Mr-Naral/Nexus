const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

// SIGNUP
router.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );
        
        res.json(newUser.rows[0]);
    } catch (err) {
        res.status(500).send("Server Error: " + err.message);
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

        if (user.rows.length === 0) return res.status(401).json("Invalid Credentials");

        const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
        if (!validPassword) return res.status(401).json("Invalid Credentials");

        const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token, user: { id: user.rows[0].id, name: user.rows[0].name } });
    } catch (err) {
        res.status(500).send("Server Error");
    }
});

module.exports = router;