CREATE DATABASE IF NOT EXISTS companydb;

USE companydb;

CREATE TABLE queries
(
    id INT AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(100) NOT NULL,

    email VARCHAR(150) NOT NULL,

    phone VARCHAR(30),

    country VARCHAR(100),

    message VARCHAR(1000),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);