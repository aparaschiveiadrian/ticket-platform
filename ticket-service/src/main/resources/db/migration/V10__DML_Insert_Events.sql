-- V10__DML_Insert_Events.sql
-- Insert sample events with various organizers

-- Event 1: Tech Conference 2024
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 
     'Tech Conference 2024', 
     'Annual technology conference featuring the latest trends in software development, AI, and cloud computing. Join industry leaders for insightful talks and networking opportunities.',
     '2024-12-15 09:00:00', 
     '2024-12-15 18:00:00', 
     'Convention Center Downtown', 
     '2024-10-01 00:00:00', 
     '2024-12-14 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440001', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 2: Music Festival Summer
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440002', 
     'Summer Music Festival 2024', 
     'Three-day outdoor music festival featuring top artists from around the world. Food trucks, art installations, and unforgettable performances await!',
     '2024-07-20 14:00:00', 
     '2024-07-22 23:00:00', 
     'Central Park Amphitheater', 
     '2024-05-01 00:00:00', 
     '2024-07-19 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440002', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 3: Business Workshop Series
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440003', 
     'Entrepreneurship Workshop Series', 
     'Weekly workshops covering business planning, funding strategies, marketing, and scaling your startup. Perfect for aspiring entrepreneurs.',
     '2024-11-05 18:00:00', 
     '2024-12-17 20:00:00', 
     'Business Innovation Hub', 
     '2024-09-15 00:00:00', 
     '2024-11-04 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440003', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 4: Art Exhibition Opening
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440004', 
     'Modern Art Exhibition: Digital Dreams', 
     'Contemporary art exhibition showcasing digital and mixed-media works from emerging artists. Interactive installations and guided tours available.',
     '2024-10-25 19:00:00', 
     '2024-10-25 22:00:00', 
     'Modern Art Gallery', 
     '2024-09-01 00:00:00', 
     '2024-10-24 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440004', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 5: Food & Wine Tasting
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440005', 
     'Gourmet Food & Wine Tasting', 
     'Exclusive tasting event featuring local chefs and winemakers. Sample exquisite dishes paired with premium wines from regional vineyards.',
     '2024-11-30 18:30:00', 
     '2024-11-30 22:00:00', 
     'Grand Hotel Ballroom', 
     '2024-10-01 00:00:00', 
     '2024-11-29 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440005', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 6: Sports Championship
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440006', 
     'City Basketball Championship Finals', 
     'Championship game between the top two teams. Half-time entertainment, food vendors, and championship merchandise available.',
     '2024-12-08 19:00:00', 
     '2024-12-08 22:00:00', 
     'City Sports Arena', 
     '2024-11-01 00:00:00', 
     '2024-12-07 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440006', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 7: Educational Seminar (Draft status)
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440007', 
     'Climate Change & Sustainability Seminar', 
     'Educational seminar discussing climate science, sustainable practices, and environmental policies. Expert speakers and interactive sessions.',
     '2025-01-15 10:00:00', 
     '2025-01-15 16:00:00', 
     'University Conference Hall', 
     NULL, 
     NULL, 
     'DRAFT', 
     '550e8400-e29b-41d4-a716-446655440007', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 8: Comedy Show
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440008', 
     'Stand-up Comedy Night', 
     'An evening of laughter with top comedians from the local scene. Bar service available. 18+ event.',
     '2024-12-22 20:00:00', 
     '2024-12-22 23:00:00', 
     'Comedy Club Downtown', 
     '2024-11-15 00:00:00', 
     '2024-12-21 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440008', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 9: Yoga Retreat
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440009', 
     'Weekend Yoga Retreat', 
     'Relaxing weekend retreat featuring yoga sessions, meditation, healthy meals, and nature walks. All levels welcome.',
     '2024-11-16 08:00:00', 
     '2024-11-17 17:00:00', 
     'Mountain Retreat Center', 
     '2024-09-01 00:00:00', 
     '2024-11-15 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440009', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

-- Event 10: Gaming Tournament
INSERT INTO events (id, name, description, event_start, event_end, location, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('660e8400-e29b-41d4-a716-446655440010', 
     'Esports Gaming Tournament', 
     'Competitive gaming tournament featuring popular titles. Cash prizes for winners, gaming equipment showcase, and food vendors.',
     '2024-12-28 10:00:00', 
     '2024-12-28 20:00:00', 
     'Gaming Center Arena', 
     '2024-11-01 00:00:00', 
     '2024-12-27 23:59:59', 
     'PUBLISHED', 
     '550e8400-e29b-41d4-a716-446655440010', 
     CURRENT_TIMESTAMP, 
     CURRENT_TIMESTAMP);

