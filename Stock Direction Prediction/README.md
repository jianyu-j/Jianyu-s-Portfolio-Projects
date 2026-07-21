# Predicting Next-Day Stock Direction Under Market Regime Shift

A machine learning pipeline that predicts whether a stock rises or falls the next trading day — built as a case study in **finding real signal in noisy data without fooling yourself**. Training data (2000–2023) and test data (2024–2026) come from fundamentally different market regimes, so the real challenge isn't accuracy — it's **generalization**.

<!-- Replace with your actual screenshots -->
![Decision Matrix](assets/decision_matrix.png)
_Feature selection decision matrix — each feature's predictive power (SHAP) vs. its distribution-shift risk (adversarial validation). The best features are top-left: predictive **and** stable across market eras._

![Ablation Results](assets/ablation_results.png)
_The key finding: the feature set with the **worst** cross-validation score generalized **best** on the held-out 2024–2026 test set._

> Full annotated analysis: [`stock_direction_prediction.ipynb`](stock_direction_prediction.ipynb)

---

## What is this?

A binary classification problem: given 27 technical indicators for a stock on a given day, predict whether its price closes higher (1) or lower (0) the next day, across 100 anonymized US equities.

Next-day equity direction is close to random — an AUC of 0.500 is a coin flip, and even **0.520 is a meaningful edge** in real trading. So this project isn't about high accuracy. It's about the discipline that faint signal demands:

- **Distribution-shift detection** — measuring how different the train and test eras are *before* modeling.
- **Rigorous feature selection** — separating features that are *predictive* from features that just *look stable* over time, and keeping only those that are both.
- **Generalization over cross-validation** — recognizing when CV score is misleading and trusting held-out performance instead.
- **Ensemble design** — combining models that make genuinely *different* errors, not stacking similar ones for no gain.

## Key Results

| Approach | Held-out AUC | Lesson |
|----------|:---:|--------|
| Three-tree ensemble (all features) | 0.511 | Similar models make similar errors — no diversity benefit |
| All features, z-scored | 0.510 | Shift-prone features flatter CV but hurt the future |
| Shift-risk features dropped | 0.513 | **Lower CV can mean better generalization** |
| LightGBM + Naive Bayes blend | **0.515** | A deliberately different model regularizes a strong one |

For a task where 0.500 is random and 0.520 is a real edge, **0.515 on a genuinely out-of-sample, regime-shifted test set** is a solid result. Every gain came from making the system *simpler or more robust* — never more complex.

## The Approach

Everything follows from one fact: **training spans 2000–2023 (dot-com bust, 2008, COVID) while test spans 2024–2026 (recovery, rate cuts, AI rally).** Different markets — so a model that memorizes history won't transfer.

**1. Adversarial Validation.** Label train rows `0`, test rows `1`, and train a classifier to tell them apart. Its AUC measures the shift. **Result: ~0.86** — the eras are trivially distinguishable, confirming overfitting to a non-repeating regime as the core risk. This produces a per-feature "shift-risk" score used throughout.

**2. SHAP Feature Selection.** Rank features by predictive contribution using **SHAP across three libraries** (CatBoost, XGBoost, LightGBM) — more honest about redundancy than built-in importance, and robust to any one algorithm's quirks. This ranking is **cross-referenced against shift-risk**: SHAP asks "does it help?", adversarial validation asks "will it still help later?" The keepers score well on both.

**3. Per-Stock Normalization.** A 2% move means different things for a utility vs. a growth stock. Each feature is z-scored within each stock (statistics fit on **train only**, to prevent leakage) — the cross-sectional normalization used in systematic trading.

**4. Ablation & Model Diversity.** Testing feature sets directly surfaced the headline result — dropping shift-prone features *lowered* CV but *raised* held-out score. And since three tree models underperformed a single LightGBM (similar models, similar errors), the winning blend pairs LightGBM with a deliberately simple, structurally different model (Naive Bayes, which can't overfit joint noise).

## Setup

**Prerequisites:** Python 3.10+ and Jupyter, or run on [Kaggle](https://www.kaggle.com/) with a GPU kernel.

```bash
git clone https://github.com/jianyu-j/Jianyu-s-Portfolio-Projects.git
cd "Jianyu-s-Portfolio-Projects/Stock Direction Prediction"
pip install numpy pandas matplotlib seaborn scikit-learn catboost xgboost lightgbm shap
```

Place `train.csv`, `test.csv`, and `sample_submission.csv` in `data/`, then point the paths in the `CFG` dataclass at them:

```python
train_path: str = "data/train.csv"
test_path:  str = "data/test.csv"
sample_sub_path: str = "data/sample_submission.csv"
```

**Running on CPU?** In `CFG`, set CatBoost `"task_type": "CPU"` and XGBoost `"device": "cpu"`.

## Running

```bash
jupyter notebook stock_direction_prediction.ipynb
```

Run top to bottom — the notebook is a linear narrative with reasoning documented inline. On a GPU kernel the full pipeline takes ~15–25 min and outputs three submission files (one per ensemble strategy). Multiple submissions are intentional: since CV and held-out performance diverge here, the leaderboard adjudicates rather than a possibly-misleading CV score.

## Key Takeaways

These transfer to any problem with distribution shift — churn, fraud, demand forecasting — well beyond stock prediction:

1. **Measure the shift before modeling it.** Adversarial validation turns a vague worry into a number (0.86) and a ranked list of culprits.
2. **Separate *predictive* from *stable*.** A feature useful now can be useless later; neither measure substitutes for the other.
3. **Distrust CV under distribution shift.** The clearest lesson here: worst-in-CV was best out-of-sample.
4. **Ensemble for difference, not quantity.** One strong model plus one deliberately simple one beat three similar models.

---

*Python · scikit-learn · CatBoost · XGBoost · LightGBM · SHAP*
