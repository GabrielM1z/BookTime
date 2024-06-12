-- Table LIBRARY
CREATE TABLE IF NOT EXISTS library (
    id_library SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL
);
-- Table FORMAT
CREATE TABLE IF NOT EXISTS formats (
    id_format SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table AUTHOR
CREATE TABLE IF NOT EXISTS author (
    id_author SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Table GENRE
CREATE TABLE IF NOT EXISTS genre (
    id_genre SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Table BOOK
CREATE TABLE IF NOT EXISTS book (
    id_book SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    id_format INT,
    publisher VARCHAR(255),
    publication_date DATE,
    page_number INT,
    language VARCHAR(50),
    cover_image_url VARCHAR(255),
    FOREIGN KEY (id_format) REFERENCES formats(id_format) ON DELETE CASCADE
);

-- Table BOOK_AUTHOR (Many-to-Many relation between BOOK and AUTHOR)
CREATE TABLE IF NOT EXISTS book_author (
    id_author INT,
    id_book INT,
    PRIMARY KEY (id_author, id_book),
    FOREIGN KEY (id_author) REFERENCES author(id_author) ON DELETE CASCADE,
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
);

-- Table BOOK_GENRE (Many-to-Many relation between BOOK and GENRE)
CREATE TABLE IF NOT EXISTS book_genre (
    id_genre INT,
    id_book INT,
    PRIMARY KEY (id_genre, id_book),
    FOREIGN KEY (id_genre) REFERENCES genre(id_genre) ON DELETE CASCADE,
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
);

-- Table STATE
CREATE TABLE IF NOT EXISTS state (
    id_state SERIAL PRIMARY KEY,
    state VARCHAR(50),
    progression INT,
    read_count INT DEFAULT 0,
    last_read_date TIMESTAMP,
    id_user INT,
    id_book INT,
    is_available BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
);

-- Table LIBRARY_BOOK (Many-to-Many relation between LIBRARY and BOOK)
CREATE TABLE IF NOT EXISTS library_book (
    id_library INT,
    id_book INT,
    PRIMARY KEY (id_library, id_book),
    FOREIGN KEY (id_library) REFERENCES library(id_library) ON DELETE CASCADE,
    FOREIGN KEY (id_book) REFERENCES book(id_book) ON DELETE CASCADE
);

-- Table SHARED_LIBRARY (Many-to-Many relation between USER and LIBRARY)
CREATE TABLE IF NOT EXISTS shared_library (
    id_user INT,
    id_library INT,
    PRIMARY KEY (id_user, id_library),
    FOREIGN KEY (id_library) REFERENCES library(id_library) ON DELETE CASCADE
);
