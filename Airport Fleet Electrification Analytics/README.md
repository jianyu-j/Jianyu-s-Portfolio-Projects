# eGSE Dashboard Technical Reference Guide

**Project:** Electric Ground Support Equipment (eGSE) Charger Analytics

**Stack:** Next.js 14, TypeScript, Supabase (PostgreSQL + PostgREST RPCs), Recharts, shadcn/ui

**Data:** ~180K charger sessions across 12 months, 15 gates across 6 zones

---

## Global Controls (Filter Bar)

Every tab except Trends & Forecasting responds to the filter bar at the top of the page. There are two controls:

**Quarter / Date Range** defaults to Full Year. Can be set to Q1 through Q4 or a custom date range using the date picker. Changing this re-fetches all live data from Supabase.

**Zone** filters to a specific zone. When "All" is selected every zone is included.


---

## Tab 1: Overview

**Purpose:** High level fleet health at a glance, plus a customisable chart workspace.

### KPI Cards

| Card | Calculation |
|---|---|
| Total Sessions | **COUNT(*)** of valid sessions in date range and zone |
| Total Energy | **SUM(kilowatt_hours_returned)** across valid sessions |
| Avg Duration | **AVG(charge_duration)** in minutes per valid session |
| MoM Session Growth | **(last_month_count minus prev_month_count) / prev_month_count × 100** compares the two most recent calendar months in the selected range |

Source RPC: **get_overview_kpis**

### Fixed Chart: Forecasted Monthly Trend

Always visible at the top of the page below KPIs. Shows the daily kWh forecast for the next month with confidence bands, overlaid on historical actuals. Loaded from the static file **/public/forecast_data.json** which is pre-computed output from the ensemble ML model (CatBoost + Holt-Winters + SARIMA), not a live query. The filter bar is hidden on this tab because the forecast is date fixed.

### Customisable Chart Pool

Below the forecast chart is a 2 to 3 column grid of charts that each team member can personalise. Click the **Customize** button (top right of the section) to open a slide over panel with 5 available charts. Select 2 or 3; picking a 4th automatically removes the oldest. Selection is saved to **localStorage** per browser.

**Available charts:**

| Chart | What it shows | Source RPC |
|---|---|---|
| Hourly Demand Curve | Sessions per hour (bars, left Y) and avg kWh per hour (line, right Y) across the selected date range | **get_hourly_demand** |
| Sessions by Zone | Horizontal bar chart showing total valid sessions per zone, colour coded | **get_pier_summary** |
| Efficiency Quadrant | Scatter where each dot is a gate; X = utilisation %, Y = kWh per occupied hour; dashed lines = fleet median. Gates above right are high efficiency | **get_gate_map_data** |
| Fault Rate by Zone | Horizontal bars showing % of all sessions that terminated with a fault code, per zone. Red > 5%, yellow 2 to 5%, green < 2% | **get_pier_summary** |
| Charge Gained Distribution | Histogram showing % of sessions in each 5% SoC band. Green bars = 90% or more charge gained (full charges) | **get_charging_patterns** |

---

## Tab 2: Fleet & Spatial

**Purpose:** Geographical view of the terminal to understand where activity, efficiency, and risk concentrate by gate.

### KPI Cards

| Card | Calculation |
|---|---|
| Valid Sessions | Total valid sessions across visible gates |
| Quick Turnover | Count of consecutive sessions at the same charger/port where a different vehicle plugged in within 5 minutes |
| Utilisation Rate | Average gate utilisation across all gates: **SUM(charge_duration) / (date_range_days × 24 × 60 × port_count) × 100** |
| False Flag Rate | **COUNT(is_valid = false) / COUNT(*) × 100** across all plug in attempts |

### Terminal Map

The terminal image overlaid with coloured bubbles, one per gate. Bubble colour encodes the selected metric; bubble size encodes total session volume at that gate (larger = busier).

**Colour metric selector** has six options in the pill buttons above the map:

| Metric | Colour scale | What it means |
|---|---|---|
| Sessions | Teal (light to dark = more) | How busy the gate is |
| Quick turnover | Teal | How often vehicles swap in under 5 min |
| Utilisation | Teal | What % of available port time is occupied |
| kWh/Hr | Teal | Energy delivered per occupied hour, a proxy for charging efficiency |
| False flags | Teal | % of plug in attempts that were invalid (too short) |
| Fault risk | Green to Orange to Red | Avg fault rate % across chargers at the gate |

Hotspot gates (top 15% by the current metric) pulse with an animated ring.

**Clicking a gate** selects it, updates the right panel to show per charger detail, and switches the Efficiency Quadrant to port level mode for that gate.

### Right Panel: Three level drill down

The right panel is a two card stack that changes based on selection state:

**No selection leads to Zone breakdown table**
Shows all zones: % of total sessions, quick turnover rate (colour coded), false flag rate (colour coded).

**Zone filter active leads to Gate breakdown table**
Shows gates within the selected zone: % of zone sessions, turnover rate, false flag rate. Click any row to drill into that gate.

**Gate selected leads to Per charger table**
Shows each charger/port combination at that gate:

| Column | Calculation |
|---|---|
| % Sess. | This port's valid sessions / gate total |
| Turnover | Events where a new vehicle plugged in < 5 min after the previous session ended |
| Idle Gap | Median minutes between consecutive sessions on the same port |
| False flag | % of all plug in attempts on this port that were invalid |
| Fault risk | Avg fault rate % from the last 20 sessions on this charger (from **get_charger_risk_table**). Colour: green < 10%, amber 10 to 29%, orange 30 to 59%, red 60% or more |

**Gate header badges** show turnover count and false flag rate for the selected gate at a glance.

### Efficiency Quadrant (bottom right panel)

A scatter chart showing utilisation % (X) vs kWh per occupied hour (Y).

**Default mode (no gate selected):** One dot per gate, coloured by zone. Dashed reference lines mark the fleet median for both axes. Gates in the top right quadrant are high utilisation and high output, which is ideal. Gates in the bottom left are underperforming.

**Port mode (gate selected):** Port A and Port B of the selected gate are highlighted (blue and violet respectively). All other gates appear as dimmed grey context dots. This lets you compare a specific gate's ports against the rest of the fleet.

---

## Tab 3: Battery & Charging Health

**Purpose:** Understand charging quality, battery degradation, and the physical factors affecting charging speed.

### KPI Cards

| Card | Calculation |
|---|---|
| Avg Charge Gained | **AVG(charge_gained)** across valid sessions, representing SoC % added per session |
| % Full Charges | % of valid sessions where **end_volts is 95V or higher**, a proxy for a full charge |
| Avg TEI | Temperature Efficiency Index: **(end_temp minus start_temp) / kilowatt_hours_returned**. Lower is better (less heat per unit of energy). Good < 0.57, Fair 0.57 to 0.75, Poor > 0.75 |
| Fleet Energy Waste | % of total Ah delivered that exceeded what the battery actually absorbed, indicating degraded capacity. Annual cost estimated at local commercial electricity rate |

### Charge Gained Distribution (histogram)

Shows the spread of how much charge vehicles actually received. Each bar is a 5% SoC band (0 to 4%, 5 to 9%, up to 95 to 100%). Green bars (90% or more) represent sessions that nearly fully charged the battery.

When you click a zone in the TEI Scorecard, the histogram re-fetches and filters to that zone only.

**Calculation:** **charge_gained = end_charge_percent minus start_charge_percent** (pre-computed column). The RPC **get_charging_patterns** returns bins of 5% width with counts; the frontend converts to % of total sessions.

### TEI Health Scorecard

A heat map table showing thermal efficiency per zone, gate, and charger. Click any zone row to drill into individual charger detail for that zone.

| Column | Calculation | Colour |
|---|---|---|
| Med. TEI | Median **(end_temp minus start_temp) / kWh** per entity | Green < 0.57, Yellow 0.57 to 0.75, Red > 0.75 |
| % Full | Weighted avg of sessions ending at 95V or higher | No colour (informational) |
| Avg Chg | Weighted avg of **charge_gained** | No colour (informational) |
| End °C | Weighted avg of **end_temp** | Green < 35°C, Yellow 35 to 45°C, Red > 45°C |

TEI values are computed in **get_tei_by_zone** and always run across all zones regardless of the zone filter, so you can compare zones against each other.

### Battery Degradation

Detects vehicles where the charger delivers more energy (Ah) than the battery's own SoC reading absorbed. The "positive differential" signals degraded capacity that can no longer accept the full charge.

**Calculation:** **differential = (amp_hours_returned / rated_capacity_ah × 100) minus (end_charge_percent minus start_charge_percent)**. A session is flagged if **differential > 5%**. Only sessions with **battery_capacity** between 100 and 5000 Ah and positive Ah/kWh values are included. Vehicles with fewer than 10 qualifying sessions are excluded.

**Stat cards shown:**
- Fleet Energy Waste % = flagged Ah as % of all Ah delivered
- Estimated Annual Energy Loss = extrapolated from the selected date range
- Estimated Annual Cost = annual kWh × local commercial rate
- Sessions Flagged % = fraction of qualifying sessions with differential > 5%

**Top Vehicles bar chart** shows the 10 vehicles with the highest % of waste sessions, sorted descending. Colour encodes severity: teal < 15%, sky 15 to 25%, amber 25 to 40%, rose 40% or more.

Source RPC: **get_battery_degradation**

### Single vs. Dual Port Charging

Compares average current (Amps) delivered when a charger runs one port at a time vs. both ports simultaneously. A current drop under dual port conditions indicates the charger shares power capacity between ports.

**Dual port detection:** Sessions are grouped by charger + 1 hour time bucket. If both Port A and Port B appear in the same bucket for the same charger, both are labelled **is_dual = true**. IQR based outlier removal is then applied per charger before averaging. Only chargers with 5 or more sessions in each mode are shown.

**Calculation:** **avg_current = amp_hours_returned / (charge_duration / 60)** Ah per hour = Amps equivalent.

Source RPC: **get_single_dual_port**

### Charging Speed Heatmap

A 4×6 grid showing average charging speed (Ah/min) broken down by starting SoC (columns) and charge size (rows).

**Rows (charge size):** Small 0 to 25%, Medium 25 to 50%, Large 50 to 75%, Very Large 75 to 100%

**Columns (starting SoC):** 0 to 10%, 10 to 20%, 20 to 40%, 40 to 60%, 60 to 80%, 80 to 100%

Darker teal = faster charging. Hover any cell to see exact Ah/min and session count. Typically batteries starting at low SoC charge fastest, and speed drops as SoC climbs, which is a normal Li-ion characteristic.

Source RPC: **get_charging_speed_heatmap**

---

## Tab 4: Fault Analytics & Predictive Risk

**Purpose:** Understand what's failing, identify the riskiest chargers, and see what the ML models predict.

### KPI Cards

| Card | Calculation |
|---|---|
| No Charge Rate | **(immediate_failures + zero_charge_valid) / total_attempts × 100** across all plug in attempts (ignores validity filter, all sessions included) |
| Fault Termination Rate | **COUNT(fault_termination_codes) / COUNT(*) × 100** across all sessions in range |
| High Risk Chargers | Count of chargers where **fault_rate_pct is 30% or higher** in their last 20 sessions |
| Model AUC | Fixed value: 0.961, the Fault Detection Random Forest model's AUC on the test set |

### Fault Breakdown (horizontal bar chart)

Sessions grouped by fault category, sorted descending. Hover a bar to see session count, average charge gained, and average kWh for that category.

**Fault groupings by termination code:**

| Category | Description |
|---|---|
| Voltage / Current | Voltage and current related fault codes |
| Hardware | Hardware malfunction codes |
| Temperature | Thermal event codes |
| Communication | Communication failure codes |
| Battery | Battery related fault codes |

Note: the validity (**is_valid**) filter is intentionally not applied here because fault events are real operational occurrences regardless of session quality. Source RPC: **get_fault_breakdown**

### Charger Risk Scatter

Each dot is a charger (hostname), plotted by fault rate % (X) vs no charge rate % (Y). Dot size encodes session volume. Dashed lines show the fleet median for each axis.

**Colour by risk tier:**
- Red = Critical (fault rate 60% or higher)
- Orange = High (30% or higher)
- Amber = Moderate (10% or higher)
- Green = Low (< 10%)

Risk tier is determined by **fault_rate_pct** over the charger's last 20 plug in attempts within the selected date range. Source RPC: **get_charger_risk_table** which always uses all sessions (not validity filtered) because both valid and invalid plug in attempts matter for fault assessment.

### ML Predictive Analysis

Three Random Forest classifiers trained on ~177K sessions with a time based train/test split. All models used in sklearn Pipelines with median imputation and standard scaling. Hardware faults were excluded from training because they indicate charger replacement, not predictable from session features.

Switch between models using the three tabs:

| Tab | Task | AUC |
|---|---|---|
| No Charge | Binary: will this plug in attempt deliver zero charge? | 0.949 |
| Fault | Binary: will this session end with a fault termination code? | 0.961 |
| Fault Type | Multiclass: which fault category (Temp / Comm / Voltage / Battery)? | 0.961 |

**Left panel** shows the selected model's metrics: AUC (area under the ROC curve where 1.0 is perfect), Accuracy, Macro F1, and per class Precision / Recall / F1 with support counts.

**Right panel** shows feature importances for the selected model, with the top predictors sorted from highest to lowest. Colour groups features by category (session level, charger level, weather, temporal). Importance is computed as mean decrease in impurity across all trees, normalised to sum to 100%.

Feature data is loaded from **/public/fault_model.json**, a static file generated from the final trained models.

---

## Tab 5: Trends & Forecasting

**Purpose:** Forward looking demand forecast plus explanations of what drives charging demand.

The filter bar is hidden on this tab because the forecast is fixed to the prediction window and is not affected by date or zone filters.

All data is loaded from **/public/forecast_data.json**, pre-computed output from the ensemble model.

### KPI Cards

| Card | Calculation |
|---|---|
| Peak Concurrent | **MAX(predicted_peak_concurrent)** across forecast period, shown as peak / total ports |
| Avg Daily Energy | **AVG(daily_total_kwh predicted)** across forecast period |
| Busiest Zone | The zone with the highest total predicted kWh |
| Forecast Accuracy | **100 minus MAPE** on the test set for the daily kWh model |

### Forecasted Monthly Trend (main chart)

Shows the daily kWh forecast with a shaded confidence interval, overlaid on historical actuals. Uses the Simple Average Ensemble: **(CatBoost + Holt-Winters + SARIMA) / 3**.

Model selection rationale: the ensemble achieved ~8.84% MAPE on the test set, marginally better than any single model while adding interpretability (SHAP) and seasonal anchoring (SARIMA). The chart is also embedded at the top of the Overview tab for quick reference.

### Demand Drivers Chart

Shows the SHAP based feature importance from the CatBoost model, representing what percentage of the forecast is explained by each input feature category (weather, flight schedule, calendar effects, rolling history). Bars are sorted descending. Colours match the feature category legend.

### Zone Capacity Card

Shows the forecasted daily peak concurrent sessions per zone, benchmarked against each zone's total available port capacity. Allows you to see which zones are forecast to be near saturation.

---

## Data Architecture

### Database: Supabase (PostgreSQL)

**Main table:** charger_sessions

Key computed columns pre-loaded at upload time:
- **is_valid** (boolean) is true if the session was a genuine charging attempt (not a < 1 min connection failure)
- **charge_gained** equals end_charge_percent minus start_charge_percent
- **charging_rate** is derived Ah/min
- **zone** and **gate** are derived from hostname during data prep
- **hour**, **day_of_week**, **date** are derived from timestamps

**Supporting table:** flight_schedules contains departure/arrival data used by the forecasting model

### RPCs (Supabase PostgREST Functions)

All charts use server side SQL functions (RPCs) rather than pulling raw data to the browser. This keeps queries fast and reduces bandwidth. Each RPC accepts date range, zone, and validity parameters and returns aggregated JSON.

Common parameters across all RPCs:
- **p_start** / **p_end** are date strings (YYYY-MM-DD)
- **p_zone** is zone name or null for all zones
- **p_valid_only** is boolean; when true, filters to is_valid = true sessions only

### Static JSON Files (pre-computed)

| File | Content | Used by |
|---|---|---|
| /public/forecast_data.json | Daily forecasts, confidence intervals, SHAP values, zone breakdowns | Tabs 1 & 5 |
| /public/fault_model.json | RF model metrics, feature importances, per class breakdowns for all 3 models | Tab 4 |

---

## Filter Logic Summary

| RPC | Respects is_valid? | Notes |
|---|---|---|
| get_overview_kpis | Yes | Valid sessions only when toggle is on |
| get_hourly_demand | Yes | |
| get_monthly_trend | Yes | |
| get_zone_summary | Yes (sessions); No (fault_rate) | Fault rate always computed over all sessions |
| get_charging_patterns | Yes | |
| get_tei_by_zone | Yes | |
| get_battery_degradation | Yes | |
| get_single_dual_port | Always valid only | Hardcoded because invalid sessions distort current calculations |
| get_charging_speed_heatmap | Yes | |
| get_gate_map_data | Always valid only | Hardcoded because map metrics are valid session metrics |
| get_fault_breakdown | No | Fault events are real regardless of session validity |
| get_charger_risk_table | No | Risk based on all plug in attempts |
| get_no_charge_by_zone | No | No charge rate must include invalid sessions |
