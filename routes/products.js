const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/auth');

// Get all products (protected route)
router.get('/', verifyToken, (req, res) => {
    db.all('SELECT * FROM products', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
        res.json(rows);
    });
});

// Add a new product (protected route)
router.post('/', verifyToken, (req, res) => {
    const { name, brand, cost_price, selling_price, stock, category } = req.body;

    if (!name || !brand || !cost_price || !selling_price || !stock) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const insert = db.prepare(`INSERT INTO products (name, brand, cost_price, selling_price, stock, category) VALUES (?, ?, ?, ?, ?, ?)`);
    insert.run(name, brand, cost_price, selling_price, stock, category || null, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error adding product', error: err.message });
        }
        res.status(201).json({ message: 'Product added successfully', id: this.lastID });
    });
    insert.finalize();
});

module.exports = router;
