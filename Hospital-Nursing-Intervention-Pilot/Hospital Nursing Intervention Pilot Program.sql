-- ============================================================
-- ACME Integrated Delivery System
-- Hospital Nursing Intervention Pilot Program
-- Business Insights Group
-- ============================================================
-- This script supports a data-driven site selection for a
-- nursing intervention pilot targeting ICU and SICU units.
-- It covers schema design, data validation, and two rounds
-- of analytical queries to identify optimal pilot hospitals.
-- ============================================================


-- ============================================================
-- SECTION 1: TABLE CREATION AND DATA IMPORT
-- ============================================================
-- The three tables were created and populated using the MySQL
-- Workbench Table Data Import Wizard. The process was:
--
-- 1. Open MySQL Workbench and connect to the local MySQL
--    server instance.
--
-- 2. Create a new database to hold the project tables:
--    CREATE DATABASE hospital_pilot;
--    USE hospital_pilot;
--
-- 3. In the left Navigator panel under Schemas, right-click
--    the database name and select "Table Data Import Wizard."
--
-- 4. Browse to the CSV file location, select the file, and
--    follow the wizard prompts. The wizard reads the CSV
--    headers and creates a table with matching column names.
--    It auto-detects data types based on the values (e.g.,
--    integers for bed counts, text for names and IDs).
--
-- 5. Repeat for each CSV file. The import order does not
--    matter at this stage because foreign keys have not been
--    defined yet. The three imports:
--      bed_type.csv   -> bed_type table   (20 rows)
--      business.csv   -> business table   (22,202 rows)
--      bed_fact.csv   -> bed_fact table   (51,458 rows)
--
-- 6. After import, verify row counts:
--    SELECT COUNT(*) FROM bed_type;     -- expected: 20
--    SELECT COUNT(*) FROM business;     -- expected: 22,202
--    SELECT COUNT(*) FROM bed_fact;     -- expected: 51,458
--
-- Note: The Import Wizard sets column types automatically.
-- In some cases it assigns TEXT instead of VARCHAR, which
-- prevents primary key creation. The MODIFY statements
-- below correct this before adding keys.
-- ============================================================


-- ============================================================
-- SECTION 2: STAR SCHEMA DESIGN
-- ============================================================
-- A star schema organizes data into a central fact table
-- surrounded by dimension tables. The fact table holds the
-- measurable numbers (bed counts) and the dimension tables
-- hold the descriptive labels (hospital names, bed types).
--
-- The schema for this project:
--
--   [dim] business           [dim] bed_type
--     ims_org_id (PK)          bed_id (PK)
--     business_name            bed_code
--     bed_cluster_id           bed_desc
--         |                        |
--         |     [fact] bed_fact    |
--         +---> ims_org_id (FK) <--+
--               bed_id (FK) -------+
--               license_beds
--               census_beds
--               staffed_beds
--
-- The foreign keys in the fact table reference the primary
-- keys in each dimension table. This enforces referential
-- integrity: MySQL will reject any fact row that references
-- a hospital or bed type that does not exist in the
-- corresponding dimension table.
--
-- The star schema was also visualized as an EER diagram
-- using MySQL Workbench's Reverse Engineer feature:
--   Database menu > Reverse Engineer > select connection >
--   select database > finish. The resulting diagram shows
--   the three tables with relationship lines drawn between
--   the foreign key and primary key columns. Text labels
--   were added above each table to identify which is the
--   fact table and which are dimension tables.
-- ============================================================

-- Fix column types that the Import Wizard set as TEXT.
-- TEXT columns cannot be used as primary or foreign keys
-- so they must be converted to VARCHAR first.
ALTER TABLE business MODIFY ims_org_id VARCHAR(20);
ALTER TABLE bed_fact MODIFY ims_org_id VARCHAR(20);
ALTER TABLE bed_fact MODIFY bed_id INT;

-- Primary keys on dimension tables
ALTER TABLE bed_type ADD PRIMARY KEY (bed_id);
ALTER TABLE business ADD PRIMARY KEY (ims_org_id);

-- Foreign keys on fact table linking to dimensions.
-- These must be added after the primary keys exist.
-- The dimension tables must be populated first so that
-- every foreign key value in bed_fact has a matching
-- primary key in the parent table.
ALTER TABLE bed_fact
    ADD FOREIGN KEY (ims_org_id) REFERENCES business(ims_org_id),
    ADD FOREIGN KEY (bed_id) REFERENCES bed_type(bed_id);


-- ============================================================
-- SECTION 3: DATA VALIDATION
-- Before running any analysis, these queries verify the
-- integrity and quality of the data. This is standard
-- practice to ensure analytical results are trustworthy.
-- ============================================================

-- 3a. Row counts to confirm expected data volume
SELECT 'business' AS table_name, COUNT(*) AS row_count FROM business
UNION ALL
SELECT 'bed_type', COUNT(*) FROM bed_type
UNION ALL
SELECT 'bed_fact', COUNT(*) FROM bed_fact;

-- 3b. Check for NULL values in key columns
-- A NULL in a key column would break joins and aggregations
SELECT
    SUM(CASE WHEN ims_org_id IS NULL THEN 1 ELSE 0 END) AS null_org_ids,
    SUM(CASE WHEN bed_id IS NULL THEN 1 ELSE 0 END)     AS null_bed_ids,
    SUM(CASE WHEN license_beds IS NULL THEN 1 ELSE 0 END) AS null_license,
    SUM(CASE WHEN census_beds IS NULL THEN 1 ELSE 0 END)  AS null_census,
    SUM(CASE WHEN staffed_beds IS NULL THEN 1 ELSE 0 END) AS null_staffed
FROM bed_fact;

-- 3c. Check for duplicate primary keys
-- Duplicates would inflate aggregated totals
SELECT ims_org_id, COUNT(*) AS cnt
FROM business
GROUP BY ims_org_id
HAVING cnt > 1;

SELECT bed_id, COUNT(*) AS cnt
FROM bed_type
GROUP BY bed_id
HAVING cnt > 1;

-- 3d. Check for orphan records in the fact table
-- An orphan is a foreign key value that has no matching
-- primary key in the parent dimension table
SELECT f.ims_org_id
FROM bed_fact f
LEFT JOIN business b ON f.ims_org_id = b.ims_org_id
WHERE b.ims_org_id IS NULL;

SELECT f.bed_id
FROM bed_fact f
LEFT JOIN bed_type bt ON f.bed_id = bt.bed_id
WHERE bt.bed_id IS NULL;


-- ============================================================
-- SECTION 4: ANALYSIS ROUND 1
-- ICU OR SICU BED VOLUME
-- Identifies hospitals with the highest combined ICU (bed_id=4)
-- and/or SICU (bed_id=15) bed counts. A hospital needs only
-- one of the two bed types to qualify.
-- ============================================================

-- Top 10 hospitals by total ICU/SICU licensed beds
SELECT
    b.business_name            AS hospital_name,
    SUM(f.license_beds)        AS total_license_beds
FROM bed_fact f
JOIN business b ON f.ims_org_id = b.ims_org_id
WHERE f.bed_id IN (4, 15)
GROUP BY b.business_name
ORDER BY total_license_beds DESC
LIMIT 10;

-- Top 10 hospitals by total ICU/SICU census beds
SELECT
    b.business_name            AS hospital_name,
    SUM(f.census_beds)         AS total_census_beds
FROM bed_fact f
JOIN business b ON f.ims_org_id = b.ims_org_id
WHERE f.bed_id IN (4, 15)
GROUP BY b.business_name
ORDER BY total_census_beds DESC
LIMIT 10;

-- Top 10 hospitals by total ICU/SICU staffed beds
SELECT
    b.business_name            AS hospital_name,
    SUM(f.staffed_beds)        AS total_staffed_beds
FROM bed_fact f
JOIN business b ON f.ims_org_id = b.ims_org_id
WHERE f.bed_id IN (4, 15)
GROUP BY b.business_name
ORDER BY total_staffed_beds DESC
LIMIT 10;


-- ============================================================
-- SECTION 5: ANALYSIS ROUND 2
-- HOSPITALS WITH BOTH ICU AND SICU BEDS
-- Only hospitals operating at least 1 ICU bed AND at least
-- 1 SICU bed are included. This narrows the pool from ~3,400
-- hospitals to 179, surfacing dual critical care facilities.
-- ============================================================

-- Top 10 hospitals by licensed beds (both ICU & SICU required)
SELECT
    b.business_name            AS hospital_name,
    SUM(f.license_beds)        AS total_license_beds
FROM bed_fact f
JOIN business b ON f.ims_org_id = b.ims_org_id
WHERE f.bed_id IN (4, 15)
  AND f.ims_org_id IN (
      SELECT ims_org_id FROM bed_fact WHERE bed_id = 4 AND license_beds >= 1
  )
  AND f.ims_org_id IN (
      SELECT ims_org_id FROM bed_fact WHERE bed_id = 15 AND license_beds >= 1
  )
GROUP BY b.business_name
ORDER BY total_license_beds DESC
LIMIT 10;

-- Top 10 hospitals by census beds (both ICU & SICU required)
SELECT
    b.business_name            AS hospital_name,
    SUM(f.census_beds)         AS total_census_beds
FROM bed_fact f
JOIN business b ON f.ims_org_id = b.ims_org_id
WHERE f.bed_id IN (4, 15)
  AND f.ims_org_id IN (
      SELECT ims_org_id FROM bed_fact WHERE bed_id = 4 AND census_beds >= 1
  )
  AND f.ims_org_id IN (
      SELECT ims_org_id FROM bed_fact WHERE bed_id = 15 AND census_beds >= 1
  )
GROUP BY b.business_name
ORDER BY total_census_beds DESC
LIMIT 10;

-- Top 10 hospitals by staffed beds (both ICU & SICU required)
SELECT
    b.business_name            AS hospital_name,
    SUM(f.staffed_beds)        AS total_staffed_beds
FROM bed_fact f
JOIN business b ON f.ims_org_id = b.ims_org_id
WHERE f.bed_id IN (4, 15)
  AND f.ims_org_id IN (
      SELECT ims_org_id FROM bed_fact WHERE bed_id = 4 AND staffed_beds >= 1
  )
  AND f.ims_org_id IN (
      SELECT ims_org_id FROM bed_fact WHERE bed_id = 15 AND staffed_beds >= 1
  )
GROUP BY b.business_name
ORDER BY total_staffed_beds DESC
LIMIT 10;


-- ============================================================
-- SECTION 6: UTILIZATION ANALYSIS
-- Goes beyond raw bed counts to calculate utilization rate
-- (census / licensed) and staffing rate (staffed / licensed)
-- for hospitals with both ICU and SICU and at least 50
-- licensed beds. This filters out small facilities where
-- percentages can be misleading.
-- ============================================================

SELECT
    b.business_name                                        AS hospital_name,
    SUM(f.license_beds)                                    AS total_license_beds,
    SUM(f.census_beds)                                     AS total_census_beds,
    SUM(f.staffed_beds)                                    AS total_staffed_beds,
    ROUND(SUM(f.census_beds) / SUM(f.license_beds) * 100, 1)  AS utilization_rate,
    ROUND(SUM(f.staffed_beds) / SUM(f.license_beds) * 100, 1) AS staffing_rate
FROM bed_fact f
JOIN business b ON f.ims_org_id = b.ims_org_id
WHERE f.bed_id IN (4, 15)
  AND f.ims_org_id IN (
      SELECT ims_org_id FROM bed_fact WHERE bed_id = 4 AND license_beds >= 1
  )
  AND f.ims_org_id IN (
      SELECT ims_org_id FROM bed_fact WHERE bed_id = 15 AND license_beds >= 1
  )
GROUP BY b.business_name
HAVING total_license_beds >= 50
ORDER BY utilization_rate DESC
LIMIT 10;

-- ============================================================
-- END OF ANALYSIS
-- ============================================================
