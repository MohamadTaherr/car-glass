const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/auth');

// Get all bookings (protected route for admin)
router.get('/', verifyToken, (req, res) => {
    db.all('SELECT * FROM bookings ORDER BY date, time', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
        res.json(rows);
    });
});

// Get a single booking by ID (protected route for admin)
router.get('/:id', verifyToken, (req, res) => {
    const { id } = req.params;
    db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Internal server error', error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json(row);
    });
});

// Add a new booking (public route for customers)
router.post('/', (req, res) => {
    const { customer_name, customer_phone, customer_email, service_type, car_make, car_model, date, time } = req.body;

    if (!customer_name || !customer_phone || !service_type || !date || !time) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    const insert = db.prepare(`
        INSERT INTO bookings (customer_name, customer_phone, customer_email, service_type, car_make, car_model, date, time)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insert.run(customer_name, customer_phone, customer_email || null, service_type, car_make || null, car_model || null, date, time, function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error creating booking', error: err.message });
        }
        res.status(201).json({ message: 'Booking created successfully', id: this.lastID });
    });
    insert.finalize();
});

// Update booking status (protected route for admin)
router.put('/:id', verifyToken, (req, res) => {
    const { status } = req.body;
    const { id } = req.params;

    if (!status) {
        return res.status(400).json({ message: 'Status is required' });
    }

    const validStatuses = ['pending', 'accepted', 'rescheduled', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status provided' });
    }

    db.run(`UPDATE bookings SET status = ? WHERE id = ?`, [status, id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error updating booking status', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking status updated successfully' });
    });
});

// Delete a booking (protected route for admin)
router.delete('/:id', verifyToken, (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM bookings WHERE id = ?`, [id], function(err) {
        if (err) {
            return res.status(500).json({ message: 'Error deleting booking', error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.json({ message: 'Booking deleted successfully' });
    });
});

module.exports = router;
