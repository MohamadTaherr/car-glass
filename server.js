const express = require('express');
const dotenv = require('dotenv');
const db = require('./database'); // This will initialize the database
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
// Serve static files from the 'admin' directory under the /admin route
app.use('/admin', express.static(path.join(__dirname, 'admin')));


// Import routes for admin dashboard
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const bookingsRoutes = require('./routes/bookings');
const financeRoutes = require('./routes/Finance');

// Import routes for the public-facing website
const publicServicesRoutes = require('./routes/public/services');
const publicProductsRoutes = require('./routes/public/products');
const publicTestimonialsRoutes = require('./routes/public/testimonials');
const publicContactRoutes = require('./routes/public/contact');
const publicBookingsRoutes = require('./routes/public/bookings');

// Use API routes
// Admin API endpoints
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/bookings', bookingsRoutes);
app.use('/api/finance', financeRoutes);

// Public API endpoints
app.use('/api/public/services', publicServicesRoutes);
app.use('/api/public/products', publicProductsRoutes);
app.use('/api/public/testimonials', publicTestimonialsRoutes);
app.use('/api/public/contact', publicContactRoutes);
app.use('/api/public/bookings', publicBookingsRoutes);

// The root route will now serve 'public/index.html' by default

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('Database connection closed.');
        process.exit(0);
    });
});
