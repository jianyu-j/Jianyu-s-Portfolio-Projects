<h1 align="center">Jianyu Jia</h1>

<p align="center">
  <b>Data Scientist · Machine Learning &amp; Statistical Modeling</b><br>
  Turning complex, messy data into clear decisions and measurable outcomes.
</p>

<p align="center">
  <i>Forecasting&nbsp; ·&nbsp; Operational Optimization&nbsp; ·&nbsp; Credit Risk&nbsp; ·&nbsp; BI &amp; Decision Support</i>
</p>

<p align="center">Vancouver, BC &nbsp;·&nbsp; MPS Analytics @ Northeastern University</p>

<p align="center">
  <a href="https://www.linkedin.com/in/jianyujia"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  <a href="https://github.com/jianyu-j"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="https://www.kaggle.com/jianyujia"><img src="https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white" alt="Kaggle"></a>
  <a href="mailto:jianyu.jia00@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
</p>

---

## About Me

I'm a data scientist with roots in **finance and actuarial science** who turns complex, messy datasets into insights that drive strategic and operational decisions. My work spans **statistical modeling, machine learning, data pipelines, and business intelligence**, with a particular focus on forecasting, operational optimization, and decision support.

I recently completed a **Master of Professional Studies in Analytics (Applied Machine Intelligence)** at Northeastern University, building on a background in actuarial science and finance from the University of Nebraska-Lincoln. Alongside my project work, I serve as **Partnership Lead at Data for Good Vancouver**, where I translate stakeholder needs into structured, deliverable data initiatives for nonprofit partners.

This repository collects selected portfolio projects across **healthcare, infrastructure & operations, credit risk, financial markets, applied deep learning, and data storytelling.**

---

## How I Work

I came to data science from actuarial science and finance. That background shows up less as insurance math and more as a disposition: state your assumptions, be honest about what you don't know, and remember the model is not the world. Most of my projects follow the same path.

**Ask whether this needs a model at all.**  
The first question is whether the problem calls for a prediction or an explanation. If nobody needs a specific predicted outcome, I don't reach for ML. The LEGO project is a historical account of how a catalog changed over seventy years, so it's a Tableau story, not a model. When something genuinely has to be predicted, that's when ML earns its place.

**Look at the raw data before doing anything to it.**  
I open the raw files and check whether they make sense: do the row counts, ranges, and relationships match what the domain says they should? On the LEGO catalog that's where I found sets carry multiple inventory versions, which would have silently double-counted every part in the analysis. Catching a structural problem at this stage is cheap. Catching it after ten dashboards are built is not.

**Expect most of the work to be getting the data right.**  
This is realistically where the time goes, and on self-directed projects, finding usable data at all is the hardest part. Some questions I'd like to answer don't have data behind them. I'd rather say a question can't be answered well than produce a confident answer with nothing underneath it.

**Run EDA in a fixed order.**  
Distributions first, to see what's skewed and what needs transforming. Then relationships and correlation. Then outliers, where I switch to interactive plots on large datasets so I can hover a suspicious point and see the record behind it. Throughout, I'm hunting the things that quietly break models later: leakage, structural duplication, and who never made it into the dataset at all.

**Spend the time on features, not on model shopping.**  
Feature selection is where I get the most return, and it's where domain judgment matters most: what would actually have been knowable at decision time, and what is quietly encoding the answer. On the credit scorecard that meant restricting to what a lender sees at application and splitting on time rather than randomly.

**Make the complex model compete with a simple one.**  
I start interpretable. A weight-of-evidence scorecard a risk officer can read and sign off on often beats a black box nobody will approve.

**Say what the model can't do.**  
Models are fit to conditions that held in the past. Black swan events sit outside anything the training data contains, and no amount of tuning fixes that. So I state limitations plainly: where a result is directional rather than precise, where the data was thin, and what would change my mind. A prediction is one input to a decision, not the decision itself.

---

## Tech Stack

**Languages & Query**  
![Python](https://img.shields.io/badge/Python-3776AB?style=flat-square&logo=python&logoColor=white)
![R](https://img.shields.io/badge/R-276DC3?style=flat-square&logo=r&logoColor=white)
![SQL](https://img.shields.io/badge/SQL-025E8C?style=flat-square)
![MATLAB](https://img.shields.io/badge/MATLAB-0076A8?style=flat-square)

**Machine Learning & Data Science**  
![NumPy](https://img.shields.io/badge/NumPy-013243?style=flat-square&logo=numpy&logoColor=white)
![pandas](https://img.shields.io/badge/pandas-150458?style=flat-square&logo=pandas&logoColor=white)
![scikit-learn](https://img.shields.io/badge/scikit--learn-F7931E?style=flat-square&logo=scikitlearn&logoColor=white)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=flat-square&logo=pytorch&logoColor=white)
![SciPy](https://img.shields.io/badge/SciPy-8CAAE6?style=flat-square&logo=scipy&logoColor=white)
![Statsmodels](https://img.shields.io/badge/Statsmodels-3D6DB3?style=flat-square)
![MLflow](https://img.shields.io/badge/MLflow-0194E2?style=flat-square&logo=mlflow&logoColor=white)

**Visualization & BI**  
![Matplotlib](https://img.shields.io/badge/Matplotlib-11557C?style=flat-square)
![Seaborn](https://img.shields.io/badge/Seaborn-4C72B0?style=flat-square)
![Plotly](https://img.shields.io/badge/Plotly-3F4F75?style=flat-square&logo=plotly&logoColor=white)
![Tableau](https://img.shields.io/badge/Tableau-E97627?style=flat-square&logo=tableau&logoColor=white)
![Power BI](https://img.shields.io/badge/Power_BI-F2C811?style=flat-square&logo=powerbi&logoColor=black)

**Data, Cloud & Tools**  
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=flat-square&logo=amazonwebservices&logoColor=white)
![Excel](https://img.shields.io/badge/Excel-217346?style=flat-square&logo=microsoftexcel&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![Jupyter](https://img.shields.io/badge/Jupyter-F37626?style=flat-square&logo=jupyter&logoColor=white)

---

## Portfolio Overview

| Project | Domain | Stack | What It Delivers |
|---|---|---|---|
| **[Steeves & Associates BI Platform](https://github.com/rahul-s-rajput/Steeves-and-Associates-Dashboard)** | Business Intelligence · Forecasting · RAG | Next.js, Flask, PostgreSQL, Python | Analytics platform with a RAG chatbot and time-series forecasting |
| **[Airport Fleet Electrification Analytics](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/Airport%20Fleet%20Electrification%20Analytics)** | ML · Time Series · Full-Stack Dashboard | Python, Next.js, TypeScript, Supabase, Scikit-learn | Ensemble forecasting model + operational analytics dashboard |
| **[Credit Default Scorecard & Expected Loss](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/blob/main/Credit%20Default%20Scorecard%20and%20Expected%20Loss%20Model/README.md)** | Credit Risk Modeling | Python, Scikit-learn, XGBoost, SHAP, optbinning | PD scorecard with a PD / LGD / EAD expected-loss framework |
| **[How LEGO Grew](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/LEGO%20Through%20the%20Decades)** | Data Visualization · EDA · Storytelling | Tableau | Interactive data story on how LEGO sets, colors, and themes evolved over 70+ years · **[Live Dashboard](https://public.tableau.com/app/profile/jianyu.jia1246/viz/HowLEGOGrew/LEGODASHBOARD)** |
| **[DiT Super-Resolution](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/dit-super-resolution)** | Deep Learning · Generative Models | Python, PyTorch | Trained a diffusion transformer for image super-resolution |
| **[Hospital Nursing Intervention Pilot](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/Hospital-Nursing-Intervention-Pilot)** | Healthcare Analytics · Data Modeling | MySQL, SQL, MySQL Workbench | Star-schema database (ERD, fact and dimension tables) with SQL analysis of hospital bed utilization |
| **[Stock Direction Prediction](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/Stock%20Direction%20Prediction)** | ML · Financial Markets | Python, Scikit-learn | Classification model predicting stock price direction |
| **[KorIQ Tennis Platform](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/KorIQ-Tennis-Platform)** *(prototype)* | Product Design · Full-Stack · SQL Analytics | React, TypeScript, Vite, Supabase (Postgres, RLS), Recharts, Tailwind | Player / student / coach / club platform with an NTRP-weighted evaluation engine scored in Postgres, row-level security per role, and SQL-view analytics · **[Live Demo](https://jianyu-j.github.io/Jianyu-s-Portfolio-Projects/KorIQ-Tennis-Platform/demo/)** |
| **Vancouver Housing Investment Analysis** *(in progress)* | Geospatial · Investment Analytics | Python, GeoPandas, Power BI, StatCan | Power BI map ranking Vancouver areas by land value & demographics |

---

## Featured Projects

### Steeves & Associates: AI Business Intelligence Platform
*Next.js · Flask · PostgreSQL · Python · Scikit-learn · Statsmodels*

An interactive BI platform for a Vancouver IT consultancy that pairs time-series forecasting with a natural-language chatbot built on a RAG framework.

- Built a **Holt-Winters exponential smoothing** model with seasonal decomposition on 60 months of history, reaching **95.4% forecast accuracy (MAPE 4.6%)** and projecting **~$2.2M in revenue** with quantified confidence intervals.
- Engineered a **k-means clustering** algorithm on multi-dimensional resource-performance data to segment resources and surface reallocation opportunities.
- Architected an end-to-end ML pipeline (preprocessing → feature engineering → training → validation → deployment), integrated with a **RAG framework** for natural-language querying of BI outputs.

**[View Project →](https://github.com/rahul-s-rajput/Steeves-and-Associates-Dashboard)**

---

### Airport Fleet Electrification Analytics
*Python · Scikit-learn · Next.js · TypeScript · Supabase*

Forecasting and operational analytics for electrifying airport ground-support fleets, delivered as a full-stack analytics dashboard.

- Developed an **ensemble forecasting model** for charging and energy demand.
- Built operational analytics to expose capacity gaps and prioritize infrastructure decisions.
- Shipped an interactive **full-stack dashboard** (Next.js + TypeScript + Supabase) for exploring forecasts and operational metrics.

**[View Project →](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/Airport%20Fleet%20Electrification%20Analytics)**

---

### Credit Default Scorecard & Expected Loss Model
*Python · Scikit-learn · XGBoost · SHAP · optbinning*

A credit-risk model that estimates probability of default and translates it into an expected-loss framework.

- Built a **PD scorecard** using optimal binning and weight-of-evidence transformations (`optbinning`) for interpretable, monotonic scoring.
- Benchmarked against a gradient-boosted model (**XGBoost**) with **SHAP** for explainability.
- Combined **PD, LGD, and EAD** into a full **expected-loss** framework, with a model-validation writeup covering discrimination and calibration.

**[View Project →](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/blob/main/Credit%20Default%20Scorecard%20and%20Expected%20Loss%20Model/README.md)**

---

### How LEGO Grew: An Interactive Data Story
*Tableau Public*

A published, interactive Tableau data story tracing how LEGO sets, colors, and themes evolved across seven decades, built entirely in LEGO's own brick colors.

- Modeled nine Rebrickable catalog tables in Tableau using relationships, with correctness filters (inventory versioning, spare-part exclusion) that keep the trend lines honest.
- Built **ten linked worksheets** across five narrative chapters, driven by a **Pick a Decade** parameter, with every color mapped to its true LEGO hex value.
- Tied the visual findings to a documented business turning point: the palette and complexity peak aligns with LEGO's early-2000s over-expansion and the 2004 return to the core brick.

**[Live Dashboard →](https://public.tableau.com/app/profile/jianyu.jia1246/viz/HowLEGOGrew/LEGODASHBOARD)** · **[View Project →](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/LEGO%20Through%20the%20Decades)**

---

### DiT Super-Resolution: Diffusion Transformer
*Python · PyTorch*

Implemented and trained a **Diffusion Transformer (DiT)** architecture for image super-resolution.

- Developed a diffusion-based generative architecture with **transformer attention** mechanisms.
- Handled model training and optimization end-to-end in **PyTorch**.
- Evaluated generated-output quality and overall model performance.

**[View Project →](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/dit-super-resolution)**

---

### Hospital Nursing Intervention Pilot
*MySQL · SQL · MySQL Workbench*

A healthcare analytics database supporting operational analysis of a nursing-intervention pilot for an integrated delivery system, delivered with a written program report.

- Designed a **star-schema** database (ERD, fact and dimension tables) and normalized from **1NF through 3NF**.
- Built the CSV loading pipeline and implemented data validation and integrity checks across the model.
- Wrote analytical SQL, including **window functions**, to derive **bed-volume and utilization-rate** metrics, delivering insights on patient flow and data-driven recommendations for hospital leadership.

**[View Project →](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/Hospital-Nursing-Intervention-Pilot)**

---

### KorIQ Tennis Platform *(prototype)*
*React · TypeScript · Vite · Supabase (Postgres, Auth, RLS) · Recharts · Tailwind*

A prototype of a platform connecting tennis players, students, coaches, and clubs. The core loop — accounts, coach evaluations, student progress, and club analytics — runs on a real Postgres backend (Supabase); the rest of the product surface is a front-end prototype over seeded data. The live demo is connected to the database, so an evaluation entered as a coach shows up in the student's and club's views.

- Designed an **NTRP-based evaluation engine** that scores stroke fundamentals and level-specific performance criteria on one comparable 0–100 scale, with weights that shift from fundamentals-heavy for beginners (70/30) to performance-only for advanced players. Scoring is implemented **in the database** (Postgres trigger + weight table), so every client and query sees the same number.
- Modelled the domain in **SQL with row-level security**: coaches see only their club's students, students see only themselves, clubs see their own roster — enforced by Postgres policies, not front-end filtering. Sign-up flows that claim pre-existing coach/student records run as audited `security definer` functions.
- Built the analytics as **SQL views** (per-student progress with window functions, coach impact, monthly evaluation volume, level benchmarks) and rendered them in the club portal with Recharts alongside the broader **business-intelligence layer** (churn, lifetime value, coach revenue and retention, concentration risk, break-even).
- Built **four role-based portals** (Player, Student, Coach, Club) plus a public community layer, covering evaluations, lesson booking, a tutorial marketplace, partner matching, and club events.

**Scope note:** payments (Stripe / Square / PayPal), messaging, bookings, and the in-app assistant are simulated in the browser. The demo database is shared, so anything entered there is visible to other visitors. A separate computer-vision self-rating feature (MediaPipe Pose + TrackNet on match video) is in early development and is not part of this codebase.

**[Live Demo →](https://jianyu-j.github.io/Jianyu-s-Portfolio-Projects/KorIQ-Tennis-Platform/demo/)** · **[View Project →](https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects/tree/main/KorIQ-Tennis-Platform)**

---

## Selected Professional Work (Under NDA)

Some professional analytics work can't be shared publicly due to confidentiality agreements. These are summarized at a high level.

- **EV Charging Analytics (YVR Airport).** Infrastructure analytics on sensor and operational data to identify efficiency patterns and detect system failures across a large charger network.
- **HPV Campaign Cross-Market Analytics.** Multi-source marketing analytics integrating campaign data to evaluate advertising performance across markets and generate automated reporting metrics.

---

## Education

**Northeastern University**, *Master of Professional Studies in Analytics (Applied Machine Intelligence)*  
GPA 3.80 · Sep 2024 to May 2026 · Vancouver, BC

**University of Nebraska-Lincoln**, *B.S. in Business Administration, Finance & Actuarial Science*  
Aug 2018 to Dec 2022 · Lincoln, NE

---

## Let's Connect

I'm always open to conversations about data science, analytics, and forecasting.

<p align="left">
  <a href="https://www.linkedin.com/in/jianyujia"><img src="https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"></a>
  <a href="https://github.com/jianyu-j"><img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"></a>
  <a href="https://www.kaggle.com/jianyujia"><img src="https://img.shields.io/badge/Kaggle-20BEFF?style=for-the-badge&logo=kaggle&logoColor=white" alt="Kaggle"></a>
  <a href="mailto:jianyu.jia00@gmail.com"><img src="https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"></a>
</p>
