const express = require('express');
const router = express.Router();
const db = require('../../database');

// Endpoint for customer to submit a new booking request
router.post('/', (req, res) => {
    const { customer_name, customer_email, customer_phone, car_make, car_model, license_plate, service_type, preferred_date, preferred_time } = req.body;

    if (!customer_name || !customer_phone || !service_type) {
        return res.status(400).json({ message: 'Missing required fields: customer name, phone number, and service type' });
    }

    db.run(`INSERT INTO bookings (customer_name, customer_email, customer_phone, car_make, car_model, license_plate, service_type, preferred_date, preferred_time) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [customer_name, customer_email, customer_phone, car_make, car_model, license_plate, service_type, preferred_date, preferred_time],
        function(err) {
            if (err) {
                return res.status(500).json({ message: 'Error submitting booking', error: err.message });
            }
            res.status(201).json({ message: 'Booking submitted successfully', bookingId: this.lastID });
        }
    );
});

module.exports = router;
