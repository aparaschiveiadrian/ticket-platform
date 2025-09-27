-- V8__DDL_Create_User_Staffing_Events.sql
-- Create user_staffing_events junction table

CREATE TABLE IF NOT EXISTS user_staffing_events (
    user_id UUID NOT NULL,
    event_id UUID NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (event_id) REFERENCES events(id)
);

