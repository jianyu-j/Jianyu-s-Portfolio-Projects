# Hospital Nursing Intervention Pilot Program
### ACME Integrated Delivery System

## About This Project

This project is a showcase of my SQL and database modeling skills. It walks through the full process of taking raw CSV data, assessing its structure, building a star schema in MySQL, enforcing referential integrity with primary and foreign keys, validating data quality, and writing analytical queries that answer a real business question. The goal is to demonstrate the thought process behind how tables are designed, how normalization works, how facts and dimensions are identified, and how all of that comes together to support analysis.

The business scenario is based on a healthcare network trying to decide where to pilot a nursing intervention program. But the real focus of this project is the database modeling and SQL work behind the analysis.

## Organization Background

ACME is an integrated delivery system (IDS), which is a network of healthcare organizations operating under a single parent holding company. The network includes hospitals, physician groups, and other care facilities. The Business Insights Group within ACME is responsible for providing data driven analysis to support leadership's strategic decisions.

## Business Problem

Leadership wants to launch an intervention to hire additional nurses in hospitals that operate Intensive Care Units (ICU) and Surgical Intensive Care Units (SICU). Medical literature has consistently shown that higher nurse to patient ratios in intensive care settings lead to better clinical outcomes, including reduced mortality rates, fewer hospital acquired infections, and shorter lengths of stay.

However, implementing this across every hospital at the same time would not be financially feasible. The additional staffing costs would only be justified at sites with high enough ICU and SICU bed volume to make the investment cost effective. Leadership decided to start with a pilot program at one or two hospitals in the next fiscal quarter.

## Project Objective

The objective is to analyze ACME's hospital bed data to identify which hospitals in the network are the strongest candidates for the nursing intervention pilot. This involves building a dimensional model of the data, assessing normalization, enforcing schema integrity, validating data quality, and writing SQL queries to produce ranked hospital lists by bed volume.

## Bed Metrics

Hospital bed capacity is measured using three metrics. Licensed beds represent the total number of beds authorized under the state license. Census beds represent the average number of beds actually occupied on a typical day. Staffed beds represent the number of beds for which clinical staffing currently exists. Looking at all three together gives a more complete picture than any single metric alone.

## Data Description

The analysis uses three tables structured as a star schema.

The business table is a dimension table with 22,202 rows. Each row represents a healthcare facility in the ACME network, including the hospital identifier (ims_org_id), the hospital name (business_name), total bed counts, and a size based grouping code (bed_cluster_id).

The bed_type table is a dimension table with 20 rows. Each row describes a type of hospital bed such as ICU, SICU, Burn, Med/Surg, and others. The two bed types relevant to this project are ICU (bed_id 4) and SICU (bed_id 15).

The bed_fact table is the fact table with 51,458 rows. Each row represents a specific bed type at a specific hospital, containing the three bed count measures: license_beds, census_beds, and staffed_beds.

## Technical Approach

This project covers several areas of database modeling and analysis.

Dimensional modeling: each variable across all three tables is classified as either a fact or a dimension, which is essential for writing correct aggregation queries.

Normalization assessment: the source data is evaluated against the three standard normal forms (1NF, 2NF, 3NF) to confirm proper structure before building the schema.

Schema design: primary keys are added to both dimension tables and foreign keys are added to the fact table, enforcing referential integrity in the star schema. The EER diagram is generated through MySQL Workbench's Reverse Engineer feature.

Data quality validation: checks are run for NULL values, duplicate records, and orphan foreign keys to ensure the data is clean before analysis.

Analysis round 1: identifies the top 10 hospitals by ICU or SICU bed volume (broad filter, about 3,400 hospitals qualify).

Analysis round 2: narrows the focus to hospitals operating both ICU and SICU beds (selective filter, only 179 hospitals qualify).

Utilization rate analysis: calculates census divided by licensed beds and staffed divided by licensed beds to reveal which hospitals are running at full capacity versus those with room to grow.

## Project Deliverables

This project contains three deliverables. The project overview (this document) provides the full context and background. The SQL script contains the schema design, data validation queries, all six bed volume analysis queries, and the utilization rate analysis. The report presents the dimensional modeling, normalization assessment, data quality results, analysis findings, utilization comparison, and the final recommendation to leadership.
