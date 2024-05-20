-- Ubuntu PostgreSQL Install
sudo apt update
sudo apt install postgresql
-- Once PostgreSQL is installed, you can start the PostgreSQL server and enable it to start on boot:
sudo systemctl start postgresql
sudo systemctl enable postgresql

--By default, PostgreSQL creates a user named postgres. You can switch to the postgres user by running:
sudo su postgres

psql -U postgres

-- Create users database
create database db_users;
\connect db_users

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

--Users table
CREATE TABLE users (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  username VARCHAR(255),
  role VARCHAR(10) NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

--Devices table
CREATE TABLE devices (
  device_id SERIAL PRIMARY KEY,
  device_model VARCHAR(50) NOT NULL,
  sim_num VARCHAR(20) NOT NULL,
  location VARCHAR(50),
  device_token VARCHAR(100) NOT NULL,
  crit_level INT NOT NULL DEFAULT 250,
  crit_temperature INT NOT NULL DEFAULT 35,
  crit_pressure INT NOT NULL DEFAULT 80,
  user_id uuid,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Create devices database
CREATE DATABASE db_devices;
\connect db_devices;

CREATE TABLE device_data (
  temperature NUMERIC NOT NULL,
  water_level NUMERIC  NOT NULL,
  pressure NUMERIC NOT NULL,
  electricity BOOLEAN NOT NULL,
  device_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX device_data_device_id_idx ON device_data (device_id);
CREATE INDEX device_data_created_at_idx ON device_data (created_at);

-- Creating users and assigning privileges
CREATE USER usersaccount WITH PASSWORD 'password';
CREATE USER devicesaccount WITH PASSWORD 'password';

-- privileges for working with databases (I recommend using only the necessary functions (reading or writing)
GRANT ALL PRIVILEGES ON DATABASE db_users TO usersaccount;
GRANT ALL PRIVILEGES ON DATABASE db_devices TO usersaccount;
GRANT ALL PRIVILEGES ON DATABASE db_users TO devicesaccount;
GRANT ALL PRIVILEGES ON DATABASE db_devices TO devicesaccount;