-- Create the database
CREATE DATABASE IF NOT EXISTS pet_app;
USE pet_app;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    phone VARCHAR(20)
);

-- Pets table
CREATE TABLE IF NOT EXISTS pets (
    pet_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100),
    age INT,
    photo_url TEXT,
    medical_summary TEXT,
    owner_id INT,
    FOREIGN KEY (owner_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Folders table
CREATE TABLE IF NOT EXISTS folders (
    folder_id INT AUTO_INCREMENT PRIMARY KEY,
    folder_name VARCHAR(100) NOT NULL,
    pet_id INT,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
    document_id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    file_url TEXT,
    folder_id INT,
    pet_id INT,
    FOREIGN KEY (folder_id) REFERENCES folders(folder_id) ON DELETE CASCADE,
    FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON DELETE CASCADE
);
