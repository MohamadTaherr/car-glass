const express = require('express');
const router = express.Router();
const db = require('../../database');

// Get all products for the public view
// We only return public-facing data (no cost_price)
router.get('/', (req, res) => {
    db.all(`SELECT brand, part_number, description, selling_price FROM products`, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving products', error: err.message });
        }
        res.json(rows);
    });
});

module.exports = router;
