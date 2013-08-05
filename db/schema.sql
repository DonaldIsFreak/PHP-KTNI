-- Create View timestamp
CREATE VIEW IF NOT EXISTS TIMESTAMP AS SELECT round((julianday('now')-2440587.5)*86400) AS Today;

-- Create Table KTNI_IDEAS And Insert Data.
DROP TABLE IF EXISTS ktni_ideas;
CREATE TABLE IF NOT EXISTS ktni_ideas (
	id	INTEGER PRIMARY KEY,
	comment VARCHAR(50) NOT NULL DEFAULT 'No Any Ideas.',
	position VARCHAR(5) NOT NULL DEFAULT 'one',
	created_date INT(20) DEFAULT 0,
	updated_date INT(20) DEFAULT 0
);

-- Create Table KTNI_TAG Table And Insert Table.
DROP TABLE IF EXISTS ktni_tags;
CREATE TABLE IF NOT EXISTS ktni_tags (
	id INTEGER PRIMARY KEY,
	name VARCHAR(20) NOT NULL DEFAULT 'tags',
	comment VARCHAR(20),
	created_date INT(20) DEFAULT 0
);

-- Create Table KTNI_TAGGING Table And Insert Table.
DROP TABLE IF EXISTS ktni_tagging;
CREATE TABLE IF NOT EXISTS ktni_tagging (
	id INTEGER PRIMARY KEY,
	tag_id INT(20) NOT NULL DEFAULT 0,
	idea_id INT(20) NOT NULL DEFAULT 0,
	created_date INT(20) DEFAULT 0,
	is_enable	INT(1) DEFAULT 1
);