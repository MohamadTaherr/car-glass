const express = require('express');
const router = express.Router();
const db = require('../../database');

// Get all services
router.get('/', (req, res) => {
    db.all(`SELECT name, description, estimated_duration FROM services`, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving services', error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;
