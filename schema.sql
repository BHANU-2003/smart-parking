CREATE DATABASE smart_parking;
USE smart_parking;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE parking_spots (
    id VARCHAR(10) PRIMARY KEY,
    is_occupied BOOLEAN DEFAULT FALSE,
    user_id INT,
    vehicle_number VARCHAR(20),
    check_in DATETIME,
    check_out DATETIME,
    amount DECIMAL(10, 2),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE parking_history (
    id INT AUTO_INCREMENT PRIMARY KEY,
    spot_id VARCHAR(10),
    user_id INT,
    vehicle_number VARCHAR(20),
    check_in DATETIME,
    check_out DATETIME,
    amount DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (spot_id) REFERENCES parking_spots(id),
    FOREIGN KEY (user_id) REFERENCES users(id)
);