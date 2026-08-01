# How LEGO Grew
### An interactive data story: LEGO through the decades

![Tableau](https://img.shields.io/badge/Tableau-E97627?style=flat-square&logo=tableau&logoColor=white)
![Data Visualization](https://img.shields.io/badge/Data%20Visualization-1F77B4?style=flat-square)
![Status](https://img.shields.io/badge/status-published-brightgreen?style=flat-square)

> ### [**Explore the live, interactive dashboard on Tableau Public →**](https://public.tableau.com/app/profile/jianyu.jia1246/viz/HowLEGOGrew/LEGODASHBOARD)

<!--
  ADD A SCREENSHOT: export a full-dashboard image from Tableau Public
  (Download > Image), save it as images/dashboard.png in this folder,
  then delete these comment lines to switch the preview on.

[![How LEGO Grew Up dashboard](images/dashboard.png)](https://public.tableau.com/app/profile/jianyu.jia1246/viz/HowLEGOGrew/LEGODASHBOARD)

<sub>Click the image to open the live, interactive version on Tableau Public.</sub>
-->

---

## Overview

Every LEGO set has a signature: the mix of parts it uses and the colors those parts come in. This project follows that signature across seven decades of official sets and tells the result as a linked, interactive Tableau story, built entirely in LEGO's own brick colors.

The spine is simple: **LEGO grew up.** It went from a handful of primary-colored bricks into a sprawling, licensed universe of thousands of parts, hundreds of colors, and dozens of worlds. The dashboard traces that journey in five chapters:

- **Bigger** : sets get larger and more complex over the decades
- **More Colorful** : the palette expands from a few colors to hundreds
- **More Worlds** : themes rise and fall, and licensing reshapes the catalog
- **More Characters** : the minifigure grows into a category of its own
- **The Building Blocks** : the underlying vocabulary of parts every set is built from

It closes with a **Big Picture** synthesis that ties the visual trends back to a real moment in LEGO's business history.

---

## The story: what the data shows

**Sets got bigger.** Average part count per set climbs steadily across the decades. Early sets were small and simple; modern sets trend far larger, reflecting LEGO's move from a plain building toy toward detailed, display-grade models.

**And far more colorful.** The number of distinct colors used each year expands from a small primary palette into hundreds of shades, rising sharply and peaking in the early-to-mid 2000s. Two companion views chart every color at its true hex value and its active lifespan (first year used to last year used), revealing how many colors appeared briefly and then vanished.

**The business "so what."** That color-and-complexity peak lines up with a documented turning point for the company. By 2003 the LEGO Group was roughly [$800 million in debt and losing about $1 million a day](https://www.finance-monthly.com/lego-turnaround-from-ruin-to-empire/), with factories carrying more than 12,000 unique parts after years of over-expansion into theme parks, clothing, and media. In 2004 a new CEO, Jørgen Vig Knudstorp, [cut the catalog back toward the core brick and reduced the part count](https://www.thestrategyinstitute.org/insights/from-bankruptcy-to-billions-legos-blueprint-for-business-transformation), part of one of the best-known turnarounds in modern business. The palette's rise and plateau in this data is a visible fingerprint of that "more is always better" era and the correction that followed.

**New worlds, then licensed ones.** Theme views trace how theme families grew and faded, and a Licensed vs Classic split shows how licensed lines (Star Wars and others) reshaped what a "LEGO set" even is.

**And a cast of characters.** Minifigures grow from a side element into a defining feature of the brand.

---

## The dashboard

Ten linked worksheets, organized into the five chapters above:

| Chapter | Worksheet | Chart |
|---|---|---|
| Bigger | Complexity Over Time | Line, average parts per set by year |
| More Colorful | Colors Per Year | Line, distinct colors used each year |
| More Colorful | Every LEGO Color | Scatter, each color at its true hex |
| More Colorful | The Life of Every LEGO Color | Gantt, color lifespan by first/last year |
| More Worlds | Themes Through the Decades | Heatmap of theme activity by decade |
| More Worlds | Theme Rise and Fall | Area chart of theme families over time |
| More Worlds | Licensed vs Classic | Licensed lines against original themes |
| The Building Blocks | The Building Blocks | Treemap of the part-category mix |
| Big Picture | The Biggest Sets Ever | Ranked largest sets by part count |
| More Characters | The Rise of the Minifig | Minifigure growth over time |

**Interactivity:** a **Pick a Decade** parameter drives the theme and treemap views, so a reader can step through eras and watch the catalog change. Every color in the two color views is mapped to its real LEGO hex value.

---

## Data

**Source:** [Rebrickable LEGO catalog database](https://rebrickable.com/downloads/). The data is free, updated daily, and licensed for any use, which makes it clean to publish here. It covers every official LEGO set: parts, colors, inventories, themes, and minifigures.

| File | What it holds |
|---|---|
| `sets` | Every set with its name, release year, theme, and part count |
| `themes` | Theme names and the parent/child theme hierarchy |
| `inventories` | Links each set to its contents, with a version number |
| `inventory_parts` | The actual parts and colors inside each set |
| `parts` | Part names and their category |
| `part_categories` | Category names for parts |
| `colors` | Color names, real RGB hex values, and first/last year of use |
| `minifigs` / `inventory_minifigs` | Minifigure data |

The nine tables are connected inside Tableau using relationships, with `sets` as the central table, so no external database or ETL tool is required.

---

## Method: keeping the numbers honest

A few modeling decisions do the quiet work of making the trends trustworthy:

- **Filter `inventories` to `version = 1`.** A single set can have more than one inventory version on record, so counting all versions would double-count parts. Restricting to version 1 counts each set once.
- **Exclude spare parts** (`is_spare = 't'`) on parts-level views, so a set's part count reflects the pieces it is built from, not extras.
- **Derive a decade field** from the release year (`INT([Year]/10)*10`) for the time-based groupings.
- **Roll sub-themes up to their top-level theme**, using the parent/child hierarchy in `themes`, so related lines group cleanly instead of fragmenting.
- **Color lifespan** is computed from each color's first and last year of use, which drives the lifespan Gantt view.
- **True color rendering:** each color name is mapped to its real hex value for the palette, so the color views show LEGO's actual colors rather than arbitrary defaults.

---

## Design

The whole piece is styled in LEGO's own brick colors, pulled directly from the hex values in `colors.csv`. Section bands, icons, the hero header, and dividers were generated as PNG assets in Python (PIL) using those authentic codes, so the design stays consistent with the data it presents rather than relying on off-the-shelf templates.

---

## Repository contents

- `README.md` : this file
- `How LEGO Grew Up.twbx` : the packaged Tableau workbook, committed so it is downloadable and openable in the free [Tableau Reader](https://www.tableau.com/products/reader)
- `images/` : dashboard screenshots

---

## Sources

- **Data:** [Rebrickable LEGO catalog](https://rebrickable.com/downloads/)
- **Business context (LEGO's early-2000s crisis and turnaround):** [Finance Monthly](https://www.finance-monthly.com/lego-turnaround-from-ruin-to-empire/) · [The Strategy Institute](https://www.thestrategyinstitute.org/insights/from-bankruptcy-to-billions-legos-blueprint-for-business-transformation). Both are consistent with the LEGO Group's own 2003 Annual Report.

---

## Author

**Jianyu Jia** · Data Scientist, Vancouver, BC
[Portfolio](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects) · [Tableau Public](https://public.tableau.com/app/profile/jianyu.jia1246)
