const express = require('express');
const router = express.Router();

// Endpoint for handling contact form submissions
router.post('/', (req, res) => {
    const { name, email, message } = req.body;
    if (!name || !email || !message) {
        return res.status(400).json({ message: 'Missing required fields: name, email, and message' });
    }

    // In a real application, you would send an email here or save to a database
    // For now, we'll just log the submission to the console
    console.log(`New contact form submission:
        Name: ${name}
        Email: ${email}
        Message: ${message}`);

    res.status(200).json({ message: 'Contact message received successfully.' });
});

module.exports = router;
