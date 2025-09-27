-- V7__DDL_Create_User_Attending_Events.sql
-- Create user_attending_events junction table

CREATE TABLE IF NOT EXISTS user_attending_events (
    user_id UUID NOT NULL,
    event_id UUID NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

