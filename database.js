const sqlite3 = require('sqlite3').verbose();
const bcrypt = require('bcryptjs');

// Connect to or create the database file
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Initialize the database schema
        db.serialize(() => {
            // Drop tables if they exist to start fresh
            db.run("DROP TABLE IF EXISTS users");
            db.run("DROP TABLE IF EXISTS products");
            db.run("DROP TABLE IF EXISTS bookings");
            
            // Create the users table
            db.run(`CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )`);

            // Create a default admin user
            const salt = bcrypt.genSaltSync(10);
            const hashedPassword = bcrypt.hashSync('password123', salt);
            
            const insertUser = db.prepare(`INSERT INTO users (username, password) VALUES (?, ?)`);
            insertUser.run('admin', hashedPassword, function(err) {
                if (err) {
                    console.error("Error creating admin user: " + err.message);
                } else {
                    console.log(`Default admin user created with username 'admin'.`);
                    console.log(`Default password is 'password123'. **Please change it immediately.**`);
                }
            });
            insertUser.finalize();

            // Create the products table
            db.run(`CREATE TABLE products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                brand TEXT,
                cost_price REAL,
                selling_price REAL,
                stock INTEGER,
                category TEXT
            )`);

            // Create the bookings table
            db.run(`CREATE TABLE bookings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                customer_name TEXT,
                customer_phone TEXT,
                customer_email TEXT,
                service_type TEXT,
                car_make TEXT,
                car_model TEXT,
                date TEXT,
                time TEXT,
                status TEXT DEFAULT 'pending'
            )`);

            console.log("Database schema initialized.");
        });
    }
});

module.exports = db;
