# Credit Risk Scorecard and Expected Loss Model

An application-time probability of default model for consumer loans, delivered as an interpretable credit scorecard, benchmarked against a gradient boosting challenger, and translated into expected loss and an approve or decline decision.

## Overview

This project builds a credit risk model of the kind a lending function would use in practice. For each loan application it estimates the borrower's probability of default at the moment of decision, presents that estimate as a transparent points-based scorecard, and converts it into an expected loss and a lending recommendation expressed in dollars. A gradient boosting model is trained alongside the scorecard to measure how much predictive accuracy is given up by keeping the deployed model interpretable, and the work closes with a fairness review and a model-risk summary.

The emphasis throughout is on the discipline that separates a credit model from a generic classifier: no target leakage, an independent view of borrower risk, honest evaluation, and documentation written the way a model validation function would expect.

## Approach

The deployed model is a credit scorecard, a logistic regression fit on weight-of-evidence transformed features and scaled to points. It is the champion because it is interpretable and defensible, which is what a lending decision requires. An XGBoost model serves as the challenger, quantifying the accuracy ceiling and showing that a flexible model can be explained rather than left as a black box. The probability of default feeds an expected loss calculation and a cost-based cutoff, and the final model is reviewed for adverse impact and documented for model risk.

## Key design decisions

**Leakage controlled at load time.** Only application-time fields are read from the data. Fields populated after a loan resolves, such as recoveries or payment history, never enter the modelling frame, which removes the most common source of leakage in this dataset before any modelling begins.

**Independent of the lender's own decision.** LendingClub's own **grade**, **sub_grade**, **int_rate**, and **installment** are excluded. These encode the lender's existing risk assessment, and excluding them means the model reflects an independent view of borrower risk rather than reproducing a decision that has already been made.

**Time-based validation.** The train and test split is by loan issue date, so the model is fit on earlier loans and tested on later ones. This mirrors real deployment and avoids the leakage a random split can introduce when loans from the same period share economic conditions.

**Honest metrics.** Discrimination is measured with AUC, Gini, and the KS statistic, computed from predicted probabilities rather than thresholded labels. Calibration is measured with the Brier score and a calibration curve, because a probability of default that drives provisioning has to be trustworthy, not only well ranked.

## Data

The project uses the LendingClub public loan book, the accepted-loans file covering real consumer loans with their final status. The target is a binary default flag defined from resolved outcomes: fully paid loans are treated as goods, charged-off and defaulted loans as bads, and loans still in repayment are excluded because their outcome is unknown. The dataset is available on Kaggle under wordsforthewise, Lending Club, and is not included in this repository because of its size.

## Results

*Reported on the time-based holdout. Bracketed values are filled from the notebook output.*

Scorecard, logistic regression on weight of evidence: AUC [0.XX], Gini [0.XX], KS [0.XX], Brier [0.XXXX]

XGBoost challenger, calibrated: AUC [0.XX], Gini [0.XX], KS [0.XX], Brier [0.XXXX]

Once leakage and the lender's own assessment are removed, an application-only default model on this data ranks in the high 0.60s to low 0.70s on AUC, and the challenger's gain over the interpretable scorecard is modest. That trade-off is the reason the scorecard remains the sensible deployment choice.

At the cost-minimising cutoff, the model approves [N] of [M] loans on the test book, accepting [$X] of expected loss from the bad loans that pass and forgoing [$Y] of margin from the good loans it declines.

## Pipeline

1. Data loading and target definition
2. Cleaning and feature preparation
3. Time-based train and test split
4. Exploratory analysis
5. Weight of evidence transformation and information value screening
6. Credit scorecard, scaled to points
7. Gradient boosting challenger with probability calibration
8. Evaluation and comparison
9. Interpretability with SHAP
10. Probability of default to expected loss and the lending decision
11. Fairness and adverse-impact review
12. Model-risk summary

## Interpretability and fairness

The challenger is explained with SHAP, which attributes each prediction to its features and gives both a global view of what drives default risk and a local explanation for any single applicant. This is what allows a non-linear model to be considered for a decision that must be justified to an applicant and a regulator. The project also runs a proxy adverse-impact review across available segments. The public data contains no protected attributes, so this demonstrates the method and mindset while stating clearly that a full fair-lending assessment would require attributes the data does not hold.

## Model risk and limitations

Loss given default and exposure at default are set with stated assumptions rather than modelled, because the public data lacks recovery detail, and the cutoff uses an assumed net interest margin. The model is built on a single lender's population that may not generalise, uses a fixed historical window rather than through-the-cycle coverage, and cannot be assessed for protected-class fairness. In production the model would be monitored for population drift using the population stability index, checked periodically for calibration against realised default rates, and recalibrated or redeveloped when either drifts materially.

## Repository structure

**Credit-Risk-Scorecard-Model.ipynb** is the full analysis, structured one logical step per cell with the reasoning explained at each stage.

**README.md** is this document.

**requirements.txt** lists the dependencies.

## How to run

Install the dependencies:

```
pip install pandas numpy matplotlib seaborn scikit-learn xgboost shap
```

Download the LendingClub accepted-loans file from Kaggle, set the data path in the configuration cell of the notebook, and run it from top to bottom.

## Author

Jianyu Jia
