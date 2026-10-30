-- CSE 340 Service Network: database setup
-- Re-runnable: drops existing tables, then recreates them and inserts sample data.

DROP TABLE IF EXISTS project_category;
DROP TABLE IF EXISTS project;
DROP TABLE IF EXISTS category;
DROP TABLE IF EXISTS organization;

-- Organizations
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);

INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');

-- Service projects (each belongs to exactly one organization)
CREATE TABLE project (
    project_id SERIAL PRIMARY KEY,
    organization_id INTEGER NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(200) NOT NULL,
    date DATE NOT NULL,
    CONSTRAINT fk_project_organization
        FOREIGN KEY (organization_id) REFERENCES organization (organization_id)
);

INSERT INTO project (organization_id, title, description, location, date)
VALUES
(1, 'Community Garden Shed Build', 'Build a tool shed for the neighborhood community garden.', 'Maple Street Community Center', '2026-11-14'),
(1, 'Playground Renovation', 'Repair and repaint equipment at the neighborhood playground.', 'Riverside Park', '2026-12-05'),
(1, 'Bus Stop Shelter Repair', 'Repair benches and roofing on local bus shelters.', 'Downtown Transit Hub', '2027-01-16'),
(1, 'Home Weatherization Day', 'Help seal windows and doors for families before winter ends.', 'Oakwood Neighborhood', '2027-02-20'),
(1, 'Park Pathway Restoration', 'Resurface and widen walking paths for accessibility.', 'Cedar Grove Park', '2027-03-13'),

(2, 'Urban Farm Planting Day', 'Plant winter crops with the GreenHarvest team.', 'Eastside Urban Farm', '2026-11-21'),
(2, 'Composting Workshop', 'Teach neighbors how to start a home compost system.', 'Library Annex', '2026-12-12'),
(2, 'School Garden Setup', 'Build raised beds and plant a learning garden with students.', 'Lincoln Elementary', '2027-01-23'),
(2, 'Neighborhood Harvest Market', 'Run a pop-up market sharing fresh local produce.', 'Central Square', '2027-02-27'),
(2, 'Fruit Tree Planting', 'Plant fruit trees along the community greenway.', 'Willow Creek Greenway', '2027-03-20'),

(3, 'Food Pantry Sorting Shift', 'Sort and pack donated food for local families.', 'Community Food Bank', '2026-11-18'),
(3, 'Winter Coat Drive', 'Collect and distribute warm coats for those in need.', 'Unity Hall', '2026-12-10'),
(3, 'Neighborhood Cleanup', 'Pick up litter and clear debris around the district.', 'Harbor District', '2027-01-30'),
(3, 'Senior Visit Program', 'Spend an afternoon visiting and playing games with seniors.', 'Sunrise Care Home', '2027-02-13'),
(3, 'Volunteer Orientation Night', 'Train new volunteers on available service opportunities.', 'Unity Hall', '2027-03-06');

-- Categories
CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

INSERT INTO category (name)
VALUES
('Environment'),
('Education'),
('Community Infrastructure'),
('Food Security'),
('Social Support');

-- Many-to-many: a project can have several categories, and a category many projects
CREATE TABLE project_category (
    project_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    PRIMARY KEY (project_id, category_id),
    CONSTRAINT fk_project_category_project
        FOREIGN KEY (project_id) REFERENCES project (project_id) ON DELETE CASCADE,
    CONSTRAINT fk_project_category_category
        FOREIGN KEY (category_id) REFERENCES category (category_id) ON DELETE CASCADE
);

INSERT INTO project_category (project_id, category_id)
VALUES
(1, 3),
(2, 3),
(3, 3),
(4, 3), (4, 1),
(5, 3), (5, 1),
(6, 4), (6, 1),
(7, 2), (7, 1),
(8, 2), (8, 4),
(9, 4),
(10, 1),
(11, 4), (11, 5),
(12, 5),
(13, 1), (13, 5),
(14, 5),
(15, 2), (15, 5);