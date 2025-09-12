const express = require('express');
const router = express.Router();
const db = require('../../database');

// Get all testimonials
router.get('/', (req, res) => {
    db.all(`SELECT customer_name, testimonial_text, rating, created_at FROM testimonials ORDER BY created_at DESC`, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving testimonials', error: err.message });
        }
        res.json(rows);
    });
});

// Add a new testimonial
router.post('/', (req, res) => {
    const { customer_name, testimonial_text, rating } = req.body;
    if (!customer_name || !testimonial_text || !rating) {
        return res.status(400).json({ message: 'Missing required fields: customer_name, testimonial_text, and rating' });
    }

    db.run(`INSERT INTO testimonials (customer_name, testimonial_text, rating) VALUES (?, ?, ?)`,
        [customer_name, testimonial_text, rating],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error adding testimonial', error: err.message });
            }
            res.status(201).json({ message: 'Testimonial added successfully', testimonialId: this.lastID });
        }
    );
});

module.exports = router;
