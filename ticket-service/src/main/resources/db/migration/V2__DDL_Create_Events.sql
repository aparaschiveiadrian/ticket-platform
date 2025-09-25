-- V2__DDL_Create_Events.sql
-- Create events table

CREATE TABLE IF NOT EXISTS events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_start TIMESTAMP NOT NULL,
    event_end TIMESTAMP NOT NULL,
    location VARCHAR(255) NOT NULL,
    sales_start TIMESTAMP,
    sales_end TIMESTAMP,
    status VARCHAR(50) NOT NULL DEFAULT 'DRAFT',
    organizer_id UUID NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (organizer_id) REFERENCES users(id)
);
