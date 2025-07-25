-- Migration for initial quickpoll schema

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(40) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(256) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS polls (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER REFERENCES users(id),
    question TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS poll_options (
    id SERIAL PRIMARY KEY,
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_text VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS votes (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    poll_id INTEGER REFERENCES polls(id) ON DELETE CASCADE,
    option_id INTEGER REFERENCES poll_options(id) ON DELETE CASCADE,
    voted_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, poll_id)
);
