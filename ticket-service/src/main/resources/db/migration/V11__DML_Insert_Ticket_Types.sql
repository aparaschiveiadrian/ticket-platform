-- V11__DML_Insert_Ticket_Types.sql
-- Insert sample ticket types for the events

-- Tech Conference 2024 Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'Early Bird', 'Early bird discount ticket with full conference access', 99.99, 50, '660e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440002', 'Regular', 'Standard conference ticket with full access', 149.99, 200, '660e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440003', 'VIP', 'VIP ticket with premium seating, lunch, and networking session', 299.99, 25, '660e8400-e29b-41d4-a716-446655440001', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Summer Music Festival 2024 Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440004', 'Single Day Pass', 'Access to one day of the festival', 75.00, 500, '660e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440005', 'Weekend Pass', 'Access to all three days of the festival', 180.00, 1000, '660e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440006', 'VIP Weekend', 'VIP access with backstage passes and premium viewing area', 450.00, 100, '660e8400-e29b-41d4-a716-446655440002', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Business Workshop Series Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440007', 'Full Series', 'Access to all 7 workshops in the series', 350.00, 30, '660e8400-e29b-41d4-a716-446655440003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440008', 'Individual Workshop', 'Access to one workshop of your choice', 65.00, 50, '660e8400-e29b-41d4-a716-446655440003', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Art Exhibition Opening Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440009', 'General Admission', 'Standard admission to the exhibition opening', 25.00, 100, '660e8400-e29b-41d4-a716-446655440004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440010', 'Premium Experience', 'Includes guided tour and meet & greet with artists', 75.00, 20, '660e8400-e29b-41d4-a716-446655440004', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Food & Wine Tasting Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440011', 'Standard Tasting', 'Access to all tasting stations and basic wine selection', 85.00, 80, '660e8400-e29b-41d4-a716-446655440005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440012', 'Premium Tasting', 'Includes premium wines and chef meet & greet', 150.00, 30, '660e8400-e29b-41d4-a716-446655440005', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Basketball Championship Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440013', 'Upper Level', 'Upper level seating with good view of the court', 45.00, 500, '660e8400-e29b-41d4-a716-446655440006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440014', 'Lower Level', 'Lower level seating with excellent view', 85.00, 300, '660e8400-e29b-41d4-a716-446655440006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440015', 'Courtside', 'Premium courtside seating with exclusive amenities', 250.00, 50, '660e8400-e29b-41d4-a716-446655440006', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Comedy Show Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440016', 'General Admission', 'Standard seating for the comedy show', 35.00, 150, '660e8400-e29b-41d4-a716-446655440008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440017', 'VIP Table', 'VIP table seating with bottle service', 120.00, 10, '660e8400-e29b-41d4-a716-446655440008', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Yoga Retreat Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440018', 'Standard Retreat', 'Full weekend retreat including meals and activities', 280.00, 25, '660e8400-e29b-41d4-a716-446655440009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440019', 'Premium Retreat', 'Includes private sessions and luxury accommodations', 450.00, 10, '660e8400-e29b-41d4-a716-446655440009', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

-- Gaming Tournament Ticket Types
INSERT INTO ticket_types (id, name, description, price, total_available, event_id, created_at, updated_at, version) VALUES
    ('770e8400-e29b-41d4-a716-446655440020', 'Spectator', 'Watch the tournament and visit gaming booths', 20.00, 200, '660e8400-e29b-41d4-a716-446655440010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440021', 'Participant', 'Enter the tournament and compete for prizes', 50.00, 100, '660e8400-e29b-41d4-a716-446655440010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0),
    ('770e8400-e29b-41d4-a716-446655440022', 'VIP Experience', 'Includes tournament entry, premium seating, and merchandise', 100.00, 25, '660e8400-e29b-41d4-a716-446655440010', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 0);

