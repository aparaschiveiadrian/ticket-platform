-- V9__DML_Insert_Users.sql
-- Insert 50 sample users for testing (UUIDs match Keycloak users)

-- 10 Organizers
INSERT INTO users (id, username, email, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'organizer1', 'organizer1@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440002', 'organizer2', 'organizer2@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440003', 'organizer3', 'organizer3@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440004', 'organizer4', 'organizer4@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440005', 'organizer5', 'organizer5@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440006', 'organizer6', 'organizer6@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440007', 'organizer7', 'organizer7@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440008', 'organizer8', 'organizer8@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440009', 'organizer9', 'organizer9@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440010', 'organizer10', 'organizer10@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 10 Staff members
INSERT INTO users (id, username, email, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440011', 'staff1', 'staff1@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440012', 'staff2', 'staff2@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440013', 'staff3', 'staff3@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440014', 'staff4', 'staff4@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440015', 'staff5', 'staff5@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440016', 'staff6', 'staff6@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440017', 'staff7', 'staff7@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440018', 'staff8', 'staff8@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440019', 'staff9', 'staff9@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440020', 'staff10', 'staff10@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- 30 Attendees
INSERT INTO users (id, username, email, created_at, updated_at) VALUES
    ('550e8400-e29b-41d4-a716-446655440021', 'attendee1', 'attendee1@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440022', 'attendee2', 'attendee2@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440023', 'attendee3', 'attendee3@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440024', 'attendee4', 'attendee4@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440025', 'attendee5', 'attendee5@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440026', 'attendee6', 'attendee6@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440027', 'attendee7', 'attendee7@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440028', 'attendee8', 'attendee8@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440029', 'attendee9', 'attendee9@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440030', 'attendee10', 'attendee10@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440031', 'attendee11', 'attendee11@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440032', 'attendee12', 'attendee12@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440033', 'attendee13', 'attendee13@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440034', 'attendee14', 'attendee14@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440035', 'attendee15', 'attendee15@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440036', 'attendee16', 'attendee16@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440037', 'attendee17', 'attendee17@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440038', 'attendee18', 'attendee18@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440039', 'attendee19', 'attendee19@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440040', 'attendee20', 'attendee20@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440041', 'attendee21', 'attendee21@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440042', 'attendee22', 'attendee22@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440043', 'attendee23', 'attendee23@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440044', 'attendee24', 'attendee24@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440045', 'attendee25', 'attendee25@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440046', 'attendee26', 'attendee26@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440047', 'attendee27', 'attendee27@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440048', 'attendee28', 'attendee28@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440049', 'attendee29', 'attendee29@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
    ('550e8400-e29b-41d4-a716-446655440050', 'attendee30', 'attendee30@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
