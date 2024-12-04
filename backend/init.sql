-- Créer la base de données pour Keycloak
CREATE DATABASE keycloak_db;

-- Créer la base de données pour le service Book
CREATE DATABASE book_db;

\connect book_db;

-- Activer l'extension pgcrypto si ce n'est pas déjà fait
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Table LIBRARY
CREATE TABLE IF NOT EXISTS library (
    id_library UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
-- Table FORMAT
CREATE TABLE IF NOT EXISTS formats (
    id_format UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table AUTHOR
CREATE TABLE IF NOT EXISTS author (
    id_author UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Table GENRE
CREATE TABLE IF NOT EXISTS genre (
    id_genre UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table BOOK
CREATE TABLE IF NOT EXISTS book (
    id_book UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    isbn13 VARCHAR(13),
    id_format UUID,
    publisher VARCHAR(255),
    publication_date DATE,
    page_number INT,
    language VARCHAR(50),
    cover_image_url VARCHAR(255),
    FOREIGN KEY (id_format) REFERENCES formats(id_format) ON DELETE CASCADE
);

-- Table BOOK_AUTHOR (Many-to-Many relation between BOOK and AUTHOR)
CREATE TABLE IF NOT EXISTS book_author (
    id_author UUID,
    id_book UUID,
    PRIMARY KEY (id_author, id_book),
    FOREIGN KEY (id_author) REFERENCES author(id_author) ON DELETE CASCADE,
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
);

-- Table BOOK_GENRE (Many-to-Many relation between BOOK and GENRE)
CREATE TABLE IF NOT EXISTS book_genre (
    id_genre UUID,
    id_book UUID,
    PRIMARY KEY (id_genre, id_book),
    FOREIGN KEY (id_genre) REFERENCES genre(id_genre) ON DELETE CASCADE,
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
);

-- Table STATE
CREATE TABLE IF NOT EXISTS state (
    state VARCHAR(50),
    progression INT,
    read_count INT DEFAULT 0,
    last_read_date TIMESTAMP,
    id_user UUID,
    id_book UUID,
    is_available BOOLEAN DEFAULT FALSE,
    PRIMARY KEY (id_user, id_book),
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
);

-- Table LIBRARY_BOOK (Many-to-Many relation between LIBRARY and BOOK)
CREATE TABLE IF NOT EXISTS library_book (
    id_library UUID,
    id_book UUID,
    PRIMARY KEY (id_library, id_book),
    FOREIGN KEY (id_library) REFERENCES library(id_library) ON DELETE CASCADE,
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
);

-- Table SHARED_LIBRARY (Many-to-Many relation between USER and LIBRARY)
CREATE TABLE IF NOT EXISTS shared_library (
    id_user UUID,
    id_library UUID,
    PRIMARY KEY (id_user, id_library),
    FOREIGN KEY (id_library) REFERENCES library(id_library) ON DELETE CASCADE
);

-- Table ACTION
CREATE TABLE IF NOT EXISTS action (
    id_action UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    id_user UUID,
    table_name VARCHAR(50),
    date TIMESTAMP,
    type VARCHAR(50),
    action JSON,
    executed_by VARCHAR(6)
);

-- Créer la base de données pour le service Book
CREATE DATABASE user_db;

\connect user_db;

-- Table USER
-- A refaire ==> mauvais format (Matthieu <3)
CREATE TABLE IF NOT EXISTS user (
    id_user SERIAL PRIMARY KEY,
    id_keycloak VARCHAR(255) UNIQUE,
    user_name VARCHAR(255) UNIQUE NOT NULL,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    birthdate DATE NOT NULL
);