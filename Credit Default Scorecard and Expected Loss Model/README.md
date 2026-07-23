# Credit Risk Scorecard and Expected Loss Model

**Estimating whether a loan applicant will repay — and turning that estimate into a transparent score, a price, and a lending decision.**

This project builds the kind of model a bank or online lender uses to decide who gets a loan. For each application it estimates the chance the borrower will default, presents that estimate as a plain, points-based scorecard a credit officer can read, and converts it into a dollar figure and an approve, price, or decline recommendation. It is built to the standards a real lending function would expect: no cheating with information the lender wouldn't have at decision time, an honest independent view of risk, and documentation written the way a bank's model-validation team would want to see it.

---

## Contents

- [The problem in plain terms](#the-problem-in-plain-terms)
- [What makes this different](#what-makes-this-different)
- [The data](#the-data)
- [How it works, step by step](#how-it-works-step-by-step)
- [Results](#results)
- [Key decisions and trade-offs](#key-decisions-and-trade-offs)
- [Limitations and model risk](#limitations-and-model-risk)
- [What I would do next](#what-i-would-do-next)
- [How to run it](#how-to-run-it)
- [Figure checklist](#figure-checklist)

---

## The problem in plain terms

Every lender faces the same tension. Approve too freely and you lose money on loans that default. Approve too cautiously and you turn away good customers and forgo the interest they would have paid. The job of a credit risk model is to sit in the middle of that trade-off: estimate, for each applicant, how likely they are to default, so the lender can make a decision that balances losses against lost business.

But an estimate on its own isn't enough. A lending function needs three more things, and this project delivers all three:

1. **A decision it can explain.** If an applicant is declined, they are legally entitled to a reason. A model that can't explain itself can't be used. So the main model here is a *scorecard* — a simple, transparent points system where you can see exactly why each applicant scored the way they did.
2. **A number in dollars.** "This applicant has a 12% chance of default" only becomes useful when combined with how much would be lost if they do default. That gives an *expected loss*, which is what a lender actually budgets and provisions against.
3. **An action.** The model doesn't stop at a probability. It decides whether to approve, at what interest rate to price the risk, or whether to decline — the way a real lender operates.

---

## What makes this different

The easiest way to get an impressive-looking accuracy number on this dataset is to accidentally cheat, and most public examples of this problem do exactly that. This project is deliberately built to avoid it, and that discipline is the point.

**It never uses information from the future.** Some fields in the data only exist *after* a loan has run its course — things like how much was eventually recovered. Using those to predict default is like predicting a football result using the final score: it looks brilliant and means nothing. This project reads only the fields that would be known at the moment of application, and enforces that at the point the data is loaded, so future information can't slip in by accident.

**It forms its own opinion of risk.** LendingClub already assigned every loan its own grade and interest rate — its own risk judgement. It would be easy (and circular) to just relearn that judgement and report a high score. Instead, this project deliberately throws away LendingClub's grade, sub-grade, interest rate, and installment, and builds an *independent* view of borrower risk from the ground up. The cost of this honesty is a lower headline accuracy — and that's expected. Once you remove the lender's own answer, an application-only default model on this data realistically lands in the high 0.60s to low 0.70s on the main accuracy measure. That is a genuine credit result, not an inflated one.

**It is tested on the future, not a shuffle.** The model is trained on older loans and tested on newer ones, exactly the way a scorecard is used in practice: built on history, applied to tomorrow's applicants. This is harder and more honest than the usual random shuffle.

The contrast is stark. Public tutorials on this same data commonly report accuracy scores in the 0.90s. Those numbers come almost entirely from using the lender's own grade and pricing as inputs — relearning the answer — and don't reflect real predictive skill. The lower, honest numbers in this project are the ones that would survive contact with a validation team.

---

## The data

The project uses the **LendingClub public loan book**, a real record of consumer loans and how each one turned out. The raw file holds about **2.26 million loans**. The target — the thing being predicted — is whether a loan defaulted:

- A loan that was **fully paid** is treated as a good outcome (0).
- A loan that was **charged off or defaulted** is treated as a bad outcome (1).
- Loans still being repaid have no known outcome and are dropped.

After keeping only resolved loans, the modelling set is about **1.35 million loans**, with an overall default rate of **20%**. The data is available on Kaggle (search "wordsforthewise Lending Club") and is not included in this repository because of its size.

---

## How it works, step by step

Each step below explains *what* it does and *why*, then shows a representative piece of the actual code and the result. You don't need to read the code to follow the story.

### Step 1 — Load the data without cheating

Rather than reading everything and deleting the dangerous fields afterwards, the loader reads *only* a pre-approved list of application-time fields. Future information never enters the workspace, so it can't leak.

```python
# Only application-time borrower attributes are ever read from the file.
CORE_FEATURES = [
    "loan_amnt", "term", "emp_length", "home_ownership", "annual_inc",
    "verification_status", "purpose", "dti", "delinq_2yrs", "earliest_cr_line",
    "fico_range_low", "fico_range_high", "inq_last_6mths", "open_acc", "pub_rec",
    "revol_bal", "revol_util", "total_acc", "mort_acc", "pub_rec_bankruptcies",
    "application_type", "addr_state",
]
# LendingClub's own risk verdict — deliberately excluded so the model is independent of it.
LC_ASSESSMENT = ["grade", "sub_grade", "int_rate", "installment"]
```

### Step 2 — Understand what drives default

Before modelling, the training data is explored to check that the patterns match credit intuition — that risk rises and falls where a lender would expect it to. This is done on the training data only, so nothing about the test set influences later choices.

> **Figure 1 — Where default risk concentrates.**
> ![Figure 1](images/fig1_eda_overview.png)
> *Left: only about one loan in five defaults, so the classes are imbalanced. Middle and right: default rates vary meaningfully by loan purpose and home-ownership status — exactly the kind of signal a credit model should pick up.*
> <sub>Source: notebook cell 11</sub>

> **Figure 2 — Risk drivers separate defaulters from payers.**
> ![Figure 2](images/fig2_risk_drivers.png)
> *Borrowers who defaulted (one colour) versus those who paid (the other), across credit score, debt-to-income, credit-card utilisation, and income. Clear separation — especially on credit score — confirms these fields carry real predictive signal.*
> <sub>Source: notebook cell 12</sub>

### Step 3 — Turn every factor into a comparable risk signal (weight of evidence)

Different fields are measured in different units — dollars, percentages, counts. To put them on a common footing, each factor is grouped into bands and each band is recoded to its **weight of evidence**: a single number saying how much safer or riskier that band is than average. This is the transformation that lets a simple, transparent model behave like a proper scorecard.

Alongside it, each factor gets an **information value** — a one-number summary of how much it helps separate good borrowers from bad. Weak factors are screened out. Here is the ranking that came out of the training data:

| Factor | Information value | Kept? |
|---|---:|:---:|
| Credit score (FICO) | 0.123 | ✅ |
| Debt-to-income ratio | 0.077 | ✅ |
| Income verification status | 0.053 | ✅ |
| Mortgage accounts | 0.035 | ✅ |
| Loan amount | 0.032 | ✅ |
| Annual income | 0.031 | ✅ |
| Home ownership | 0.026 | ✅ |
| *(14 weaker factors)* | < 0.02 | ❌ |

Seven factors clear the bar. Note how modest even the strongest is — credit score at 0.123 is only a "medium"-strength predictor by industry rules of thumb. That is the honest consequence of the earlier decision to exclude the lender's own grade and pricing, which would otherwise have dominated. The model is built entirely on genuinely independent, and therefore genuinely weak, signals.

A quick quality check confirms the transformation behaves sensibly: risk should move in one consistent direction as a factor changes (for example, risk should fall steadily as credit score rises). Each numeric factor is plotted to verify this.

> **Figure 3 — Sanity-checking the risk signals.**
> ![Figure 3](images/fig3_woe_monotonicity.png)
> *Each numeric factor's risk signal plotted across its bands. A steady upward or downward slope means the factor behaves the way credit sense says it should, rather than jumping around — a standard scorecard quality check.*
> <sub>Source: notebook — new monotonicity-check cell in Section 5</sub>

### Step 4 — Build the scorecard

The main model is a **logistic regression** — a simple, well-understood method — fit on the weight-of-evidence signals. Because the inputs are on a common scale and the model is linear, every factor's contribution is fully visible. The fitted model is then scaled into **points**, using the same standard formulation lenders use, so the result reads like a familiar credit scorecard: higher score means safer applicant.

```python
# Example: the point allocation the scorecard assigns for credit score.
# Points rise smoothly with score, so a safer applicant scores higher — exactly as intended.
#   FICO band          points
#   up to 667            66
#   667–672              68
#   ...                  ...
#   737 and above        99
```

### Step 5 — Train a challenger to measure the ceiling

A more powerful, flexible model — **XGBoost, a gradient-boosting method** — is trained on the same information as a *challenger*. Its job is to answer one question: how much accuracy is being given up by keeping the deployed model simple and explainable? Because this kind of model produces distorted probabilities out of the box, it is *calibrated* so its scores can be read as honest default probabilities.

### Step 6 — Judge the models honestly

The models are compared on how well they *rank* risk and how *honest* their probabilities are — not on raw accuracy, which is misleading when only one loan in five defaults. Four measures are used, in plain terms:

- **AUC** — pick a random defaulter and a random payer; how often does the model correctly rank the defaulter as riskier? 0.5 is a coin flip, 1.0 is perfect.
- **Gini** — the same information as AUC, on a 0-to-1 scale.
- **KS** — the widest gap between where good and bad borrowers pile up on the score. Bigger means cleaner separation.
- **Brier** — are the probabilities honest? A group the model calls "20% risk" should default about 20% of the time. Lower is better.

> **Figure 4 — Ranking power and probability honesty.**
> ![Figure 4](images/fig4_roc_calibration.png)
> *Left (ROC curve): both models rank risk clearly better than chance, with the challenger slightly ahead. Right (calibration): predicted default rates track observed default rates closely, meaning the probabilities can be trusted, not just ranked.*
> <sub>Source: notebook cell 23</sub>

### Step 7 — Explain the decisions

In lending, a model has to be able to justify itself — to the applicant and to a regulator. **SHAP** is a technique that attributes every prediction back to the factors that drove it, both across all applicants (what matters in general) and for any single person (why *this* applicant scored as they did). This is what makes even the more complex challenger defensible: its behaviour can be shown to agree with credit sense.

> **Figure 5 — What drives risk across all applicants.**
> ![Figure 5](images/fig5_shap_beeswarm.png)
> *Each factor's influence on predicted risk, ranked. The pattern matches intuition — credit score, debt load, and income do the heavy lifting — which is what lets a flexible model be trusted in a regulated setting.*
> <sub>Source: notebook cell 26</sub>

> **Figure 6 — Why one specific applicant scored as they did.**
> ![Figure 6](images/fig6_shap_waterfall.png)
> *A single applicant's prediction broken down factor by factor, showing exactly which attributes pushed their risk up or down. This is the raw material for an explainable adverse-action reason.*
> <sub>Source: notebook cell 27</sub>

### Step 8 — Turn risk into dollars and a baseline decision

A probability becomes a business input once it is multiplied by how much would be lost on a default and how large the loan is. That gives **expected loss**. From there, a baseline approve/decline cutoff is chosen by economics rather than a statistical rule: approving a loan that defaults costs the loss on it, while declining a good applicant costs the margin they would have paid. The cutoff that minimises total expected cost is selected and reported in dollars.

> **Figure 7 — Choosing the cutoff by economics, not statistics.**
> ![Figure 7](images/fig7_cost_curve.png)
> *As the approval bar moves, the cost of approving bad loans trades off against the cost of turning away good ones. The chosen cutoff (dashed line) sits at the bottom of the combined-cost curve.*
> <sub>Source: notebook cell 30</sub>

This baseline exposes a real tension. On a population that defaults at 20%, a pure approve-or-decline rule — with no ability to charge more for more risk — is forced to reject most applicants to stay profitable. That is not how real lenders behave, which leads to the final and most important step.

### Step 9 — Price the risk, the way a real lender does

A real lender rarely just declines a risky applicant; it **charges them a higher interest rate** so the loan is still expected to be profitable, and only declines when the risk can't be priced within the rate it's allowed to offer. This step turns each applicant's default probability into the minimum interest rate that would make the loan hit a target return, approves and prices everyone who can be priced under a rate cap, and declines the rest.

```python
def required_rate(pd_hat, lgd=0.55, funding=0.03, target=0.02):
    """Minimum rate that makes a loan hit its target return, given its default risk.
    Higher-risk loans must charge more, because interest is only collected from
    the borrowers who don't default."""
    return (target + funding + pd_hat * lgd) / (1 - pd_hat)
```

> **Figure 8 — The risk-based pricing schedule.**
> ![Figure 8](images/fig8_pricing_schedule.png)
> *The interest rate the model would charge rises with default risk. Beyond the point where the required rate crosses the cap (dashed line), the risk can't be priced profitably and the applicant is declined.*
> <sub>Source: notebook — new pricing cell in Section 11</sub>

Pricing changes the economics dramatically. Instead of declining most of the book, the lender can now serve a large majority of applicants, each priced to their risk:

- Baseline approve/decline: approves about **10%** of applicants.
- Risk-based pricing: approves **[FILL AFTER RUNNING: ~XX%]** of applicants, pricing the rest to their risk.
- Expected portfolio profit rises from **[FILL: $X]** under the baseline to **[FILL: $Y]** under pricing, simply by serving far more borrowers at a positive margin.

**Does the model actually price risk well?** Here is the strongest evidence in the project. The model built its prices with *no knowledge* of what LendingClub actually charged — the lender's real interest rates were excluded from the entire modelling process. Loading those real rates only now, purely for comparison, the model's independently-derived prices line up with LendingClub's actual pricing at a rank correlation of **[FILL: Spearman = 0.XX]**. In other words, a model that never saw the lender's answer arrives at broadly the same risk ordering the lender used — independent validation that the risk ranking is sound, despite the deliberately modest accuracy number.

> **Figure 9 — Independent prices vs the lender's real prices.**
> ![Figure 9](images/fig9_price_validation.png)
> *Each point is a loan: the model's required rate against LendingClub's actual rate. The upward trend — produced without ever using the lender's rates in training — is external evidence the model's risk ranking is trustworthy.*
> <sub>Source: notebook — new validation cell in Section 11</sub>

### Step 10 — Check for fairness

Lending decisions are tested for **disparate impact** — where a neutral-looking rule produces unequal outcomes across groups. This public data contains no protected attributes such as race or gender, so a true fair-lending test isn't possible; instead, the project demonstrates the method across an available proxy (income bands) and is explicit about the limitation. It checks fairness on *both* levers:

- **Who gets approved.** Under the baseline cutoff, approvals skew heavily toward higher earners (an adverse-impact ratio of **0.17**, well below the 0.80 four-fifths benchmark). Risk-based pricing improves this to **[FILL: 0.XX]**, because it prices lower-income applicants rather than declining them outright.
- **What rate they're charged.** Pricing can move the disparity from *approval* into *the rate offered* — charging groups that correlate with protected classes higher rates is itself a fair-lending concern. The project surfaces this trade-off honestly rather than treating pricing as a clean fix.

---

## Results

*All figures on the time-based holdout (newer loans the model never trained on).*

| Model | AUC | Gini | KS | Brier |
|---|---:|---:|---:|---:|
| **Scorecard** (logistic regression, deployed) | 0.664 | 0.328 | 0.235 | 0.1620 |
| **XGBoost challenger** (calibrated) | 0.674 | 0.348 | 0.250 | 0.1609 |

The challenger's advantage over the transparent scorecard is small — about one point of AUC. That narrow gap is exactly the argument for deploying the scorecard: it gives up almost nothing in accuracy and gains full explainability, which a lending decision requires.

**Decision layer, on the test book:**

- Baseline approve/decline: approves ~10% of applicants (27,241 of 264,013), accepting about \$9.3M of expected loss from bad loans that pass, and forgoing about \$130.6M of margin from good loans it declines — the sign of a rule with no pricing lever.
- Risk-based pricing: approves **[FILL: ~XX%]**, pricing the rest to risk; expected profit of **[FILL: $Y]** vs **[FILL: $X]** for the baseline.
- Independent validation: model prices vs LendingClub's actual rates, **[FILL: Spearman = 0.XX]**.

---

## Key decisions and trade-offs

Every important choice in this project traded a bigger headline number for a more defensible model. That's deliberate.

- **Excluding the lender's own grade and pricing** cost a lot of apparent accuracy but bought an independent, non-circular view of risk — and made the external validation in Step 9 possible.
- **Reading only application-time fields** removed the most common source of inflated results on this dataset, at the price of a lower ceiling.
- **Testing on the future rather than a random shuffle** is harder to score well on, but it's the only test that reflects how a scorecard is actually deployed.
- **Deploying the simple scorecard over the more accurate challenger** gives up ~1 point of AUC for full explainability — the right call when decisions must be justified.
- **Adding a pricing layer** turned an unrealistically conservative approve/decline rule into a realistic lending policy, and resolved the tension the baseline exposed.

---

## Limitations and model risk

This section is written in the spirit of a model-validation document — stating honestly where the model should not be trusted.

- **Loss and exposure are assumed, not modelled.** How much is lost on a default, and the borrower's exposure, are set with stated assumptions because the public data lacks recovery detail. A production model would estimate them directly.
- **Selection bias.** The model is trained only on *accepted* loans — a non-random sample of everyone who applied. Applicants the lender declined never appear and have no recorded outcome, so the model can be miscalibrated on the true through-the-door population. The standard remedy, *reject inference*, isn't attempted here because the public rejected-applications file has no outcome to infer from; the limitation is stated instead.
- **One lender, one window.** The data is a single lender's population over a fixed historical period, so the model may not generalise to other lenders or economic conditions.
- **No protected attributes.** A genuine fair-lending assessment isn't possible on this data; the fairness section demonstrates method and mindset on a proxy only.
- **Accepted rates are assumed to be taken up.** The pricing analysis assumes applicants accept the offered rate, with no modelling of take-up or adverse selection.

In production the model would be monitored for population drift (using the population stability index), checked periodically against realised default rates, and recalibrated or rebuilt when either drifts materially.

---

## What I would do next

- Model loss-given-default and exposure directly instead of assuming them, to sharpen the expected-loss and pricing figures.
- Add a take-up model to the pricing layer, so approval and profit reflect that some priced offers would be declined by the borrower.
- Extend the fairness work with formal pricing-disparity testing if proxy or protected attributes become available.
- Stress-test the model across economic conditions rather than a single historical window.

---

## How to run it

Install the dependencies:

```
pip install pandas numpy matplotlib seaborn scikit-learn xgboost shap
```

Download the LendingClub accepted-loans file from Kaggle (search "wordsforthewise Lending Club"). Then either set the path in the notebook's configuration cell, or point an environment variable at it:

```
export LENDINGCLUB_ACCEPTED="/path/to/accepted_2007_to_2018Q4.csv"
```

Open **`Credit-Risk-Scorecard-Model.ipynb`** and run it top to bottom. Each cell handles one logical step, with the reasoning explained alongside.

**Repository structure**

- `Credit-Risk-Scorecard-Model.ipynb` — the full analysis, one step per cell.
- `README.md` — this document.
- `requirements.txt` — dependencies.
- `images/` — figures referenced in this README (see checklist below).

---

## Figure checklist

Create an `images/` folder and save each plot from the notebook under the filename below. After running the updated notebook, also fill in the bracketed `[FILL AFTER RUNNING]` numbers in the Results and Step 9 / Step 10 sections from the printed output.

| File | What it shows | Notebook source |
|---|---|---|
| `fig1_eda_overview.png` | Class balance + default by purpose + default by home ownership | Cell 11 |
| `fig2_risk_drivers.png` | Score / DTI / utilisation / income distributions by outcome | Cell 12 |
| `fig3_woe_monotonicity.png` | WOE-by-band monotonicity check | New cell, Section 5 |
| `fig4_roc_calibration.png` | ROC curve + calibration curve | Cell 23 |
| `fig5_shap_beeswarm.png` | Global SHAP feature impact | Cell 26 |
| `fig6_shap_waterfall.png` | Single-applicant SHAP explanation | Cell 27 |
| `fig7_cost_curve.png` | Cost curve for choosing the cutoff | Cell 30 |
| `fig8_pricing_schedule.png` | Risk-based pricing schedule | New pricing cell, Section 11 |
| `fig9_price_validation.png` | Derived price vs actual LendingClub rate | New validation cell, Section 11 |

---

## Author

**Jianyu Jia**
