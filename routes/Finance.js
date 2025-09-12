const express = require('express');
const router = express.Router();
const db = require('../database');
const verifyToken = require('../middleware/auth');

// Endpoint to get a financial report (protected route)
router.get('/report', verifyToken, (req, res) => {
    // This is a simplified report. In a real-world scenario, you would track
    // services and products sold per booking for a more accurate calculation.

    let totalRevenue = 0;
    let totalCost = 0;
    let totalTax = 0;

    // Get all products sold and their costs/revenues
    db.all(`SELECT stock, cost_price, selling_price FROM products`, [], (err, products) => {
        if (err) {
            return res.status(500).json({ message: 'Error retrieving product data', error: err.message });
        }

        products.forEach(product => {
            // Assuming all products in stock represent potential profit, or a more complex
            // system would track what's sold. For this simplified report,
            // we'll assume we've "sold" some amount to get a sample.
            // A more robust system would be based on booking-product relationships.
            // Let's assume an arbitrary number of units sold to simulate sales.
            const unitsSold = Math.floor(product.stock * 0.5); // Example: 50% of stock sold
            totalRevenue += unitsSold * product.selling_price;
            totalCost += unitsSold * product.cost_price;
        });

        // Get all completed bookings to account for service revenue
        db.all(`SELECT service_type FROM bookings WHERE status = 'completed'`, [], (err, bookings) => {
            if (err) {
                return res.status(500).json({ message: 'Error retrieving booking data', error: err.message });
            }

            // Simplified service pricing
            const servicePricing = {
                'windshield_repair': 100,
                'windshield_replacement': 250,
                'side_window_repair': 80,
                'side_window_replacement': 200,
                'rear_window_repair': 90,
                'rear_window_replacement': 220
            };
            
            bookings.forEach(booking => {
                totalRevenue += servicePricing[booking.service_type] || 0;
            });

            // Calculate tax (e.g., 10% of revenue)
            totalTax = totalRevenue * 0.10;
            
            const totalProfit = totalRevenue - totalCost - totalTax;

            res.json({
                report_date: new Date().toISOString().split('T')[0],
                total_revenue: totalRevenue.toFixed(2),
                total_cost: totalCost.toFixed(2),
                total_tax: totalTax.toFixed(2),
                net_profit: totalProfit.toFixed(2),
                note: "This is a simplified report based on current stock and completed bookings. A full system would track each item sold per transaction."
            });
        });
    });
});

module.exports = router;
