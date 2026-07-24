# LEGO Through the Decades

*An interactive Tableau dashboard exploring how LEGO sets, colors, and themes have evolved from the 1950s to today.*

![Tableau](https://img.shields.io/badge/Tableau-E97627?style=flat-square&logo=tableau&logoColor=white)
![Status](https://img.shields.io/badge/status-in%20progress-yellow?style=flat-square)

> **Status: in progress.** The dashboard is being built in Tableau Public. This README will be updated with the live link, screenshots, and findings as the work lands.

## Overview

Every LEGO set has a signature: the mix of parts it uses and the colors those parts come in. This project treats that signature as the through-line for an exploratory data analysis, told as an interactive Tableau story. It traces how sets grew in size and complexity over the decades, how the LEGO color palette expanded from a handful of colors to hundreds, and how themes rose and fell over time.

The goal is a polished, recruiter-facing Tableau piece: linked views, thoughtful interactivity, and a design encoded in LEGO's own brick colors.

## Data

**Source:** [Rebrickable LEGO catalog database](https://rebrickable.com/downloads/). The data is free, updated daily, and licensed for any use, which makes it clean to publish here. It covers every official LEGO set: parts, colors, inventories, themes, and minifigures.

Tables used:

| File | What it holds |
|---|---|
| `sets` | Every set with its name, release year, theme, and part count |
| `themes` | Theme names and the parent/child theme hierarchy |
| `inventories` | Links each set to its contents (with a version number) |
| `inventory_parts` | The actual parts and colors inside each set |
| `parts` | Part names and their category |
| `part_categories` | Category names for parts |
| `colors` | Color names and their real RGB hex values |
| `minifigs` / `inventory_minifigs` | Minifigure data (optional secondary view) |

The tables are joined inside Tableau using relationships, so no external database or ETL tool is required.

## Questions explored

- How has set complexity (part count) changed decade by decade?
- How has the LEGO color palette expanded over time, and which colors define each era?
- Which themes have grown, and which have faded?
- How distinct is a set's parts-and-colors fingerprint across themes and eras?

## Tools

- **Tableau Public** for the dashboard and all data shaping (relationships, calculated fields, custom color palette).
- Data downloaded directly from Rebrickable as CSV files.

## Approach notes

A few modeling decisions keep the numbers honest:

- Filter inventories to `version = 1` so multi-version sets are not double counted.
- Exclude spare parts (`is_spare = 't'`) when measuring the parts in a set.
- Derive a decade field from the release year for time-based views.
- Prefix the color hex with `#` so Tableau reads it as a true color for a custom palette.
- Roll nested sub-themes up to their top-level theme for cleaner groupings.

## Repository contents

- `README.md` — this file
- `*.twbx` — the packaged Tableau workbook, committed once built so it is downloadable and openable in the free Tableau Reader *(coming soon)*
- `images/` — dashboard screenshots *(coming soon)*

## Live dashboard

*The link to the Tableau Public dashboard will go here once it is published.*
