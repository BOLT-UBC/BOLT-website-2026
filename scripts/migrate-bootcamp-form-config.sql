-- Migration Script: Set Default Form Configuration for BOLT Bootcamp Event
-- Run this migration AFTER applying the schema changes from supabase-schema.sql
-- This creates a default form configuration for the existing bootcamp event

-- Note: The BOOTCAMP_EVENT_ID should match the one used in the application
-- If the UUID is different in your database, update it below

DO $$
DECLARE
    bootcamp_event_id UUID := '2d144452-6cb2-44e3-8cf3-5af2ecf46058';
    form_config_exists BOOLEAN;
BEGIN
    -- Check if form config already exists for the bootcamp event
    SELECT EXISTS (
        SELECT 1 FROM application_form_configs WHERE event_id = bootcamp_event_id
    ) INTO form_config_exists;

    -- Only insert if it doesn't exist
    IF NOT form_config_exists THEN
        -- Insert default form configuration
        INSERT INTO application_form_configs (event_id, fields)
        VALUES (
            bootcamp_event_id,
            '[
                {
                    "id": "full_name",
                    "label": "Full Name",
                    "type": "text",
                    "required": true,
                    "order": 0,
                    "profileField": "full_name",
                    "placeholder": "e.g. John Doe"
                },
                {
                    "id": "email",
                    "label": "Email",
                    "type": "email",
                    "required": true,
                    "order": 1,
                    "profileField": "email",
                    "placeholder": "name@gmail.com"
                },
                {
                    "id": "major",
                    "label": "Major",
                    "type": "text",
                    "required": true,
                    "order": 2,
                    "profileField": "major",
                    "placeholder": "e.g. Computer Science"
                },
                {
                    "id": "graduation_year",
                    "label": "Graduation Year",
                    "type": "number",
                    "required": false,
                    "order": 3,
                    "profileField": "graduation_year",
                    "placeholder": "e.g. 2027"
                },
                {
                    "id": "notes",
                    "label": "Notes",
                    "type": "textarea",
                    "required": false,
                    "order": 4,
                    "placeholder": "Anything else you would like to let us know?"
                }
            ]'::jsonb
        );
        
        RAISE NOTICE 'Form configuration created for BOLT Bootcamp event';
    ELSE
        RAISE NOTICE 'Form configuration already exists for BOLT Bootcamp event, skipping';
    END IF;

    -- Check if timeline exists for the bootcamp event
    SELECT EXISTS (
        SELECT 1 FROM event_timeline WHERE event_id = bootcamp_event_id
    ) INTO form_config_exists;

    -- Create default timeline milestones if they don't exist
    IF NOT form_config_exists THEN
        INSERT INTO event_timeline (event_id, milestone, date, is_complete, display_order)
        VALUES
            (bootcamp_event_id, 'Applications Open', NULL, false, 0),
            (bootcamp_event_id, 'Application Deadline', NULL, false, 1),
            (bootcamp_event_id, 'Decision Release', NULL, false, 2),
            (bootcamp_event_id, 'Confirmation Due', NULL, false, 3),
            (bootcamp_event_id, 'Event Day', NULL, false, 4);
        
        RAISE NOTICE 'Timeline milestones created for BOLT Bootcamp event';
    ELSE
        RAISE NOTICE 'Timeline milestones already exist for BOLT Bootcamp event, skipping';
    END IF;
END $$;

-- Verify the migration
SELECT 
    e.name as event_name,
    afc.id as form_config_id,
    jsonb_array_length(afc.fields) as field_count,
    afc.created_at as form_config_created
FROM events e
LEFT JOIN application_form_configs afc ON e.id = afc.event_id
WHERE e.name = 'BOLT Bootcamp';

SELECT 
    e.name as event_name,
    et.milestone,
    et.date,
    et.is_complete,
    et.display_order
FROM events e
JOIN event_timeline et ON e.id = et.event_id
WHERE e.name = 'BOLT Bootcamp'
ORDER BY et.display_order;
