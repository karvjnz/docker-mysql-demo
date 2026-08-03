CREATE DATABASE IF NOT EXISTS companydb;

USE companydb;

CREATE TABLE employees
(
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100)
);

INSERT INTO employees(name)
VALUES ('Karthik');