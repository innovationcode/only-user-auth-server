DROP DATABASE IF EXISTS user_auth_api;
CREATE DATABASE user_auth_api;
\c user_auth_api;

CREATE EXTENSION IF NOT EXISTS "UUID-OSSP";

CREATE TABLE users(
    id uuid UNIQUE DEFAULT uuid_generate_v4(),
    email VARCHAR(128) NOT NULL UNIQUE,
    password VARCHAR(128) NOT NULL,
    registered BIGINT,
    token VARCHAR(128) UNIQUE,
    createdtime BIGINT,
    emailVerified BOOLEAN,
    tokenusedbefore BOOLEAN,
    PRIMARY KEY (email)
);